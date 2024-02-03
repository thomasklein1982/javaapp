import { CompileFunctions } from "../CompileFunctions";

export function LambdaExpression(node,source,scope,infos){
  /**not implemented yet */
  // console.log("lambda",node,source.getText(node));
  //throw source.createError("Lambda-Expressions sind noch nicht implementiert. Das dauert noch ein bisschen :(.",node);
  let inter=infos.parameter.type;
  if(inter.dimension>0 || !inter.baseType.isInterface){
    throw source.createError("An dieser Stelle kann kein Lamda-Ausdruck übergeben werden.",node);
  }
  let methods=inter.baseType.methods;
  let mcount=0;
  let method;
  for(let a in methods){
    method=methods[a];
    mcount++;
  }
  if(mcount!==1){
    throw source.createError("Das Interface "+inter.toString()+" ist nicht funktional, d.h., es hat mehr als eine Methode. Daher kannst du an dieser Stelle keinen Lambda-Ausdruck verwenden.",node);
  }
  node=node.firstChild;
  let params=CompileFunctions.get(node,source);
  params=params(node,source,scope);
  console.log(params);
  
  let plist;
  try{
    plist=method.getRenamedParameterList(params.params);
  }catch(e){
    throw source.createError(e,node);
  }
  scope.pushParameterList(plist);
  node=node.nextSibling;
  let block=CompileFunctions.get(node,source);
  scope.pushLayer();
  block=block(node,source,scope);
  scope.popLayer();
  if(block.errors.length>0){
    throw block.errors[0];
  }
  let code="async "+params.code+"=>{"+block.code+"}";
  
  code="$createInterfaceInstance("+JSON.stringify(inter.baseType.name)+","+JSON.stringify(method.name)+","+code+")";
  console.log(code);
  return {
    code,
    params,block,
    type: inter
  };
}