import { CompileFunctions } from "../CompileFunctions";

export function VariableDeclarator(node,source,scope,vType){
  let code;
  let type=null;
  let initialValue=null;
  let name = getVariableName(node,source);
  node=node.firstChild;
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
    val=f(node,source,scope,{assignTarget: {type: vType}});//let val=f(node,source,scope,{assignTarget: v.object});
    if(!val.type){
      throw source.createError("Dieser Ausdruck hat keinen Wert, der zugewiesen werden könnte.",node);
    }
    if(vType.baseType==="var"){
      vType.baseType=val.type.baseType;
    }else{
      vType.applyAutoboxing(val);
      vType.autoCastValue(val);
      if(!val.type.isSubtypeOf(vType)){
        throw source.createError("Einer Variablen vom Typ '"+vType+"' kann kein Wert vom Typ '"+val.type+"' zugewiesen werden.",node);
      }
    }
    code=name+"="+val.code;
    type=val.type;
    initialValue=val.code;
  }else{
    if(vType.baseType==="var"){
      throw source.createError("'var' ist nur erlaubt, wenn du direkt einen Wert zuweist.\nErlaubt: var x = 5;\nNicht erlaubt: var x;",node);
    }
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

export function getVariableName(node,source){
  if(!node.firstChild){
    throw source.createError("Ein Variablenname muss mit einem Buchstaben oder einem Unterstrich beginnen.",node);
  }
  node=node.firstChild;
  let name=source.getText(node).trim();
  if(name.length===0){
    let from=Math.min(node.to,node.from);
    let n={
      from: from,
      to: from+1
    };
    throw source.createError("Hier fehlt der Name der Variablen.",n);
  }
  if(/[^a-zA-Z_]/.test(name.charAt(0))){
    throw source.createError("Ein Variablenname muss mit einem Buchstaben oder einem Unterstrich beginnen.",node);
  }
  return name;
}