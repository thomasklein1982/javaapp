import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ArrayAccess(node,source,scope){
  node=node.firstChild;
  let code="";
  let f=CompileFunctions.get(node,source);
  let object=f(node,source,scope);
  if(object.type.dimension===0){
    throw source.createError("Dieser Ausdruck ist kein Array.",node);
  }
  code+="$u("+object.code+")";
  let codeSet=code;
  let codeUpdate=code;
  node=node.nextSibling;
  if(node.name!=="["){
    throw source.createError("'[' erwartet.",node);
  }
  var indices=[];
  node=node.nextSibling;
  f=CompileFunctions.get(node,source);
  let index=f(node,source,scope);
  if(!index.type){
    throw source.createError("'int' erwartet.",node);
  }
  if(!index.type.isSubtypeOf(Java.datatypes.int)){
    throw source.createError("'int' erwartet, aber '"+index.type+"' gefunden.",node);
  }
  indices.push(index.code);
  code="$getFromArray("+code+","+index.code+")";
  //code+=".get("+index.code+")";
  codeSet="$setInArray("+codeUpdate+","+index.code+",";
  //codeSet+=".checkBounds("+index.code+").set("+index.code+",";
  codeUpdate="$setInArray("+codeUpdate+","+index.code+",$getFromArray("+codeUpdate+","+index.code+")";
  //codeUpdate+=".set("+index.code+","+object.code+".get("+index.code+")";
  let returnType=object.type.baseType;
  if(returnType.isGeneric && object.owner){
    let typeArguments=object.owner.type.typeArguments;
    returnType=typeArguments[returnType.genericIndex].baseType;
  }  
  let type=new Type(returnType,object.type.dimension-indices.length);
  node=node.nextSibling;
  if(node.name!=="]"){
    throw source.createError("']' erwartet.",node);
  }
  scope.addTypeAnnotation(node,type,false);
  return {
    code, codeSet,codeUpdate, type: type, codeUpdateAfter: ")"
  }
}