import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function UnaryExpression(node,source,scope){
  let op=node.firstChild;
  let opText=source.getText(op);
  let code=opText;
  node=op.nextSibling;
  let f=CompileFunctions.get(node,source);
  let v=f(node,source,scope);
  if(op.name==="ArithOp" && (!v.type || !v.type.isNumeric())){
    throw source.createError("int oder double erwartet",node);
  }else if(op.name==="LogicOp" && (!v.type || !v.type.isBoolean())){
    throw source.createError("boolean erwartet",node);
  }
  code+=v.code;
  return {
    code: code,
    type: v.type
  };
}