import { Type } from "../../classes/Type";
import { Java } from "../java";

export function Var(node,source,scope){
  console.log("var",node);
  return {
    type: new Type("var",0)
  };
}