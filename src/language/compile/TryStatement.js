import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { CompileFunctions } from "../CompileFunctions";
import { Scope } from "../../classes/Scope";
import { CatchClause } from "./CatchClause";

export function TryStatement(node,source,scope){
  console.log(node);
  node=node.firstChild;
  
  let code;
  if(node.name!=="try"){
    
  }
  node=node.nextSibling;
  code="try";
  let tryBlock;
  scope.pushLayer();
  tryBlock=CompileFunctions.get(node,source)(node,source,scope);
  if(tryBlock instanceof Scope){
    return tryBlock;
  }
  if(tryBlock.errors && tryBlock.errors.length>0){
    throw tryBlock.errors[0];
  }
  code+="{\n"+tryBlock.code+"\n}";
  console.log("try",tryBlock.code);
  scope.popLayer();
  node=node.nextSibling;
  let catchCount=0;
  let exVarName=null;
  while(node && node.name==="CatchClause"){
    let catchClause=CatchClause(node,source,scope);
    if(catchClause instanceof Scope){
      return catchClause;
    }
    if(catchCount===0){
      exVarName="$"+catchClause.catchParameter.name;
      code+="catch("+exVarName+"){";
    }
    let exType=catchClause.catchParameter.type.toString();
    if(exType==='Exception'){
      exType="true"
    }else{
      exType=exVarName+" instanceof "+exType;
    }
    if(catchCount>0) code+="else";
    code+="\nif("+exType+"){\nlet "+catchClause.catchParameter.name+"="+exVarName+";\n"+catchClause.code+"\n}";
    node=node.nextSibling;
    catchCount++;
  }
  code+="\n}";
  console.log(code);
  return {
    code: code,
    type: null
  }
}