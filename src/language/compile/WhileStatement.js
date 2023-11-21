import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { Scope } from "../../classes/Scope";

export function WhileStatement(node,source,scope){
  node=node.firstChild;
  
  let code;
  if(node.name!=="while"){
    
  }
  node=node.nextSibling;
  code="while";
  if(node.name!=="ParenthesizedExpression"){

  }
  let condition=ParenthesizedExpression(node,source,scope);
  if(!condition.type.isSubtypeOf(Java.datatypes.boolean)){
    throw source.createError("Als Bedingungen sind nur Wahrheitswerte zugelassen.",node);
  }
  code+=condition.code;
  node=node.nextSibling;
  let thenBlock=Block(node,source,scope);
  if(thenBlock instanceof Scope){
    return thenBlock;
  }
  if(thenBlock.errors && thenBlock.errors.length>0){
    throw thenBlock.errors[0];
  }
  code+="{"+thenBlock.code+"}";
  return {
    code: code,
    type: null
  }
}