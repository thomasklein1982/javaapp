import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineInteger(Clazz,Java){
  /*
  createConstructor({
    args: [
      {name: 'value', type: 'int'}
    ]
  },Clazz);*/
  createMethod({
    name: 'parseInt',
    args: [
      {name: 's', type: 'String'}, {name: 'radix', type: 'int', optional: true}
    ],
    returnType: "int"
  },Clazz,true,false,Java);
  createMethod({
    name: 'valueOf',
    args: [
      {name: 's', type: ['String','int']}
    ],
    returnType: "Integer"
  },Clazz,true,false,Java);
}

export function defineBoolean(Clazz,Java){
  createMethod({
    name: 'parseBoolean',
    args: [
      {name: 's', type: 'String'}
    ],
    returnType: "boolean"
  },Clazz,true,false,Java);
  createMethod({
    name: 'valueOf',
    args: [
      {name: 's', type: ['String','boolean']}
    ],
    returnType: "Boolean"
  },Clazz,true,false,Java);
}

export function defineDouble(Clazz,Java){
  createMethod({
    name: 'parseDouble',
    args: [
      {name: 's', type: 'String'}
    ],
    returnType: "double"
  },Clazz,true,false,Java);
  createMethod({
    name: 'valueOf',
    args: [
      {name: 's', type: ['String','double']}
    ],
    returnType: "Double"
  },Clazz,true,false,Java);
}

export function defineChar(Clazz,Java){
  createMethod({
    name: 'parseChar',
    args: [
      {name: 's', type: 'String'}
    ],
    returnType: "char"
  },Clazz,true,false,Java);
  createMethod({
    name: 'valueOf',
    args: [
      {name: 's', type: ['String','char']}
    ],
    returnType: "Char"
  },Clazz,true,false,Java);
}