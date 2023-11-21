import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeParameters } from "./TypeParameters";

export function GenericType(node,source,scope){
  node=node.firstChild;
  let f=CompileFunctions.get(node,source);
  let res=f(node,source,scope,{genericType: true});
  let type=res.type;
  let baseType=type.baseType;
  let tparams=baseType.typeParameters;
  if(!tparams){
    throw source.createError("Der Datentyp '"+baseType.name+"' deklariert keine generischen Datentypen. Entferne die spitzen Klammern <>.",node.nextSibling);
  }
  node=node.nextSibling;
  let targs=TypeParameters(node,source,scope);
  type.typeArguments=targs;
  if(targs.length>0 && tparams.length!==targs.length){
    throw source.createError("Falsche Anzahl an Datentypen.",node);
  }
  if(tparams.length===targs.length){
    for(let i=0;i<tparams.length;i++){
      let p=tparams[i];
      let a=targs[i];
      a.param=p;
    }
  }
  return {
    code: baseType.name,
    type
  }
}