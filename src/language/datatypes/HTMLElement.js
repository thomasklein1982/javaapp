import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";
import { Java } from "../java";
import { createConstructor } from "../helper/createConstructor";

export function defineHTMLElement(clazz){
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
      {name: 'element', type: 'HTMElement', info: 'Die Komponente, die hinzugefügt werden soll.'}
    ],
    info: 'Fügt dem HTMLElement ein HTMLElement hinzu.'
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

  createMethod({
    name: 'addEventListener',
    args: [
      {name: 'event', type: 'String', info: 'Art des Events, z. B. "click" oder "change".'},
      {name: 'listener', default: '(ev)->{}', type: 'ActionListener'}
    ],
    info: "Fügt einen EventListener hinzu, der aufgerufen wird, wenn man mit der Komponente interagiert."
  },clazz,false,false);

  createMethod({
    name: 'setValue',
    args: [
      {name: 'v', type: 'String'}
    ]
  },clazz,false,false);

  createMethod({
    name: 'getValue',
    returnType: 'String'
  },clazz,false,false);
}