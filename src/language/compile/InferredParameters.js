import { CompileFunctions } from "../CompileFunctions";

export function InferredParameters(node,source,scope){
  console.log("inf",node);
  node=node.firstChild; //(
  node=node.nextSibling;
  let params=[];
  let code="(";
  while(node && !node.type.isError && node.name!==")"){
    if(node.name===","){
      code+=",";
    }else{
      let p=CompileFunctions.get(node,source);
      if(p){
        p=p(node,source,scope);
        params.push(p.code);
        code+=p.code;
      }
    }
    node=node.nextSibling;
  }
  code+=")";
  console.log(code);
  return {
    code,
    params
  }
}