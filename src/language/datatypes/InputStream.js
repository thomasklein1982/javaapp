import { createMethod } from "../helper/createMethod";

export function defineInputStream(clazz){
  createMethod({
    name: "read",
    args: [],
    info: "Liest das nächste Zeichen des Eingabe-Streams.",
    returnType: "int"
  },clazz,false,false);
  // createMethod({
  //   name: "readln",
  //   args: [],
  //   info: "Fordert den User auf, eine Zeile Text einzugeben und gibt die Eingabe zurück.",
  //   returnType: "String"
  // },clazz,false,false);
}