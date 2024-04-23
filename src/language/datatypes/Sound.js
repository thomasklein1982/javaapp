import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineSound(Clazz,Java){
  createConstructor({
    args: [
      {name: 'source', type: 'String'}
    ]
  },Clazz);
  createMethod({
    name: 'beep',
    args: [
      {name: 'type', type: 'String', info: 'sine, square, triangle.'}, 
      {name: 'frequency', type: 'int', info: 'Frequenz.'}, 
      {name: 'volumne', type: 'double', info: 'Lautstärke.'}, 
      {name: 'duration', type: 'int', info: 'Dauer in ms.'}
    ],
    isExtraFunction: true,
    jsName: "$beep",
    info: "Spielt einen Ton ab."
  },Clazz,true,false);
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