import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeName } from "./TypeName";

export function InstanceofExpression(node,source,scope){
  console.log("instanceof",node);
  node=node.firstChild;
  let f=CompileFunctions.get(node,source);
  let objNode=node;
  let obj=f(node,source,scope);
  console.log(obj);
  node=node.nextSibling;
  if(!node.name==="instanceof") throw source.createError("'instanceof' erwartet",node);
  node=node.nextSibling;
  console.log(node);
  if(node.name!=="TypeName"){
    throw source.createError("Klasse erwartet",node);
  }
  let type=TypeName(node,source,scope);
  // if(type.type.baseType.isPrimitive()){
  //   throw source.createError("In 'instanceof' kannst du nur Klassen prüfen, nicht aber primitive Datentypen wie '"+type.type.baseType.name+"'.",node);
  // }
  if(!type.type.baseType.isSubtypeOf(obj.type.baseType) && !obj.type.baseType.isSubtypeOf(type.type.baseType)){
    let text=source.getText(objNode);
    throw source.createError("'"+text+"' hat den Typ '"+obj.type.baseType.name+"' und kann daher keine Instanz der Klasse '"+type.type.baseType.name+"' sein.",node);
  }
  return {
    code: obj.code+" instanceof "+type.code,
    type: new Type(Java.datatypes.boolean,0)
  };
}