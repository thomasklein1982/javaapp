import { CompileFunctions } from "../CompileFunctions";

export function CatchType(node,source,scope){
  node=node.firstChild;
  return CompileFunctions.get(node,source)(node,source,scope);
}