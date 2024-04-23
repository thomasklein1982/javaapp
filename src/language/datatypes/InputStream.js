import { createMethod } from "../helper/createMethod";

export function defineInputStream(clazz){
  createMethod({
    name: "read",
    args: [],
    info: "Liest das nächste Zeichen des Eingabe-Streams.",
    returnType: "int"
  },clazz,false,false);
}