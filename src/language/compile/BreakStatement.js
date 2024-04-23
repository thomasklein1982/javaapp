import { checkSemikolon } from "../helper/checkSemicolon";

export function BreakStatement(node,source,scope){
  node=node.firstChild;
  let nodeBackup=node;
  let isOK=false;
  while(node){
    if(node.name==="ForStatement"||node.name==="WhileStatement"||node.name==="SwitchBlock"){
      isOK=true;
      break;
    }
    node=node.parent;
  }
  node=nodeBackup;
  if(!isOK){
    throw source.createError("'break' ist nur innerhalb von Schleifen und switch-Statements erlaubt.",node);
  }
  checkSemikolon(node,source);
  return {
    code: "break;"
  }
}