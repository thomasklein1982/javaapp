import { Type } from "../../classes/Type";
import { Java } from "../java";

export function Var(node,source,scope){
  return {
    type: new Type("var",0)
  };
}