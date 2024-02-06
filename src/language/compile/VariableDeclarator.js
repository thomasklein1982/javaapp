import { CompileFunctions } from "../CompileFunctions";

export function VariableDeclarator(node,source,scope,vType){
  let code;
  let type=null;
  let initialValue=null;
  if(!node.firstChild){
    throw source.createError("Ein Variablenname muss mit einem Buchstaben oder einem Unterstrich beginnen.",node);
  }
  node=node.firstChild;
  let name=source.getText(node);
  if(/[^a-zA-Z_]/.test(name.charAt(0))){
    throw source.createError("Ein Variablenname muss mit einem Buchstaben oder einem Unterstrich beginnen.",node);
  }
  let val;
  if(node.nextSibling){
    node=node.nextSibling;
    if(node.type.isError){
      throw source.createError("Unerwartetes Zeichen.",node);
    }
    if(node.name!=="AssignOp"){ 
      throw source.createError("'=' erwartet.",node);
    }
    node=node.nextSibling;
    let f=CompileFunctions.get(node,source);
    val=f(node,source,scope);
    if(!val.type){
      throw source.createError("Dieser Ausdruck hat keinen Wert, der zugewiesen werden könnte.",node);
    }
    vType.applyAutoboxing(val);
    vType.autoCastValue(val);
    if(!val.type.isSubtypeOf(vType)){
      throw source.createError("Einer Variablen vom Typ '"+vType+"' kann kein Wert vom Typ '"+val.type+"' zugewiesen werden.",node);
    }
    code=name+"="+val.code;
    type=val.type;
    initialValue=val.code;
  }else{
    code=name;
  }
  return {
    code,
    name,
    value: val,
    type,
    initialValue
  }
}