import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { InterfaceTypeList } from "./InterfaceTypeList";

export function SuperInterfaces(node,source,scope){
  node=node.firstChild;
  console.log(node);
  if(node.name!=="implements"){
    return {
      error: source.createError("'implements' erwartet",node)
    };
  }
  node=node.nextSibling;
  let list=InterfaceTypeList(node,source,scope);
  return {
    list
  };
}