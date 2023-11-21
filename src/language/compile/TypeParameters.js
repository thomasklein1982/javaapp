import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";
import { TypeParameter } from "./TypeParameter";

export function TypeParameters(node,source,scope){
  node=node.firstChild;
  if(!node){
    return [];
  }
  let typeParameters=[];
  if(node.name==="TypeParameter"){
    let index=0;
    let typeParameterNames={};
    while(node.name==="TypeParameter"){
      let tp=TypeParameter(node,source,scope);
      tp.genericIndex=index;
      if(typeParameterNames[tp.name]===undefined){
        typeParameterNames[tp.name]=tp;
        typeParameters.push(tp);
      }else{
        throw source.createError("Doppelter Typ-Parameter '"+tp.name+"'.",node);
      }
      node=node.nextSibling;
      if(!node) break;
      if(node.name===","){
        node=node.nextSibling;
      }
      index++;
    }
    
  }else{
    while(node){
      let f=CompileFunctions.get(node,source);
      let type=f(node,source,scope);
      typeParameters.push(type.type);
      node=node.nextSibling;
      if(!node) break;
      if(node.name===","){
        node=node.nextSibling;
      }
    }
  }
  return typeParameters;
}