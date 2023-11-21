import { Method } from "../../classes/Method";
import { Parameter, ParameterList } from "../../classes/Parameters";
import { appjsdata } from "../../functions/snippets"
import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";

export function defineApp(App,Java){
  let functions=appjsdata.functions;
  for(let i=0;i<functions.length;i++){
    let f=functions[i];
    createMethod(f,App,true,false,Java);
  }
  let objects=appjsdata.objects;
  for(let name in objects){
    let obj=objects[name];
    let type=Java.datatypes[name.charAt(0).toUpperCase()+name.substring(1)];
    if(type){
      createAttribute({
        name: name,
        type: type.name
      },App,true,Java);
    }
  }

};