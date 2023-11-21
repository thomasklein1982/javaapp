import { CompileFunctions } from "../CompileFunctions";
import { VariableDeclarator } from "./VariableDeclarator";

export function LocalVariableDeclaration(node,source,scope){
  let code;
  node=node.firstChild;
  if(node.name!=="PrimitiveType" || node.name!=="TypeName"){

  }
  let type=CompileFunctions.get(node,source)(node,source,scope);
  type=type.type;
  code="let ";
  node=node.nextSibling;
  let weiter=true;
  let vnames=[];
  let initialValues=[];
  while(weiter){
    let vdekl=VariableDeclarator(node,source,scope,type);
    try{
      scope.pushLocalVariable(vdekl.name,type);
      vnames.push(vdekl.name);
      initialValues.push(vdekl.initialValue);
    }catch(e){
      throw (source.createError(e,node));
    }
    if(vdekl.type){
      vdekl.type.autoCastValue(type);
      if(!vdekl.type.isSubtypeOf(type)){
        throw source.createError("Einer Variablen vom Typ '"+type+"' kann kein Wert vom Typ '"+vdekl.type+"' zugewiesen werden.",node);
      }
    }
    code+=vdekl.code;
    node=node.nextSibling;
    if(node.name!==","){
      weiter=false;
    }else{
      code+=",";
      node=node.nextSibling;
    }
  }
  if(node.type.isError || node.name!==";"){
    throw (source.createError("';' erwartet.",node));
  }
  code+=";";
  //code+="eval('$locals["+JSON.stringify(vdekl.name)+"]='+"+vdekl.name+",$App.console.updateLocalVariables($locals));";
  return {
    code,
    type,
    updateLocalVariablesAfter: vnames,
    initialValues
  };
}