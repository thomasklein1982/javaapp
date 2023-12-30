import { Type } from "../../classes/Type";

export function MethodReference(node,source,scope){
  let root=node;
  node=node.firstChild;
  while(node){
    if(node.type.isError){
      throw source.createError("Syntax-Fehler: Fehlt hier vielleicht der Index?",node);
    }
    node=node.nextSibling;
  }
  throw source.createError("Unbekanntes Sprachkonstrukt [MethodReference]: Sorry, damit kann ich nichts anfangen :(",root);
}