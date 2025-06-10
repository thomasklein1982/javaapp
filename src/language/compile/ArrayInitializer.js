import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ArrayInitializer(node,source,scope,type){
  
  if(type.assignTarget){
    type=type.assignTarget.type;
  }
  if(!type){
    throw source.createError("Kein Datentyp angegeben.",node);
  }
  if(type.dimension==0){
    throw source.createError("In einem "+type.baseType.name+" kann kein Array gespeichert werden.",node);
  }
  node=node.firstChild;
  node=node.nextSibling;
  let code="[";
  
  let subType=new Type(type.baseType,type.dimension-1);
  while(node && node.name!=="}" && !node.type.isError){
    let a=CompileFunctions.get(node,source)(node,source,scope,subType);
    subType.autoCastValue(a);
    code+=a.code;
    node=node.nextSibling;
    if(node.name==="⚠"){
      throw source.createError("',' erwartet",node);
    }else if(node.name===","){
      code+=",";
      node=node.nextSibling;
    }
  }
  code+="]";
  return {
    code: code,
    type: type
  };
}