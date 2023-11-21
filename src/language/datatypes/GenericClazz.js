import { Method } from "../../classes/Method";
import { Parameter, ParameterList } from "../../classes/Parameters";
import { appjsdata } from "../../functions/snippets";
import { Modifiers } from "../../classes/Modifiers";
import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";

export function defineGenericClazz(clazz,data,Java){
  for(let i=0;i<data.members.length;i++){
    let mem=data.members[i];
    if(mem.language==="js") continue;
    if(mem.returnType!==undefined){
      createMethod(mem,clazz,false,false,Java);
    }else{
      /**Attribut */
      createAttribute(mem,clazz,false,Java);
    }
  }
};