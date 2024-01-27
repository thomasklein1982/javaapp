import { Type } from "../../classes/Type";
import { Java } from "../java";

export function CharacterLiteral(node,source,scope){
  console.log(node);
  if(node.nextSibling && node.nextSibling.type.isError){
    throw source.createError("Unerwarteter Code nach Abschluss des char-Literals:\n"+source.getText(node.nextSibling)+"",node.nextSibling);
  }
  return {
    code: "(new $Char("+source.getText(node)+"))",
    type: new Type(Java.datatypes.char,0)
  };
}