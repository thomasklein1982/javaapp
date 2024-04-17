import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { Scope } from "../../classes/Scope";
import { CompileFunctions } from "../CompileFunctions";

export function SwitchLabel(node,source,scope,infos){
  let type=infos.type;
  node=node.firstChild;
  let code;
  if(node.name==="case"){
    node=node.nextSibling;
    if(!node.name.endsWith("Literal")){
      throw source.createError("Konstanter Ausdruck erwartet.",node);
    }
    let val=CompileFunctions.get(node,source)(node,source,scope);
    if(!val.type.isSubtypeOf(type)){
      throw source.createError(type.toString()+" erwartet, aber "+val.type.toString()+" gefunden.",node);
    }
    code="case "+val.code+":";
  }else if(node.name==="default"){
    code="default:";
  }else{
    
  }
  
  node=node.nextSibling;
  if(node.name!==":"){
    throw source.createError("':' erwartet",node);
  }
  node=node.nextSibling;
  return {
    code: code,
  }
}