import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function ThrowStatement(node,source,scope){
  node=node.firstChild; //throw
  node=node.nextSibling;
  let obj=CompileFunctions.get(node,source)(node,source,scope);
  if(!obj.type.isSubtypeOf(Java.datatypes.Exception)){
    throw source.createError("Nur Exceptions können geworfen werden,\ndies ist ein/e "+obj.type.toString()+".",node);
  }
  let code="throw "+obj.code+";";
  return {
    code
  }
}