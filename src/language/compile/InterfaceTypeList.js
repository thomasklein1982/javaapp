import { TypeName } from "./TypeName";

export function InterfaceTypeList(node,source,scope){
  node=node.firstChild;
  console.log("interface type list", node);
  let types=[];
  if(node.name==="TypeName"){
    let index=0;
    let typeNames={};
    while(node.name==="TypeName"){
      let type=TypeName(node,source,scope);
      if(type.type && type.type.baseType.isInterface!==true){
        throw source.createError("'"+type.type.baseType.name+"' ist kein Interface.",node);
      }
      if(typeNames[type.code]===undefined){
        typeNames[type.code]=true;
        type.node=node;
        if(type.type){
          types.push(type.type.baseType);
        }else{
          types.push({name: type.code});
        }
      }else{
        throw source.createError("Doppelter Typ-Parameter '"+type.code+"'.",node);
      }
      node=node.nextSibling;
      if(!node) break;
      if(node.name===","){
        node=node.nextSibling;
      }
      index++;
    }
    
  }
  return {
    types
  };
}