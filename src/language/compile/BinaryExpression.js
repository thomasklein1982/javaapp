import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

function resolveTermOperations(term,operations,source){
  for(let i=1;i<term.length;i+=2){
    let op=term[i];
    if(operations.indexOf(op)>=0){
      let left=term[i-1];
      let right=term[i+1];
      let code;
      let type;
      if(!left.type || !right.type){
        throw source.createError("Der Ausdruck '"+source.getText(left.node.parent)+"' ist fehlerhaft.",left.node.parent);
      }
      if(op==="+"){
        if(left.type.isNumeric() && right.type.isNumeric()){
          if(left.type.isSubtypeOf(right.type)){
            type=right.type;
          }else{
            type=left.type;
          }
        }else{
          type=new Type(Java.datatypes.String,0);
        }
        code=left.code+op+right.code;
      }else if(op==="*"||op==="-"||op==="/"||op==="%"){
        if(left.type.isNumeric() && right.type.isNumeric()){
          if(op==="/" && left.type===Java.datatypes.int && right.type===Java.datatypes.int){
            code="Math.floor("+left.code+op+right.code+")";
            type=left.type;
          }else{
            code=left.code+op+right.code;
            if(left.type.isSubtypeOf(right.type)){
              type=right.type;
            }else{
              type=left.type;
            }
          }
        }else{
          let t;
          if(!left.type.isNumeric()){
            t="'"+source.getText(left.node)+"' ist keine Zahl, sondern ein '"+left.type.toString()+"'.";
          }else{
            t="'"+source.getText(right.node)+"' ist keine Zahl, sondern ein '"+right.type.toString()+"'.";
          }
          throw source.createError("Der Operator '"+op+"' funktioniert nur mit Zahlen, "+t,left.node.parent);
        }
      }else if(op==="&"||op==="&&"||op==="|"||op==="||"){
        if(left.type.isSubtypeOf(Java.datatypes.boolean) && right.type.isSubtypeOf(Java.datatypes.boolean)){
          code=left.code+op+right.code;
          type=new Type(Java.datatypes.boolean,0);
        }else{
          throw source.createError("Der Operator '"+op+"' funktioniert nur mit Wahrheitswerten (boolean).",left.node.parent);
        }
      }else if(op==="=="||op==="!="){
        if(!left.type.isSubtypeOf(right.type) && !right.type.isSubtypeOf(left.type)){
          throw source.createError("Die Datentypen '"+left.type+"' und '"+right.type+"' sind nicht kompatibel.",left.node.parent);
        }
        code=left.code+op+"="+right.code;
        type=new Type(Java.datatypes.boolean,0);
      }else if(op==="<" || op==="<=" ||op===">" ||op===">="){
        if(left.type.isNumericOrString() && right.type.isNumericOrString()){
          code=left.code+op+right.code;
          type=new Type(Java.datatypes.boolean,0);
        }else{
          throw source.createError("Der Operator '"+op+"' funktioniert nur mit Zahlen oder Strings.",left.node.parent);
        }
      }
      term.splice(i-1,3,{code: code, type: type, node: left.node});
      i-=2;
    }
  }
}

function addCompiledBinaryExpressions(node,source,scope,termArray){
  let leftNode=node.firstChild;
  let op=leftNode.nextSibling;
  let rightNode=op.nextSibling;
  if(leftNode.name==="BinaryExpression"){
    addCompiledBinaryExpressions(leftNode,source,scope,termArray);
  }else{
    if(leftNode.type.isError){
      throw source.createError("Syntax-Fehler.",leftNode);
    }
    let left=CompileFunctions.get(leftNode)(leftNode,source,scope);
    left.node=leftNode;
    termArray.push(left);
  }
  termArray.push(source.getText(op));
  if(rightNode.name==="BinaryExpression"){
    addCompiledBinaryExpressions(rightNode,source,scope,termArray);
  }else{
    if(rightNode.type.isError){
      throw source.createError("Syntax-Fehler.",rightNode);
    }
    let right=CompileFunctions.get(rightNode)(rightNode,source,scope);
    right.node=rightNode;
    termArray.push(right);
  }
}

export function BinaryExpression(node,source,scope){
  let code;
  let type;
  let wholeNode=node;
  let term=[];
  addCompiledBinaryExpressions(node,source,scope,term);
  resolveTermOperations(term,"*/%",source);
  resolveTermOperations(term,"+-",source);
  resolveTermOperations(term,"<=>==!=",source);
  resolveTermOperations(term,"&&",source);
  resolveTermOperations(term,"||",source);
  if(term.length!==1){
    throw source.createError("Der Ausdruck '"+source.getText(wholeNode)+"' konnte nicht aufgelöst werden.",wholeNode);
  }
  return {
    code: term[0].code,
    type: term[0].type
  }
};