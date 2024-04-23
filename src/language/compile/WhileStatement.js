import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { Scope } from "../../classes/Scope";

export function WhileStatement(node,source,scope){
  node=node.firstChild;
  let lineNumber=source.getLineNumber(node.to-1);
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
  code+="{";
  if(!scope.optimizeCompiler){
    code+="\nawait $App.debug.line("+lineNumber+","+JSON.stringify(scope.method.clazz.name)+",$scope);";
  }
  code+=thenBlock.code+"}";
  return {
    code: code,
    type: null,
    waitForLineIncluded: true
  }
}