import { Scope } from "../../classes/Scope";
import { CompileFunctions } from "../CompileFunctions";

export function LambdaExpression(node,source,scope,infos){
  if(!infos){
    throw source.createError("Unvorhergesehener Lamdba-Ausdruck.\nWahrscheinlich verursacht durch einen anderen Fehler.",node);
  }
  let inter,typeArguments;
  if(infos.parameter && infos.parameter.type && infos.owner){
    inter=infos.parameter.type;
    typeArguments=infos.owner.typeArguments;
  }else if(infos.assignTarget){
    inter=infos.assignTarget.type;
    typeArguments=inter.typeArguments;
  }else{
    throw source.createError("An dieser Stelle kann kein Lambda-Ausdruck übergeben werden.",node);
  }
  if(inter.dimension>0 || !inter.baseType.isInterface){
    throw source.createError("An dieser Stelle kann kein Lambda-Ausdruck übergeben werden.",node);
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
  
  let plist;
  try{
    plist=method.getRenamedParameterList(typeArguments,params.params);
  }catch(e){
    throw source.createError(e,node);
  }
  scope.pushLayer();
  try{
    scope.pushParameterList(plist);
  }catch(e){
    scope.popLayer();
    throw source.createError(e,node);
  }
  node=node.nextSibling;
  let block=CompileFunctions.get(node,source);
  scope.pushMethod(method);
  block=block(node,source,scope);
  if(block instanceof Scope){
    return block;
  }
  scope.popLayer();
  scope.popMethod();
  if(block.errors.length>0){
    throw block.errors[0];
  }
  let code="async "+params.code+"=>{"+block.code+"}";
  
  code="$createInterfaceInstance("+JSON.stringify(inter.baseType.name)+","+JSON.stringify(method.name)+","+code+")";
  return {
    code,
    params,block,
    type: inter
  };
}