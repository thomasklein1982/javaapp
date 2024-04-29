import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineWorld(Clazz,Java){
  createConstructor({
    args: [
      {name: 'description', type: 'String'}
    ]
  },Clazz);
  createMethod({
    name: 'forEachTile',
    args: [
      {name: '(x,y,type)->{}', type: 'TileHandler', info: 'Methode, die für jedes Feld der Welt aufgerufen wird.'}
    ],
    info: "Führt Anweisungen für jedes Feld der Welt aus."
  },Clazz,false,false);
  createMethod({
    name: 'getType',
    args: [
      {name: 'x', type: 'double'},
      {name: 'y', type: 'double'}
    ],
    returnType: "String"
  },Clazz,false,false,Java);
  createMethod({
    name: 'setType',
    args: [
      {name: 'x', type: 'double'},
      {name: 'y', type: 'double'},
      {name: 'type', type: 'String'}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'scrollTo',
    args: [
      {name: 'x', type: 'double'},
      {name: 'y', type: 'double'}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'scrollBy',
    args: [
      {name: 'x', type: 'double'},
      {name: 'y', type: 'double'}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'getWorldX',
    args: [
      {name: 'x', type: 'double'}
    ],
    returnType: "double",
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'getWorldY',
    args: [
      {name: 'y', type: 'double'}
    ],
    returnType: "double",
    info: ""
  },Clazz,false,false);
}