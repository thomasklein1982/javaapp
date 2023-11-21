import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function UpdateExpression(node,source,scope){
  node=node.firstChild;
  let v=CompileFunctions.get(node,source)(node,source,scope);
  if(!v.type.isNumeric()){
    throw source.createError("Diese Operation funktioniert nur mit Zahlen, aber nicht mit einem '"+v.type.toString()+"'.",node);
  }
  let code;
  if(v.codeUpdate){
    code=v.codeUpdate;
  }else{
    code=v.code;
  }
  node=node.nextSibling;
  if(node.name==="UpdateOp"){
    if(v.codeUpdate){
      let op=source.getText(node);
      if(op==="++"){
        code+="+1";
      }else if(op==="--"){
        code+="-1";
      }
      if(v.codeUpdateAfter){
        code+=v.codeUpdateAfter;
      }
    }else{
      code+=source.getText(node);
    }
  }
  return {
    code: code,
    type: v.type,
    local: v.local,
    name: v.name
  };
}