import { Type } from "../../classes/Type";
import { Java } from "../java";

export function StringLiteral(node,source,scope){
  return {
    code: source.getText(node),
    type: new Type(Java.datatypes.String,0)
  };
}