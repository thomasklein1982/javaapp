import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { CompileFunctions } from "../CompileFunctions";
import { Scope } from "../../classes/Scope";

export function IfStatement(node,source,scope){
  node=node.firstChild;
  
  let code;
  if(node.name!=="if"){
    
  }
  node=node.nextSibling;
  code="if";
  if(node.name!=="ParenthesizedExpression"){
    throw source.createError("'(' erwartet",node);
  }
  let condition=ParenthesizedExpression(node,source,scope);
  if(!condition.type || !condition.type.isSubtypeOf(Java.datatypes.boolean)){
    throw source.createError("Als Bedingungen sind nur Wahrheitswerte zugelassen.",node);
  }
  code+=condition.code;
  node=node.nextSibling;
  let thenBlock;
  scope.pushLayer();
  thenBlock=CompileFunctions.get(node,source)(node,source,scope);
  if(thenBlock instanceof Scope){
    return thenBlock;
  }
  if(thenBlock.errors && thenBlock.errors.length>0){
    throw thenBlock.errors[0];
  }
  code+="{"+thenBlock.code+"}";
  scope.popLayer();
  node=node.nextSibling;
  if(node && node.name==="else"){
    code+="else";
    node=node.nextSibling;
    scope.pushLayer();
    let elseBlock=CompileFunctions.get(node,source)(node,source,scope);
    if(elseBlock instanceof Scope){
      return elseBlock;
    }
    if(elseBlock.errors && elseBlock.errors.length>0){
      throw elseBlock.errors[0];
    }
    code+="{"+elseBlock.code+"}";
    scope.popLayer();
  }
  return {
    code: code,
    type: null
  }
}