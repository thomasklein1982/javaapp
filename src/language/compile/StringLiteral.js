import { Type } from "../../classes/Type";
import { Java } from "../java";

export function StringLiteral(node,source,scope){
  let type=new Type(Java.datatypes.String,0);
  scope.addTypeAnnotation(node,type,false);
  return {
    code: source.getText(node),
    type
  };
}