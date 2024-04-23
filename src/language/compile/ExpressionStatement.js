import { CompileFunctions } from "../CompileFunctions";

export function ExpressionStatement(node,source,scope){
  node=node.firstChild;
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
  if(a.local && scope.addLocalVariablesUpdates && !scope.optimizeCompiler){
    a.code+=";";//eval('$locals["+JSON.stringify(a.name)+"]="+a.name+"');";
  }else{
    a.code+=";";
  }
  return a;
}