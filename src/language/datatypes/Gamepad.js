import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineGamepad(Clazz,Java){
  createConstructor({
    args: [
      
    ]
  },Clazz);
  createMethod({
    name: 'getDirection',
    args: [
    ],
    returnType: "String"
  },Clazz,false,false);
  createMethod({
    name: 'isUpPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isDownPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isLeftPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isRightPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'setPosition',
    args: [
      {name: "left", type: "String"},
      {name: "bottom", type: "String"},
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setWidth',
    args: [
      {name: "w", type: "String"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setButtonListener',
    args: [
      {name: "button", type: "String"},
      {name: "event", type: "String"},
      {name: "(ev)->{}", type: "ActionListener"},
    ]
  },Clazz,false,false);
}