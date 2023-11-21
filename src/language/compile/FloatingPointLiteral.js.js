import { Type } from "../../classes/Type";
import { Java } from "../java";

export function FloatingPointLiteral(node,source,scope){
  return {
    code: source.getText(node),
    type: new Type(Java.datatypes.double,0)
  };
}