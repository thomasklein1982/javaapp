import { createAttribute } from "../helper/createAttribute";
import { Java } from "../java";

export function defineSystem(clazz){
  
  createAttribute({
    name: "out",
    info: "Der Standard-Printstream des Systems.",
    type: 'PrintStream'
  },clazz,true,false,Java);
}