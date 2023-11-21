import { checkSemikolon } from "../helper/checkSemicolon";

export function BreakStatement(node,source,scope){
  node=node.firstChild;
  let nodeBackup=node;
  let inLoop=false;
  while(node){
    if(node.name==="ForStatement"||node.name==="WhileStatement"){
      inLoop=true;
      break;
    }
    node=node.parent;
  }
  node=nodeBackup;
  if(!inLoop){
    throw source.createError("'break' ist nur innerhalb einer Schleife erlaubt.",node);
  }
  checkSemikolon(node,source);
  return {
    code: "break;"
  }
}