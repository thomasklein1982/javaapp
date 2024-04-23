import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineJavaApp(clazz){
  createMethod({
    name: "setWatchedObject",
    args: [
      {
        name: "object",
        type: ["Object"],
        info: "Der Wert, der ausgegeben werden soll."
      }
    ],
    info: "Legt das Objekt fest, dessen Eigenschaften angezeigt werden sollen."
  },clazz,true,false);
  
}