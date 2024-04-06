import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";
import { Java } from "../java";
import { createConstructor } from "../helper/createConstructor";

export function defineHTMLElement(clazz){
  clazz.superClazz=Java.clazzes.JComponent;
  createConstructor({
    args: [
      {
        name: "tag",
        type: "String",
        info: "Die Art des HTML-Elements, z. B. 'div' oder 'input'"
      }
    ]
  }, clazz);
  createMethod({
    name: 'setAttribute',
    args: [
      {name: 'attribute', type: 'String'},
      {name: 'value', type: 'String'}
    ],
    info: "Legt den Wert eines Attributs des HTML-Elements fest."
  },clazz,false,false);
}