import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { Scope } from "../../classes/Scope";

export function DoStatement(node,source,scope){
  node=node.firstChild;
  let lineNumber=source.getLineNumber(node.to-1);
  let code;
  if(node.name!=="do"){
    
  }
  node=node.nextSibling;
  code="do";
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
  node=node.nextSibling;
  if(node.name!=="while"){
    throw source.createError("'while' erwartet.",node);
  }
  node=node.nextSibling;
  let condition=ParenthesizedExpression(node,source,scope);
  if(!condition.type.isSubtypeOf(Java.datatypes.boolean)){
    throw source.createError("Als Bedingungen sind nur Wahrheitswerte zugelassen.",node);
  }
  code+="while("+condition.code+");";
  node=node.nextSibling;
  if(node.name!==";"){
    throw source.createError("';' erwartet.",node);
  }
  return {
    code: code,
    type: null,
    waitForLineIncluded: true
  }
}