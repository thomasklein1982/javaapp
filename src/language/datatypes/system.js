import { createAttribute } from "../helper/createAttribute";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineSystem(clazz){
  
  createAttribute({
    name: "out",
    info: "Der Standard-Printstream des Systems.",
    type: 'PrintStream'
  },clazz,true,false,Java);

  createMethod({
    name: "console",
    args: [],
    returnType: "Console"
  },clazz,true,false);
}