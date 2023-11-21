import  * as autocomplete  from "@codemirror/autocomplete";
import {CompletionContext} from "@codemirror/autocomplete";
import {Type} from "../../classes/Type";
import {createParamsString,snippets} from '../snippets'
import {Java} from '../../language/java';
import {getClazzFromState} from './getClazzFromState';
import { PrimitiveType } from "../../classes/PrimitiveType";

const completePropertyAfter = ["PropertyName", ".", "?."]
const dontCompleteIn = ["TemplateString", "LineComment", "BlockComment",
                        "VariableDefinition", "PropertyDefinition"]

function getRealNodeBefore(node,pos){
  if(node && node.firstChild && !node.firstChild.type.isError && node.firstChild.to<pos){
    let n=node.firstChild;
    while(n && n.nextSibling && !n.nextSibling.type.isError && n.nextSibling.to<pos){
      n=n.nextSibling;
    }
    return getRealNodeBefore(n,pos);
  }else{
    return node;
  }
}

export function createAutocompletion(){
  return (context)=>{
    let clazz=getClazzFromState(context.state);
    if(!clazz) return;
    let pos=context.pos;
    let project=app.$refs.editor.project;
    console.log("autocomplete");
    let lastTypedCharacter=context.state.doc.sliceString(context.pos-1,context.pos);
    if(["{","}",",",";","[","]","(",")"].indexOf(lastTypedCharacter)>=0) return;
    let nodeBefore = context.state.tree.resolveInner(pos, -1);
    nodeBefore=getRealNodeBefore(nodeBefore,pos);
    if(!nodeBefore) return;
    if(dontCompleteIn.includes(nodeBefore.name)) {
      console.log("dont autocomplete",nodeBefore.name);
      return;
    }
    if(nodeBefore.name===";"){
      return;
    }
    let method=clazz.getMethodByPosition(pos);
    
    let from;
    if(!method){
      let options=[];
      from=nodeBefore.from;
      if(clazz.isMainClazz()){
        for(let i=0;i<snippets.eventListeners.length;i++){
          options.push(snippets.eventListeners[i]);
        }
      }else{
        autocomplete.snippetCompletion("public static void main(String[] args){\n\tnew "+clazz.name+"();\n}", {
          label: "main",
          info: "Statische main-Methode.",
          type: "function"
        })
      }
      /**Datentypen und Klassen: */
      for(let dt in Java.datatypes){
        let d=Java.datatypes[dt];
        if(d && d.typeSnippet){
          options.push(d.typeSnippet);
        }
      }
      for(let i=0;i<project.clazzes.length;i++){
        let c=project.clazzes[i];
        let s=autocomplete.snippetCompletion(c.name,{
          label: c.name
        });
        options.push(s);
      }
      return {
        from,
        options,
        span: /^[\w$]*$/
      }
    }
    //console.log("autocomplete: look for annotations");
    
    let annotation;
    if(nodeBefore.name==="Identifier" && !nodeBefore.prevSibling && nodeBefore.parent &&nodeBefore.parent.name==="MethodName"){
      nodeBefore=nodeBefore.parent;
    }
    if(nodeBefore.name==="Identifier" && nodeBefore.prevSibling){
      context.pos=nodeBefore.from;
      nodeBefore=nodeBefore.prevSibling;
    }
    //console.log("autocomplete: nodeBefore",nodeBefore.name);
    if(nodeBefore.prevSibling && nodeBefore.name==="TypeName" && nodeBefore.prevSibling.name==="new"){
      context.pos=nodeBefore.from;
      nodeBefore=nodeBefore.prevSibling;
    }
    if(nodeBefore.name==="new"){
      console.log(context.pos);
      if(context.pos===nodeBefore.to){
        return;
      }
      from=context.pos;
      let options=[];
      let clazzes=app.$refs.editor.project.clazzes;
      for(let i=0;i<clazzes.length;i++){
        let c=clazzes[i];
        let params=c.getConstructorParameters();
        if(params) params=params.parameters;
        options.push(autocomplete.snippetCompletion(c.name+createParamsString(params,true),{
          label: c.name+"(...)",
          type: "function",
          info: c.comment
        }));
      }
      for(let name in Java.clazzes){
        let c=Java.clazzes[name];
        if(c.cannotBeInstantiated || c.name==="null") continue;
        let params=c.getConstructorParameters();
        if(params) params=params.parameters;
        options.push(autocomplete.snippetCompletion(name+createParamsString(params,true),{
          label: name+"(...)",
          type: "function",
          info: c.comment
        }));
      }
      return {
        from,
        options,
        span: /^[\w$]*$/
      }
    }else if(nodeBefore.name==="AssignOp"||nodeBefore.name==="Block"||nodeBefore.name==="["||nodeBefore.name==="("||nodeBefore.name==="{"||nodeBefore.name==="<" || nodeBefore.name==="," || nodeBefore.name==="ArithOp" || nodeBefore.name==="CompareOp" || nodeBefore.name==="return"){
      from=context.pos;
      let scope=method.getScopeAtPosition(from);
      annotation={type: new Type(clazz,0), isStatic: method.isStatic(), topLevel: true, scope};
    }else{
      from=nodeBefore.from;
      if((nodeBefore.name==="Identifier" || nodeBefore.name==="TypeName") && nodeBefore.prevSibling && nodeBefore.prevSibling.name==="."){
        /**zuruecklesen bis zu moeglichem Punkt */
        nodeBefore=nodeBefore.prevSibling;
        from--;
      }
      if(nodeBefore.name==="."){
        from++;
        annotation=method.typeAnnotations[nodeBefore.to-1];
      }else{
        if(nodeBefore.prevSibling && nodeBefore.prevSibling.name!=="(" && !nodeBefore.prevSibling.name.endsWith("Op")){
          nodeBefore=nodeBefore.prevSibling;
          if(nodeBefore && nodeBefore.name==="."){
            nodeBefore=nodeBefore.prevSibling;
          }
          annotation=method.typeAnnotations[nodeBefore.to];
        }else{
          let scope=method.getScopeAtPosition(from);
          annotation={type: new Type(clazz,0), isStatic: method.isStatic(), topLevel: true, scope: scope};
        }
      }
      
    }
    if(annotation){
      return completeProperties(from,annotation.type,annotation.isStatic,annotation.topLevel, method, annotation.scope);
    }
    return null
  };
}

