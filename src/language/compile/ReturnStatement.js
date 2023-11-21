import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ReturnStatement(node,source,scope){
  node=node.firstChild;
  if(node.name!=="return"){

  }
  let code="return ";
  if(!node.nextSibling){
    throw (source.createError("';' erwartet.",node));
  }
  node=node.nextSibling;
  let returnType=scope.method.type;
  if(!node.type.isError && node.name!==";"){
    if(returnType){
      let f=CompileFunctions.get(node,source);
      let v=f(node,source,scope);
      returnType.autoCastValue(v);
      if(!v.type.isSubtypeOf(returnType)){
        throw source.createError("Diese Methode muss ein "+returnType.toString()+" zurückliefern, dies ist aber ein "+v.type.toString()+".",node);
      }
      code+="await "+v.code+";";
      node=node.nextSibling;
    }else{
      throw source.createError("Eine void-Methode kann keinen Wert zurückgeben.",node);
    }
  }else{
    if(returnType){
      throw source.createError("Diese Methode muss ein "+returnType.toString()+" zurückliefern.",node);
    }
    code+=";";
  }
  if(node.type.isError || node.name!==";"){
    throw (source.createError("';' erwartet.",node));
  }
  return {
    code: code,
    type: null
  };
}