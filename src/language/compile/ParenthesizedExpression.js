import { CompileFunctions } from "../CompileFunctions";


export function ParenthesizedExpression(node,source,scope){
  let code,type;
  node=node.firstChild;
  if(node.name!=="("){
    throw source.createError("'(' erwartet.",node);
  }
  node=node.nextSibling;
  let expression=CompileFunctions.get(node,source)(node,source,scope);
  node=node.nextSibling;
  if(node.name!==")"){
    throw source.createError("')' erwartet.",node);
  }
  code="("+expression.code+")";
  type=expression.type;
  return {
    code,type
  }
};
