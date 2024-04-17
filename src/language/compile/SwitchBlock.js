import { Java } from "../java";
import { ParenthesizedExpression } from "./ParenthesizedExpression";
import { Block } from "./Block";
import { Scope } from "../../classes/Scope";
import { SwitchLabel } from "./SwitchLabel";
import { CompileFunctions } from "../CompileFunctions";

export function SwitchBlock(node,source,scope,infos){
  let type=infos.type;
  console.log(type);
  node=node.firstChild;
  let code="{\n";
  if(node.name==="{"){
    
  }
  node=node.nextSibling;
  if(node.name!=="SwitchLabel" && node.name!=="}"){
    throw source.createError("'case' oder 'default' oder '}' erwartet",node);
  }
  let closed=false;
  while(node){
    if(node.name==="}"){
      code+="}\n";
      closed=true;
      break;
    }
    if(node.name==="SwitchLabel"){
      let label=SwitchLabel(node,source,scope,{type});
      console.log(label);
      code+=label.code;
    }else{
      let func=CompileFunctions.get(node,source);
      let ex=func(node,source,scope);
      if(!scope.optimizeCompiler && !ex.waitForLineIncluded){
        let line=source.getLineNumber(node.from);
        if(!scope.optimizeCompiler){
          code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+",$scope);";
        }else{
          code+="\n";
        }
      }
      code+=ex.code;
    }
    node=node.nextSibling;
    code+="\n";
  }
  if(!closed){
    throw source.createError("'}' erwartet",node);
  }
  return {
    code,
    type: null
  }
}