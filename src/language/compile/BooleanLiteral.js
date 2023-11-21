import { Type } from "../../classes/Type";
import { Java } from "../java";

export function BooleanLiteral(node,source,scope,errors){
  return {
    code: source.getText(node),
    type: new Type(Java.datatypes.boolean,0)
  };
}