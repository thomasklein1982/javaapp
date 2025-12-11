import { CompileFunctions } from "../CompileFunctions";

export function ExpressionStatement(node,source,scope){
  node=node.firstChild;
  scope.statementCount++;
  let f=CompileFunctions.get(node,source);
  let a;
  //try{
  a=f(node,source,scope);
  // }catch(e){
  //   console.error("fehler: ",source.getText(node));
  //   throw e;
  // }
  if(node.nextSibling.type.isError || node.nextSibling.name!==";"){
    while(node.lastChild){
      node=node.lastChild;
    }
    throw (source.createErrorAt("';' erwartet.",node.to));
  }
  if(scope.method?.sysoutStatements && !node.parent.parent?.parent?.parent){
    a.code="$App.console.log("+a.code+")";
  }
  a.code+=";";
  return a;
}