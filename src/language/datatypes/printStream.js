import { createMethod } from "../helper/createMethod";

export function definePrintStream(clazz){
  createMethod({
    name: "println",
    args: [
      {
        name: "text",
        type: "Object",
        info: "Der Wert, der ausgegeben werden soll."
      }
    ],
    info: "Gibt den Text aus und macht einen Zeilenumbruch."
  },clazz,false,false);
}