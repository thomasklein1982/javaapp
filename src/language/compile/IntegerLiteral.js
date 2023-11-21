import { Type } from "../../classes/Type";
import { Java } from "../java";

export function IntegerLiteral(node,source,scope){
  return {
    code: source.getText(node),
    type: new Type(Java.datatypes.int,0)
  };
}