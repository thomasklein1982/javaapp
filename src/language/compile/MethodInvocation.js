import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { ArgumentList } from "./ArgumentList";
import { FieldAccess } from "./FieldAccess";
import { Identifier } from "./Identifier";
import { Clazz } from "../../classes/Clazz";
import { Java } from "../java";
import { Type } from "../../classes/Type";
import { ArrayAccess } from "./ArrayAccess";
import { CompileFunctions } from "../CompileFunctions";
import { SourceFile } from "../../classes/SourceFile";
/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 */
export function MethodInvocation(node,source,scope){
  let rootNode=node;
  node=node.firstChild;
  
  let mn,al,methods;
  let code="";
  let owner={
    clazz: null,
    static: false,
    typeArguments: null
  };
  if(node.name==="MethodName" && node.nextSibling.type.isError){
    /**seltsamerweise scheinen manchmal auch identifier hier zu landen?!? (UIClazz) */
    let code=Identifier(node,source,scope);
    return code;
  }
  //TODO: Das ist nicht korrekt fuer statische attribute
  let staticContext=scope.method? scope.method.isStatic():false;
  if(node.name==="this"){
    if(staticContext){
      throw source.createError("Das Schlüsselwort 'this' existiert nicht in statischen Methoden.",node);
    }
    code+="this";
    node=node.nextSibling.nextSibling;
  }else if(node.name==="MethodName"){
    owner.clazz=scope.method.clazz;
    if(staticContext){
      owner.static=true;
    }
    code+="this";
  }else{
    if(node.name==="Identifier"){
      let id=Identifier(node,source,scope);
      code+="$N("+id.code+",'"+id.name+"')";
      //code+=id.code;
      if(id.object instanceof Clazz || id.object instanceof SourceFile && id.object.fileType==="html"){
        owner={
          clazz: id.object,
          static: true
        };
      }else{
        owner={
          clazz: id.object.type?.baseType,
          static: false,
          typeArguments: id.object.type?.typeArguments
        };
      }
    }else{
      let f=CompileFunctions.get(node,source);
      let fa=f(node,source,scope);
      code+=fa.code;
      owner={
        clazz: fa.type.baseType,
        static: false,
        typeArguments: fa.type.typeArguments
      };
    }
    node=node.nextSibling;
    if(node.name==="."){
    }else{
      throw (source.createError(null,node));
    }
    node=node.nextSibling;
  }
  if(node.name!=="MethodName"){
  }
  mn=source.getText(node);
  let method=scope.getMethod(mn,owner.static,owner.clazz);
  if(method.error){
    throw (source.createError(method.error,node));
  }
  if(method.isExtraFunction){
    
  }else{ 
    code+=".";
    if(method.jsName){
      code+=method.jsName;
    }else{
      code+=mn;
    }
  }
  node=node.nextSibling;
  
  if(node.name!=="ArgumentList"){
  }
  if(!method || !method.isBuiltIn){
    console.log("no builtin");
  }
  let updateLocalVariablesAfter=!method.isBuiltIn();
  al=ArgumentList(node,source,scope,method.getRealParameterList(owner.typeArguments),method,owner);
  if(al.updateLocalVariablesAfter){
    updateLocalVariablesAfter=true;
  }
  if(method.isExtraFunction){
    if(al.list.length===0){
      code=method.jsName+"("+code+")";
    }else{
      code=method.jsName+"("+code+","+al.code.substring(1);
    }
  }else{
    code+=al.code;
  }
  code="await "+code;
  if(!scope.optimizeCompiler && !method.isBuiltIn()){
    let line=source.getLineNumber(rootNode.from);
    code="await (async (val)=>{await $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+",$scope); return val;})("+code+")";
  }
  let returnType=null;
  if(method.type){
    returnType=method.getRealReturnType(al.replacementTypes,owner.typeArguments);
    let startLine=undefined;
    if(method.bodyNode){
      startLine=source.getLine(method.bodyNode.from).number;
      code="$m("+code+",\"Die Methode "+method.name+" muss einen Wert vom Typ "+returnType.toString()+" zurückgeben.\","+startLine+")";
    }
    scope.addTypeAnnotation(node,returnType,false);
  }
  return {
    method,arguments: al, code, type: returnType, updateLocalVariablesAfter
  }
}