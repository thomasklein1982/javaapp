import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function CastExpression(node,source,scope){
  node=node.firstChild;
  node=node.nextSibling;
  let func=CompileFunctions.get(node,source);
  if(!func){
    let name=source.getText(node);
    throw source.createError("Bei einem expiliziten Cast muss ein Datentyp angegeben werden, zu dem gecastet wird.\n'"+name+"' ist kein Datentyp.",node);
  }
  let destType=func(node,source,scope);
  destType=destType.type;
  node=node.nextSibling.nextSibling;
  func=CompileFunctions.get(node,source);
  if(!func){
    
  }
  let value=func(node,source,scope);
  if(value.type.baseType.name===Java.clazzes.Object.name && value.type.dimension===0){
    /**wenn der Wert ein Object ist, muss geschaut werden, ob es ein */
  }
  if(!destType.isSubtypeOf(value.type)){
    throw source.createError("Ein Wert des Typs '"+value.type.toString()+"' kann nicht zu '"+destType.toString()+"' gecastet werden.",node);
  }
  let code;
  if(destType.isPrimitive()){
    destType.autoCastValue(value);
    code=value.code;
  }else{
    code=value.code;//"$castObject("+value.code+", "+JSON.stringify(destType.baseType.name)+", "+destType.dimension+")";
  }
  return {
    code,
    type: destType
  }
}