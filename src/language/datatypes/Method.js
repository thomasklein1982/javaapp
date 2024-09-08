import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";

export function defineException(clazz){
  createConstructor({
    args: [
      {
        name: "message",
        type: "String",
        info: "Fehler-Meldung"
      }
    ],
    info: "Eine Ausnahme, die im Programm auftreten kann."
  },clazz);
  createMethod({
    name: "getMessage",
    args: [],
    info: "Liefert die Nachricht der Exception.",
    returnType: 'String'
  },clazz,false,false);
}