
import { Java } from "../language/java";
import { htmlLanguage } from "@codemirror/lang-html";

export class SourceFile{
  constructor(name,fileType,project){
    this.name=name;
    this.fileType=fileType;
    this.useGlobalCSS=true;
    this.project=project;
    this.attributeErrors=null;
    this.errors=[];
    this.isHidden=false;
    this.superClazz=Java.clazzes.HtmlPage;
    /**der erste Kindknoten des ClassBody: */
    this.src="";
  }
  getSaveObject(){
    let o={};
    o.name=this.name;
    o.src=this.src;
    o.isHidden=this.isHidden;
    o.fileType=this.fileType;
    o.useGlobalCSS=this.useGlobalCSS;
    return o;
  }

  restoreFromSaveObject(obj){
    if(obj.name){
      this.name=obj.name;
    }else{
      this.name=null;
    }
    if(obj.src){
      this.src=obj.src;
    }else{
      this.src="";
    }
    if(obj.useGlobalCSS){
      this.useGlobalCSS=obj.useGlobalCSS;
    }else{
      this.useGlobalCSS=true;
    }
    this.fileType=obj.fileType;
    this.isHidden=false;
    if(obj.isHidden){
      this.isHidden=true;
    }
  }
  compile(){
    
  }
  compileDeclaration(){}
  compileDeclarationTypeParameters(){}
  compileMemberDeclarations(){}
  compileMethods(){}
  resolveSuperClazz(){}
  generateSrcAndTree(){}
  getMethodByPosition(){}
  getRealSuperClazz(){
    return this.superClazz;
  }
  getRuntimeInfos(){ }
  hasStaticMainMethod(){
    return false;
  }
  getAllAttributeNames(){
    return [];
  }
  isUIClazz(){return false;}
  isNative(){return false;}
  getStringifiedSourceCode(){
    let src=this.src;
    if(this.useGlobalCSS && this.project.css.trim().length>0){
      let css=this.project.prepareCSS(this.project.css);
      let pos=src.indexOf("<head");
      if(pos>=0){
        pos=src.indexOf(">",pos+1);
        if(pos>=0){

          src=src.substring(0,pos+1)+"\n<style>\n"+css+"\n</style>\n"+src.substring(pos+1);
        }
      }
    }
    let tree=htmlLanguage.parser.parse(src);
    console.log(tree);
    let changes=[];
    tree.cursor().iterate((cursor)=>{
      let content;
      if(cursor.name==="AttributeName"){
        content=src.substring(cursor.from,cursor.to);
        if(content==="href"){
          let node=cursor.node;
          console.log(content,node.name);
          let attribute=node.parent;
          let value=attribute.lastChild;
          let sValue=src.substring(value.from,value.to);
          let tagname=attribute.parent.firstChild.nextSibling;
          let sTagname=src.substring(tagname.from,tagname.to);
          let len=sValue.length;
          if(sValue.substring(1,5)!=="http"){
            if(sTagname==="a"){
              if(sValue.substring(len-6,len-1)===".html"){
                let change={
                  from: value.from,
                  to: value.to,
                  ov: sValue,
                  nv: "javascript:$showPage("+JSON.stringify(sValue.substring(1,len-6))+")"
                }
                changes.push(change);
              }
            }
          }
        }
      }
      return true;
    });
    console.log(changes);
    if(changes.length>0){
      changes.sort((a,b)=>{
        return a.from-b.from;
      });
      let parts=[];
      let c=changes[0];
      //parts.push(src.substring(0,c.from));
      let last=0;
      for(let i=0;i<changes.length;i++){
        let c=changes[i];
        parts.push(src.substring(last,c.from));
        parts.push(c.nv);
        last=c.to;
      }
      parts.push(src.substring(last));
      src=parts.join("");
    }
    src+=`\n<script>
      function $showPage(s){
        //TODO: nachricht an parentWindow: Seite wechseln!
        window.parent.postMessage({
          type: "showPage",
          data: s
        });
      }
      function $replaceObjectURLs(){
        console.log("replace object urls");
        let els=document.querySelectorAll("[href]");
        for(let i=0;i<els.length;i++){
          let e=els[i];
          let href=e.getAttribute('href');
          console.log("e",e,e.href,window.$servedFiles[e.href],e.getAttribute('href'));
          let file=window.$servedFiles[href];
          if(file){
            e.href=file.url;
          }
        }
      }
      window.$servedFiles=(`;
    src=JSON.stringify(src);
    src+="+JSON.stringify(window.$servedFiles)+\");console.log('served',window.$servedFiles);$replaceObjectURLs();</script>\";";
    src=src.replace(/</g,"\\x3C");
    return src;
  }
  getJavaScriptCode(){
    if(this.fileType==="html"){
      return this.getHtmlJavaScriptCode();
    }else{
      return this.getServeFileJavaScriptCode();
    }
  }
  getUIPreviewCode(){
    let code=this.project.getUIPreviewCode(this);
    return code;
  }
  getServeFileJavaScriptCode(){
    let code=`\n$serveFile(${JSON.stringify(this.name+"."+this.fileType)},${JSON.stringify(this.src)},${JSON.stringify(this.fileType)})\n`;
    return code;
  }

  getHtmlJavaScriptCode(){
    let code="class "+this.name+" extends HtmlPage";
    code+="{";
    code+="\nstatic $self;\n";//=$new("+this.name+");";
    code+=`static async $createSelf(){
      ${this.name}.$self=$new(${this.name});
      let code=${this.getStringifiedSourceCode()};
      //code+="\\x3Cscript>window.$servedFiles=("+JSON.stringify(window.$servedFiles)+");$replaceObjectURLs();\\x3C/script>";
      //code=code.replace(/</g,"\\x3C");
      ${this.name}.$self.$el.srcdoc=code;
      let p=new Promise((fulfill,reject)=>{
        ${this.name}.$self.$el.onload=async (ev)=>{
          fulfill();
        }
        ${this.name}.$self.$el.onerror=(ev)=>{
          reject();
        } 
      }); 
      await p;
    }`;
    code+="\nasync $constructor(){";
    code+="await super.$constructor();";
    code+="\nreturn this;"
    code+="\n}";

    code+="\n}";
    return code;
  }

  getMethod(name,staticAccess){
    
    let m;
    m=this.superClazz.getMethod(name,staticAccess);
    if(m && m.error){
      m=null;
    }
    if(!m){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    if(staticAccess){
      if(m.isStatic && m.isStatic() || m.static){
        return m;
      }else{
        return {
          error: "Die Methode '"+name+"' ist nicht statisch."
        };
      }
    }else{
      if(m.isStatic && m.isStatic() || m.static){
        return {
          error: "Die Methode '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"(...)' um darauf zuzugreifen."
        };
      }else{
        return m;
      }
    }
  }

  toString(){
    return this.name;
  }

  
}