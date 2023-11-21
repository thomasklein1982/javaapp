import { Clazz } from "../../classes/Clazz";
import { Scope } from "../../classes/Scope";
import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeBound } from "./TypeBound";

export function TypeParameter(node,source,scope){
  node=node.firstChild;
  let name;
  let superclazz;
  if(node.name==="Definition"){
    name=source.getText(node);
    if(name.length===0){
      throw source.createError("Du musst mindestens einen generischen Datentypen in die soitzen Klammern deklarieren.",node);
    }
    node=node.nextSibling;
  }
  if(node && node.type.isError){
    throw source.createError("Syntax-Fehler",node);
  }
  if(node && node.name==="TypeBound"){
    superclazz=TypeBound(node,source,scope);
  }
  let c=new Clazz(name);
  c.isGeneric=true;
  // if(scope instanceof Clazz){
  //   c.genericClazz=scope;
  // }else if(scope instanceof Scope){
  //   c.genericClazz=scope.method.clazz;
  // }
  c.cannotBeInstantiated=true;
  return c;
  
}