import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { Scope } from "../../classes/Scope";
import { SwitchBlock } from "./SwitchBlock";

export function SwitchStatement(node,source,scope){
  node=node.firstChild;
  let lineNumber=source.getLineNumber(node.to-1);
  let code;
  if(node.name!=="switch"){
    
  }
  node=node.nextSibling;
  code="switch";
  if(node.name!=="ParenthesizedExpression"){

  }
  let expression=ParenthesizedExpression(node,source,scope);
  console.log(expression);
  if(!expression.type){
    throw source.createError("Dieser Ausdruck hat keinen Wert.",node);
  }
  code+=expression.code;
  node=node.nextSibling;
  let block=SwitchBlock(node,source,scope,{type: expression.type});
  code+=block.code;
  console.log("total",code);
  return {
    code: code,
    type: null,
    waitForLineIncluded: true
  }
}