import { options } from "../../classes/Options";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { concatArrays } from "../../functions/helper";
import { CompileFunctions } from "../CompileFunctions";

function createUpdateLocalVariablesCode(scope){
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
  let code="";
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
  while(node.nextSibling && !node.isBlockEnd){
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
        if(!scope.optimizeCompiler){
          let line=source.getLineNumber(node.from);
          code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+",this);"+res.code;
          if(res.updateLocalVariablesAfter && scope.addLocalVariablesUpdates){
            let vnames;
            if(res.updateLocalVariablesAfter===true){
              vnames=[];
              let localVariables=scope.getLocalVariables();
              for(let vname in localVariables){
                vnames.push(localVariables[vname].name);
              }
            }else{
              vnames=res.updateLocalVariablesAfter;
            }
            if(vnames){
              code+="eval('";
              for(let i=0;i<vnames.length;i++){
                let name=vnames[i];
                code+="$locals["+JSON.stringify(name)+"]="+name+";";
              }
              code+="',$App.console.updateLocalVariables($locals));";
            }
          }
        }else{
          code+="\n"+res.code;
        }
      }catch(e){
        errors.push(e);
      }
    }
  }
  if(open){
    errors.push(source.createError("'}' erwartet.",node));
  }
  //let line=source.state.doc.lineAt(blockNode.to).number;
  if(!scope.optimizeCompiler){
    let line=source.getLineNumber(blockNode.to-1);
    code+="\nawait $App.debug.line("+line+","+JSON.stringify(scope.method.clazz.name)+",this);";
  }
  scope.popLayer();
  if(!scope.optimizeCompiler){
    code+=createUpdateLocalVariablesCode(scope);
  }
  return {
    code, errors
  }
}