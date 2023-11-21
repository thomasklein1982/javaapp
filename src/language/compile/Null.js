import { Type } from "../../classes/Type";
import { Java } from "../java";

export function Null(node,source,scope){
  return {
    code: "null",
    type: new Type(Java.datatypes.nullType,0)
  };
}