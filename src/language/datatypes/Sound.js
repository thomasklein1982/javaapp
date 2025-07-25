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
      {name: 'frequency', type: 'int', info: 'Frequenz.'}, 
      {name: 'volume', type: 'double', info: 'Lautstärke.'}, 
      {name: 'duration', type: 'int', info: 'Dauer in ms.'},
      {name: 'type', type: 'String', info: 'sine, square, triangle.', optional: true}
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
    name: 'setVolume',
    args: [
      {name: 'v', type: 'double'}
    ],
    info: "0.0 muted bis 1.0 volle Lautstärke"
  },Clazz,false,false,Java);
  createMethod({
    name: 'getVolume',
    args: [
    ],
    returnType: "double",
    info: "0.0 muted bis 1.0 volle Lautstärke"
  },Clazz,false,false,Java);
  createMethod({
    name: 'play',
    args: [
      {name: 'loop', type: 'boolean', optional: true}
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