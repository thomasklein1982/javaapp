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
    name: 'add',
    args: [
      {name: 'component', type: 'JComponent', info: 'Die Komponente, die hinzugefügt werden soll.'}
    ],
    info: 'Fügt dem HTMLElement eine (weitere) Komponente hinzu.'
  },clazz,false,false,Java);
  createMethod({
    name: 'setAttribute',
    args: [
      {name: 'attribute', type: 'String'},
      {name: 'value', type: 'String'}
    ],
    info: "Legt den Wert eines Attributs des HTML-Elements fest."
  },clazz,false,false);
  createMethod({
    name: 'setInnerHTML',
    args: [
      {name: 'html', type: 'String'}
    ],
    info: "Legt das innere HTML des Elements fest."
  },clazz,false,false);
  createMethod({
    name: 'setTextContent',
    args: [
      {name: 'text', type: 'String'}
    ],
    info: "Legt den Textinhalt des Elements fest."
  },clazz,false,false);
}