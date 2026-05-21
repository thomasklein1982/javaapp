

import { createMethod } from "../helper/createMethod";

export function defineConsole(clazz){
  createMethod({
    name: "printLine",
    args: [
      {
        name: "text",
        type: ["double","int","boolean","char","String","Object"],
        info: "Der Text, der ausgegeben werden soll."
      }
    ],
    info: "Gibt eine Zeile Text aus."
  },clazz,true,false);
  createMethod({
    name: "print",
    args: [
      {
        name: "text",
        type: ["String","int","double","boolean","char","Object"],
        info: "Der Text, der ausgegeben werden soll."
      }
    ],
    info: "Gibt den Text aus."
  },clazz,true,false);
  createMethod({
    name: "read",
    args: [
    ],
    info: "Lässt den User Text eingeben und liefert die Eingabe zurück.",
    returnType: "String"
  },clazz,true,false);
  createMethod({
    name: "wait",
    args: [
    ],
    info: "Wartet darauf, dass der User eine Taste drückt oder mit der Maus klickt."
  },clazz,true,false);
  createMethod({
    name: "clear",
    args: [
    ],
    info: "Löscht den Inhalt der Konsole."
  },clazz,true,false);
}