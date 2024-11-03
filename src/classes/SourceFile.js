import { nextTick } from "vue";
import { concatArrays } from "../functions/helper";
import { parseJava } from "../functions/parseJava";
import { SuperInterfaces } from "../language/compile/SuperInterfaces";
import { TypeParameters } from "../language/compile/TypeParameters";
import { createAttribute } from "../language/helper/createAttribute";
import { Java } from "../language/java";
import {Attribute} from "./Attribute"
import { Method } from "./Method";
import { options } from "./Options";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Type } from "./Type";
import  * as autocomplete  from "@codemirror/autocomplete";
import { createMethod } from "../language/helper/createMethod";
import { parseComments } from "../functions/parseComments";
import { htmlLanguage } from "@codemirror/lang-html";

export class SourceFile{
  constructor(name,fileType,project){
    this.name=name;
    this.fileType=fileType;
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
  getUIPreviewCode(){
    return this.src;
  }
  getStringifiedSourceCode(){
    let src=this.src;
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
          if(sTagname==="a"){
            let len=sValue.length;
            if(sValue.substring(1,5)!=="http" && sValue.substring(len-6,len-1)===".html"){
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
    </script>`;
    src=JSON.stringify(src);
    src=src.replace(/</g,"\\x3C");
    return src;
  }
  getJavaScriptCode(){
    let code="class "+this.name+" extends HtmlPage";
    code+="{";
    code+="\nstatic $self;\n";//=$new("+this.name+");";
    code+=`static async $createSelf(){
      ${this.name}.$self=$new(${this.name});
      ${this.name}.$self.$el.srcdoc=${this.getStringifiedSourceCode()};
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
    console.log(JSON.stringify(this.src));
    // code+="\nconst blob = URL.createObjectURL(new Blob(["+JSON.stringify(this.src)+"], { type: 'text/html' }));";
    // code+="\nthis.$el.src=blob;";
    // code+="\nURL.revokeObjectURL(blob);";
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