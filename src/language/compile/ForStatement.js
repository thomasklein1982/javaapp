import { Scope } from "../../classes/Scope";
import { CompileFunctions } from "../CompileFunctions";
import { Block } from "./Block";

export function ForStatement(node,source,scope){
  let code="for(";
  node=node.firstChild;
  node=node.nextSibling;
  let forSpec=node;
  node=node.firstChild;
  if(node.name!=="("){

  }
  node=node.nextSibling;
  scope.pushLayer();
  let p1=CompileFunctions.get(node,source)(node,source,scope);
  code+=p1.code;
  node=node.nextSibling;
  if(node){
    let p2=CompileFunctions.get(node,source)(node,source,scope);
    code+=p2.code;
    node=node.nextSibling;
    node=node.nextSibling;
    let p3=CompileFunctions.get(node,source)(node,source,scope);
    code+=";"+p3.code;
  }
  code+=")";
  let block=forSpec.nextSibling;
  block=Block(block,source,scope);
  if(block instanceof Scope){
    return block;
  }
  code+="{"+block.code+"}";
  scope.popLayer();
  
  return {
    code: code,
    type: null,
    errors: block.errors
  }
}