import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeName } from "./TypeName";

export function TypeBound(node,source,scope){
  let superclazz;
  node=node.firstChild;
  if(node.name==="extends"){
    node=node.nextSibling;
    if(node.name==="TypeName"){
      superclazz=TypeName(node,source,scope);
    }
  }
  
  return superclazz
}