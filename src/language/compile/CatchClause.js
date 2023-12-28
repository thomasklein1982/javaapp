import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { CompileFunctions } from "../CompileFunctions";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { LocalVariableDeclaration } from "./LocalVariableDeclaration";

export function CatchClause(node,source,scope){
  console.log(node);
  node=node.firstChild;
  let catchParameter={
    type: null,
    name: null
  };
  let code;
  if(node.name!=="catch"){
    
  }
  node=node.nextSibling;
  if(node.name!=="CatchFormalParameter"){
    throw source.createError("catch-Parameter erwartet",node);
  }
  code="";
  scope.pushLayer();
  if(node.firstChild.name!=="("){
    throw source.createError("'(' erwartet",node);
  }
  let node1=node.firstChild.nextSibling;
  console.log(node1);
  if(node1.name!=="CatchType"){
    throw source.createError("catch-Parameter erwartet",node1);
  }
  catchParameter.type=CompileFunctions.get(node1.firstChild,source)(node1.firstChild,source,scope).type;
  node1=node1.nextSibling;
  catchParameter.name=CompileFunctions.get(node1,source)(node1,source,scope).code;
  console.log(catchParameter);
  scope.pushLocalVariable(catchParameter.name,catchParameter.type);
  node1=node1.nextSibling;
  if(node1.name!==")"){
    throw source.createError("')' erwartet",node1);
  }

  let catchBlock;
  node=node.nextSibling;
  
  catchBlock=CompileFunctions.get(node,source)(node,source,scope);
  if(catchBlock instanceof Scope){
    return catchBlock;
  }
  if(catchBlock.errors && catchBlock.errors.length>0){
    throw catchBlock.errors[0];
  }
  code+=catchBlock.code;
  scope.popLayer();
  return {
    code: code,
    catchParameter,
    type: null,
    node
  }
}