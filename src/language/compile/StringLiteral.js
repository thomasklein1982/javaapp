import { Type } from "../../classes/Type";
import { Java } from "../java";

export function StringLiteral(node,source,scope){
  if(node.nextSibling && node.nextSibling.type.isError){
    let c=source.getText(node.nextSibling);
    throw source.createError("Unerwartetes Zeichen: '"+c+"'.", node.nextSibling);
  }
  let type=new Type(Java.datatypes.String,0);
  scope.addTypeAnnotation(node,type,false);
  let code=source.getText(node);
  try{
    JSON.parse(code);
  }catch(e){
    throw source.createError("Der String enthält mindestens ein ungültiges Zeichen.\n"+e.message, node);
  }
  return {
    code: code,
    type
  };
}