import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";


export function TernaryExpression(node,source,scope){
  let condition=node.firstChild;
  let conditionCode=CompileFunctions.get(condition,source)(condition,source,scope);
  if(!conditionCode || !conditionCode.type || !conditionCode.type.isSubtypeOf(Java.datatypes.boolean)){
    throw source.createError("Als Bedingungen sind nur Wahrheitswerte zugelassen.",condition);
  }
  let op=condition.nextSibling;
  let then=op.nextSibling;
  let thenCode=CompileFunctions.get(then,source)(then,source,scope);
  let sep=then.nextSibling;
  let elseNode=sep.nextSibling;
  let elseCode=CompileFunctions.get(elseNode,source)(elseNode,source,scope);
  if(!thenCode.type){
    throw source.createError("Dieser Ausdruck hat keinen Wert.",thenNode);
  }
  if(!elseCode.type){
    throw source.createError("Dieser Ausdruck hat keinen Wert.",elsenNode);
  }
  let type=elseCode.type.checkCompatibility(thenCode.type);
  if(type===false){
    throw source.createError("Typen sind nicht kompatibel",elseNode);
  }
  if(type){
    type.autoCastValue(thenCode);
    type.autoCastValue(elseCode);
  }
  
  let code=conditionCode.code+"?"+thenCode.code+":"+elseCode.code;
  return {
    code,
    type
  };
}