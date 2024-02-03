import { createMethod } from "../helper/createMethod";

export function definePrintStream(clazz){
  createMethod({
    name: "println",
    args: [
      {
        name: "text",
        type: ["double","int","boolean","char","String","Object"],
        info: "Der Wert, der ausgegeben werden soll."
      }
    ],
    info: "Gibt den Text aus und macht einen Zeilenumbruch."
  },clazz,false,false);
  createMethod({
    name: "print",
    args: [
      {
        name: "text",
        type: ["int","double","boolean","char","String","Object"],
        info: "Der Wert, der ausgegeben werden soll."
      }
    ],
    info: "Gibt den Text aus."
  },clazz,false,false);
}