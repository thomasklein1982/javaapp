import { createMethod } from "../helper/createMethod";

export function definePrintStream(clazz){
  createMethod({
    name: "println",
    args: [
      {
        name: "text",
        type: ["double","int","boolean","char","String","Object"],
        info: "Der Wert, der ausgegeben werden soll.",
        optional: true
      }
    ],
    info: "Gibt den Text aus und macht einen Zeilenumbruch."
  },clazz,false,false);
  createMethod({
    name: "print",
    args: [
      {
        name: "text",
        type: ["String","int","double","boolean","char","Object"],
        info: "Der Wert, der ausgegeben werden soll.",
        optional: true
      }
    ],
    info: "Gibt den Text aus."
  },clazz,false,false);
}