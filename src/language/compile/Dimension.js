import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { Java } from "../java";

export function Dimension(node,source,scope){
  node=node.firstChild;
  if(node.name!=="["){

  }
  let code="";
  node=node.nextSibling;
  let specified;
  if(node.name==="]"){
    specified=false;
  }else{
    let f=CompileFunctions.get(node,source);
    let val=f(node,source,scope);
    let t=new Type(Java.datatypes.int,0);
    t.autoCastValue(val);
    code+=val.code;
    specified=true;
  }
  return {
    code,
    specified
  }
}