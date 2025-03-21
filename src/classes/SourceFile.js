
import { createAttribute } from "../language/helper/createAttribute";
import { Java } from "../language/java";
import { htmlLanguage } from "@codemirror/lang-html";
//import {Tree, MountedTree, InnerParse, TreeNode, checkRanges, Range, materialize, enterFragments} from "@lezer/common";

export class SourceFile{
  constructor(name,fileType,project){
    this.name=name;
    this.fileType=fileType;
    this.useGlobalCSS=true;
    this.project=project;
    this.attributeErrors=null;
    this.attributes={};
    this.errors=[];
    this.isHidden=false;
    this.isEditorShown=true;
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

  getAttribute(name,staticAccess){
    
    let a=this.attributes[name];
    if(!a && this.superClazz){
      a=this.superClazz.getAttribute(name,staticAccess);
      if(a && a.error){
        a=null;
      }
    }
    if(!a){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'."
      };
    }
    if(staticAccess){
      if(a.isStatic && a.isStatic() || a.static){
        return a;
      }else{
        return {
          error: "Das Attribut '"+name+"' ist nicht statisch.",
          clazzHasAttribute: true
        };
      }
    }else{
      if(a.isStatic && a.isStatic() || a.static){
        return {
          error: "Das Attribut '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"' um darauf zuzugreifen.",
          clazzHasAttribute: true
        };
      }else{
        return a;
      }
    }
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
    this.attributes={};
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
    let changes=[];
    tree.cursor().iterate((cursor)=>{
      let content;
      if(cursor.name==="AttributeName"){
        content=src.substring(cursor.from,cursor.to).toLowerCase();
        if(content==="href" || content==="src"){
          let node=cursor.node;
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
            }else if(sTagname==="img"){
              let assetName=sValue.substring(1,sValue.length-1);
              let asset=this.project.getAssetByName(assetName);
              if(asset){
                //referencedAssets[assetName]=asset;
                //t+="var(--"+assetName+")";
                let change={
                  from: value.from,
                  to: value.to,
                  ov: sValue,
                  nv: asset.file.code
                };
                changes.push(change);
              }
            }
          }
        }else if(content==="id"){
          let node=cursor.node;
          let attribute=node.parent;
          let value=attribute.lastChild;
          let id=src.substring(value.from+1,value.to-1);
          this.attributes[id]=createAttribute({
            name: id,
            type: "HTMLElement"
          },this,true,"public");
        }
      }
      return true;
    });
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
    let mainClazz=this.project.getMainClazz();
    let javaAPI="";
    if(mainClazz){
      for(let mn in mainClazz.methods){
        javaAPI+=mn+": async function(){return await $java('"+mn+"',arguments)},"
      }
    }
    
    src=`<script>window.onerror=function(error, source, line, col, event){$reportError({error,line,col, file: ${JSON.stringify(this.name)}})}; function $reportError(data){window.parent.postMessage({type: 'reportError', data })}</script>`+src;
    src+=`\n<script>
      $main={
        ${javaAPI}
      };
      async function $java(funcName, arguments){
        let data={
          methodName: funcName,
          args: []
        };
        for(let i=0;i<arguments.length;i++){
          data.args.push(arguments[i]);
        }
        let p=new Promise((ful,rej)=>{
          window.$fullfillPromise=function(res){
            console.log("fulfill",res);
            ful(res);
          }
          window.parent.postMessage({
            type: "callMethod",
            data
          });
        });
        let q=await p;
        return q;
      }
      function $showPage(s){
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
        if(!window.$servedFiles) return;
        els=document.querySelectorAll("[src]");
        for(let i=0;i<els.length;i++){
          let e=els[i];
          let src=e.getAttribute('src');
          let file=window.$servedFiles[src];
          console.log("src",e,src,file);
          if(file){
            const s = document.createElement('script');
            s.src = file.url;
            document.body.appendChild(s);
            
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
    let src=this.src;
    let code=`\n$serveFile(${JSON.stringify(this.name+"."+this.fileType)},${JSON.stringify(src)},${JSON.stringify(this.fileType)})\n`;
    return code;
  }

  getHtmlJavaScriptCode(){
    let code="class "+this.name+" extends HtmlPage";
    code+="{";
    code+="\nstatic $self;\n";//=$new("+this.name+");";
    let attributesCode="";
    // for(let i in this.attributes){
    //   let a=this.attributes[i];
    //   attributesCode+="\n"+a.getDeclarationJavaScriptCode()+";";
    // }
    // code+=attributesCode;
    code+=`static async $createSelf(){
      ${this.name}.$self=$new(${this.name});
      ${this.name}.$self.$el.id="${this.name}.html";
      let code=${this.getStringifiedSourceCode()};
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