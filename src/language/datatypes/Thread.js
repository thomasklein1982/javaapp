import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineThread(clazz){
  createMethod({
    name: "sleep",
    args: [{
      name: "millis",
      type: "int",
      info: "Anzahl Millisekunden"
    }],
    info: "Wartet einige Millisekunden."
  },clazz,true,false);
}