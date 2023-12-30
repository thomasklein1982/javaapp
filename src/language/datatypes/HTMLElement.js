import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";
import { Java } from "../java";
import { createConstructor } from "../helper/createConstructor";

export function defineHTMLElement(clazz){
  clazz.superClazz=Java.clazzes.JPanel;
  createConstructor({
    args: [
      {
        name: "tag",
        type: "String",
        info: "Die Art des HTML-Elements, z. B. 'div' oder 'input'"
      }
    ]
  }, clazz);
}