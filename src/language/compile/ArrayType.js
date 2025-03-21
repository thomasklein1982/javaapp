import { CompileFunctions } from "../CompileFunctions";

export function ArrayType(node,source,scope){
  
  node=node.firstChild;
  let f=CompileFunctions.get(node,source);
  let type=f(node,source,scope);
  type=type.type;
  let dim=0;
  node=node.nextSibling;
  while(node){
    if(node.firstChild?.nextSibling?.type.isError){
      throw source.createError("Innerhalb von [] darf nichts stehen.",node);
    }
    node=node.nextSibling;
    dim++;
  }
  type.dimension=dim;
  let code="let";
  return {
    type: type,
    code: code
  }
}