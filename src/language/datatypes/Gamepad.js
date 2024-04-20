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
    name: 'nextDouble',
    args: [
    ],
    returnType: "double"
  },Clazz,false,false);
}