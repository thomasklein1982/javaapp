import { Type } from "../../classes/Type";

export function MethodReference(node,source,scope){
  let root=node;
  node=node.firstChild;
  while(node){
    if(node.type.isError){
      if(root.firstChild.name.indexOf("Type")>=0){
        throw source.createError("Syntax-Fehler: Du kannst an dieser Stelle keine Variable deklarieren.",node);
      }
      throw source.createError("Syntax-Fehler: Fehlt hier vielleicht der Index?",node);
    }
    node=node.nextSibling;
  }
  throw source.createError("Unbekanntes Sprachkonstrukt [MethodReference]: Sorry, damit kann ich nichts anfangen :(",root);
}