function completeProperties(from, type, isStatic, includeClasses, method, scope) {
  let options = [];
  if(type.dimension>0){
    options.push({
      label: "length",
      type: "variable",
      info: "Die Länge des Arrays."
    });
  }else{
    if(scope){
      let locals=scope.getLocalVariables();
      for(let vname in locals){
        options.push({
          label: vname,
          type: "variable",
          info: "Eine lokale Variable des Typs "+locals[vname].type.toString()
        });
      }
    }
    let clazz=type.baseType;
    if(!(clazz instanceof PrimitiveType)){
      while(clazz){
        let attributeNames=clazz.getAllAttributeNames();
        for (let name in attributeNames) {
          let a=clazz.getAttribute(name,isStatic);
          if(a && !a.error && a.isStatic()===isStatic){
            options.push({
              label: name,
              type: "variable",
              info: a.comment
            });
          }
        }
        clazz=clazz.getRealSuperClazz();
      }
      clazz=type.baseType;
      while(clazz){
        for (let name in clazz.methods) {
          let m=clazz.methods[name];
          if(m.isConstructor()) continue;
          if(m.isStatic()===isStatic){
            options.push(autocomplete.snippetCompletion(m.name+createParamsString(m,true),{
              label: m.name+"(...)",
              type: "function",
              info: (completion)=>{
                let node=document.createElement("div");
                let sign=document.createElement("div");
                sign.style.marginBottom="0.2rem";
                sign.style.fontFamily="monospace";
                node.appendChild(sign);
                var type;
                if(m.type){
                  type=m.type.toString();
                }else{
                  type="void";
                }
                sign.innerHTML=type+" "+m.name+createParamsString(m,false);
                let desc=document.createElement("div");
                node.appendChild(desc);
                desc.innerHTML=m.comment;
                return node;
              }
            }));
          }
        }
        clazz=clazz.getRealSuperClazz();
      }
    }
    if(includeClasses){
      if(method){
        for(let i=0;i<snippets.inMethod.length;i++){
          options.push(snippets.inMethod[i]);
        }
      }
      for(let name in Java.clazzes){
        let c=Java.clazzes[name];
        options.push({
          label: name,
          type: "class",
          info: c.comment
        });
      }
    }
    
  }
  return {
    from,
    options,
    span: /^[\w]*$/
  }
}