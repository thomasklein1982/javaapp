import { Type } from "../../classes/Type";
import { handleJavaMultilineString } from "../../functions/handleJavaMultilineString";
import { Java } from "../java";

export function TextBlock(node,source,scope){
  if(node.nextSibling && node.nextSibling.type.isError){
    let c=source.getText(node.nextSibling);
    throw source.createError("Unerwartetes Zeichen: '"+c+"'.", node.nextSibling);
  }
  let type=new Type(Java.datatypes.String,0);
  scope.addTypeAnnotation(node,type,false);
  let code=source.getText(node);
  code=handleJavaMultilineString(code.substring(3,code.length-3));
  code="`"+code+"`";
  return {
    code,
    type
  };
}