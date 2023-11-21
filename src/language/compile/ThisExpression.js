import { Type } from "../../classes/Type";
import { Java } from "../java";

export function ThisExpression(node,source,scope){
  let type=new Type(scope.method.clazz,0);
  scope.addTypeAnnotation(node,type,false);
  return {
    code: "this",
    type
  };
}