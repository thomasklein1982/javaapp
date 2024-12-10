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
  let baseType=value.type.baseType;
  if(baseType.isGeneric){
    baseType=Java.datatypes.Object;
  }
  let type={
    baseType,
    dimension: value.type.dimension
  }
  if(baseType.name===Java.clazzes.Object.name && value.type.dimension===0){
    /**wenn der Wert ein Object ist, muss geschaut werden, ob es ein */
  }
  if(!destType.isSubtypeOf(type)){
    throw source.createError("Ein Wert des Typs '"+value.type.toString()+"' kann nicht zu '"+destType.toString()+"' gecastet werden.",node);
  }
  let code;
  if(destType.isPrimitive()){
    destType.autoCastValue(value);
    code=value.code;
  }else{
    code=value.code;//"$castObject("+value.code+", "+JSON.stringify(destType.baseType.name)+", "+destType.dimension+")";
  }
  if(destType.isChar()){
    code="(new $Char("+code+"))";
  }
  //code="(async (v)=>{if(!$isInstanceOf(v,"+destType.toString()+")){throw $new(Exception,'Typen nicht kompatibel')} return v;})("+value.code+")";
  return {
    code,
    type: destType
  }
}