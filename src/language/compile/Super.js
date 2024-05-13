import { Type } from "../../classes/Type";
import { Java } from "../java";

export function Super(node,source,scope){
  let clazz=scope.getClazz();
  if(!clazz){
    throw source.createError("'super' darf nur innerhalb einer Methode verwendet werden.", node);
  }
  if(scope.method.isStatic()){
    throw source.createError("'super' kann nicht in statischen Kontexten verwendet werden.", node);
  }
  let superClazz=clazz.superClazz;
  if(!superClazz) superClazz=Java.clazzes.Object;
  let type=new Type(superClazz,0);
  scope.addTypeAnnotation(node,type,false);
  return {
    code: "super",
    type
  }
}