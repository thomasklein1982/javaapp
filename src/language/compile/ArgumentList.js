import { CompileFunctions } from "../CompileFunctions";

export function ArgumentList(node,source,scope,parameters){
  if(!node || !node.firstChild){
    throw source.createError("'(' erwartet",node);
  }
  node=node.firstChild;
  let list=[];
  let code="(";
  let codeArgs=[];
  let pcount=parameters? parameters.count:0;
  let updateLocalVariablesAfter=false;
  let minCount=-1;
  let reverseOrder=false;
  if(parameters && parameters.minCount>=0){
    minCount=parameters.minCount;
  }
  if(parameters && parameters.reverseOrder){
    reverseOrder=true;
  }
  let paramNodes=[];
  let i=0;
  if(!node.nextSibling){
    throw source.createError("')' oder Argument erwartet",node.nextSibling);
  }
  while(node.nextSibling && node.nextSibling.name!==")"){
    node=node.nextSibling;
    if(!parameters || i>=pcount){
      throw source.createError("Nur "+pcount+" Argumente erwartet. Zu viele Argumente!",node);
    }
    paramNodes.push(node);
    i++;
    if(!node.nextSibling){
      throw source.createError("')' oder weiteres Argument erwartet",node.nextSibling);
    }
    if(node.nextSibling.name===","){
      if(!node.nextSibling.nextSibling || node.nextSibling.nextSibling.type.isError){
        throw source.createError("Weiteres Argument erwartet.",node);
      }
      node=node.nextSibling;
    }else if(node.nextSibling.name===")"){
      break;
    }else{
      throw source.createError("Unerwarteter Code",node);
    }
  }
  if(paramNodes.length!==minCount && paramNodes.length<pcount){
    if(minCount>=0){
      throw source.createError("Es müssen "+minCount+" oder "+pcount+" Argumente sein.",node);
    }else{
      throw source.createError("Zu wenig Argumente! Es müssen "+pcount+" Argumente sein.",node);
    }
  }
  for(let i=0;i<paramNodes.length;i++){
    let p=parameters.parameters[i];
    let pnode;
    if(reverseOrder){
      pnode=paramNodes[paramNodes.length-1-i];
    }else{
      pnode=paramNodes[i];
    }
    let f=CompileFunctions.get(pnode,source);
    let arg=f(pnode,source,scope);
    if(arg.updateLocalVariablesAfter){
      updateLocalVariablesAfter=true;
    }
    if(arg.error){
      throw source.createError(arg.error,pnode);
    }
    if(!arg.type){
      throw source.createError("Der Datentyp von '"+arg.code+"' ist unbekannt.",pnode);
    }
    if(!p.type){
      throw source.createError("Der "+(i+1)+"-te Parameter ' dieser Methode hat keinen Datentyp.",pnode);
    }
    p.type.autoCastValue(arg);
    if(!arg.type || !arg.type.isSubtypeOf(p.type)){
      let text=source.getText(pnode);
      throw source.createError( "Das "+(i+1)+"-te Argument '"+text+"' ist kein "+p.type+".",pnode);
    }
    if(reverseOrder){
      codeArgs[paramNodes.length-1-i]=arg.code;
    }else{
      codeArgs.push(arg.code);
    }
    
    list.push(arg);
  }
  code+=codeArgs.join(",");
  code+=")";
  return {
    list, code, updateLocalVariablesAfter
  };
}