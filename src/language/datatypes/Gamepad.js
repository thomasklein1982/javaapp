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
    name: 'setPadding',
    args: [
      {name: "p", type: "String"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setEventListener',
    args: [
      {name: "button", type: "String"},
      {name: "event", type: "String"},
      {name: "(ev)->{}", type: "ActionListener"},
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setDirectionButtonsSize',
    args: [
      {name: "size", type: "double"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setActionButtonsSize',
    args: [
      {name: "size", type: "double"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setKey',
    args: [
      {name: "button", type: "String"},
      {name: "key", type: ["String","int"]}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setButtonVisible',
    args: [
      {name: "button", type: "String"},
      {name: "visible", type: "boolean"}
    ]
  },Clazz,false,false);
}