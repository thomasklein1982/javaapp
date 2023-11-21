import { Clazz } from "../../classes/Clazz";
import { UIClazz } from "../../classes/UIClazz";
import { CompileFunctions } from "../CompileFunctions";
import { PrimitiveType } from "./PrimitiveType";

export function AssignmentExpression(node,source,scope){
  
  let code;
  node=node.firstChild;
  let updateLocalVariablesAfter=false;
  if(node.name!=="Identifier"){

  }
  let v=CompileFunctions.get(node,source)(node,source,scope);
  
  if(v && v.object && (v.object instanceof Clazz || v.object instanceof PrimitiveType || v.object instanceof UIClazz)){
    throw source.createError("Du kannst dem Datentyp '"+v.name+"' keinen Wert zuweisen.",node);
  }
  if(!v || !v.type){
    throw source.createError("Du kannst dem Ausdruck '"+v.name+"' keinen Wert zuweisen.",node);
  }
  node=node.nextSibling;
  if(node.name!=="AssignOp"){
    throw source.createError("'=' erwartet.",node);
  }
  let assignOp=source.getText(node);
  node=node.nextSibling;
  let f=CompileFunctions.get(node,source);
  let val=f(node,source,scope,{assignTarget: v.object});
  if(!val.type){
    throw source.createError("Dieser Ausdruck hat keinen Wert, der zugewiesen werden könnte.",node);
  }
  v.type.autoCastValue(val);
  if(!val.type.isSubtypeOf(v.type)){
    throw source.createError("Einer Variablen vom Typ '"+v.type+"' kann kein Wert vom Typ '"+val.type+"' zugewiesen werden.",node);
  }
  if(val.updateLocalVariablesAfter===true){
    updateLocalVariablesAfter=true;
  }
  if(v.codeSet){
    code=v.codeSet+val.code+","+JSON.stringify(assignOp)+")";
  }else{
    code=v.code+assignOp+val.code;
  }
  return {
    code,
    local: v.local,
    name: v.name,
    updateLocalVariablesAfter
  }
}