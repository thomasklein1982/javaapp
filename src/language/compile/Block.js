import { options } from "../../classes/Options";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { concatArrays } from "../../functions/helper";
import { CompileFunctions } from "../CompileFunctions";

function createUpdateLocalVariablesCode(scope){
  return "";
  if(scope.optimizeCompiler) return "";
  let locals=scope.getLocalVariableNames();
  return "var $locals="+JSON.stringify(locals)+";for(var $a in $locals){eval('$locals[$a]='+$a)};$App.console.updateLocalVariables($locals);";
}


/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @returns 
 */
export function Block(node,source,scope){
  let code="$scope.pushLayer();";
  let errors=[];
  let blockNode=node;
  node=node.firstChild;
  if(!node || node.type.isError || node.name!=='{'){
    errors.push(source.createError("'{' erwartet.",node));
    return {
      code,errors
    }
  }
  if(!scope.optimizeCompiler){
    code+=createUpdateLocalVariablesCode(scope);
  }
  scope.pushLayer();
  let open=true;
  let debugCounter=0;
  window.stopTimeStart();
  while(node.nextSibling && !node.isBlockEnd){
    debugCounter++;
    node=node.nextSibling;
    if(scope.isNodeBeyondEndPosition(node)){
      return scope;
    }
    if(node.name==='}' || options.classOptional && node.type.isError && node.firstChild && node.firstChild.name==="}"){
      open=false;
      break;
    }else{
      try{
        
        let f=CompileFunctions.get(node,source);
        let res=f(node,source,scope);
        if(res instanceof Scope){
          return res;
        }
        if(res.errors){
          concatArrays(errors,res.errors);
        }
        if(!scope.optimizeCompiler && !res.waitForLineIncluded){
          let line=source.getLineNumber(node.from);
          if(!scope.optimizeCompiler){
            code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+",$scope);";
          }else{
            code+="\n";
          }
          code+=res.code;
        }else{
          code+="\n"+res.code;
        }
      }catch(e){
        errors.push(e);
      }
    }
  }
  window.stopTimeStop("statements finished");
  if(open){
    errors.push(source.createError("'}' erwartet.",node));
  }
  //let line=source.state.doc.lineAt(blockNode.to).number;
  if(!scope.optimizeCompiler){
    let line=source.getLineNumber(blockNode.to-1);
    code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+",$scope);";
  }
  scope.popLayer();
  code+="\n$scope.popLayer();"
  if(!scope.optimizeCompiler){
    code+=createUpdateLocalVariablesCode(scope);
  }
  return {
    code, errors
  }
}