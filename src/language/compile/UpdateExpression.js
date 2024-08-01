import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function UpdateExpression(node,source,scope){
  node=node.firstChild;
  let v=CompileFunctions.get(node,source)(node,source,scope);
  if(!v.type.isNumeric()){
    throw source.createError("Diese Operation funktioniert nur mit Zahlen, aber nicht mit einem '"+v.type.toString()+"'.",node);
  }
  let code;
  if(!v.codeUpdate){
    throw source.createError("Unbekannter Fehler bei Update-Ausdruck: "+source.getText(node),node);
  }
  // if(v.codeUpdate){
  //   code=v.codeUpdate;
  // }else{
  //   code=v.code;
  // }
  node=node.nextSibling;
  // if(!v.codeUpdateAfter){
  //   code+="=";
  // }
  code=v.codeUpdate;
  if(node.name==="UpdateOp"){
    code+=source.getText(node);  
    // if(v.codeUpdate){
    //   let op=source.getText(node);
    //   if(op==="++"){
    //     code+="+1";
    //   }else if(op==="--"){
    //     code+="-1";
    //   }
    //   if(v.codeUpdateAfter){
    //     code+=v.codeUpdateAfter;
    //   }
    // }else{
    //   code+=source.getText(node);
    // }
    if(v.name && v.local){
      code="(("+code+")|$scope.setVariable("+JSON.stringify(v.name)+","+v.code+"))";
    }
  }
  if(v.codeUpdateAfter){
    code+=v.codeUpdateAfter;
  }
  return {
    code: code,
    type: v.type,
    local: v.local,
    name: v.name
  };
}