import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineInteger(Clazz,Java){
  createConstructor({
    args: [
      {name: 'source', type: 'String'}
    ]
  },Clazz);
  createMethod({
    name: 'setSource',
    args: [
      {name: 'source', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'play',
    args: [
      {name: 'loop', type: 'boolean'}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'pause',
    args: [
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'stop',
    args: [],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'getDuration',
    args: [],
    info: "",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'getCurrentTime',
    args: [],
    info: "",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'setCurrentTime',
    args: [{name: "time", type: "int"}],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'isEnded',
    args: [],
    info: "",
    returnType: "boolean"
  },Clazz,false,false);
}