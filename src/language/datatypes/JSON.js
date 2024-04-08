import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineJSON(Clazz,Java){
  Clazz.jsName="JSON_Java";
  createConstructor({
    args: [
      
    ]
  },Clazz);
  createMethod({
    name: 'stringify',
    args: [
      {name: 'obj', type: 'Object'}
    ],
    returnType: "String"
  },Clazz,true,false);
  createMethod({
    name: 'parse',
    args: [
      {name: 's', type: 'String'}
    ],
    info: "",
    returnType: "JSON"
  },Clazz,true,false);
  createMethod({
    name: 'getKeys',
    args: [
    ],
    info: "",
    returnType: {baseType: "String",dimension: 1}
  },Clazz,false,false);
  createMethod({
    name: 'hasKey',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'getString',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "String"
  },Clazz,false,false);
  createMethod({
    name: 'getInt',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'toInt',
    args: [],
    info: "",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'getDouble',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "double"
  },Clazz,false,false);
  createMethod({
    name: 'toDouble',
    args: [],
    info: "",
    returnType: "double"
  },Clazz,false,false);
  createMethod({
    name: 'getBoolean',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'toBoolean',
    args: [],
    info: "",
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'get',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "JSON"
  },Clazz,false,false);
  createMethod({
    name: 'getArray',
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: {baseType: "JSON", dimension: 1}
  },Clazz,false,false);

  createMethod({
    name: 'setString',
    args: [{name: 'key', type: 'String'}, {name: '"wert"', type: 'String'}],
    info: "",
  },Clazz,false,false);
  createMethod({
    name: 'setInt',
    args: [{name: 'key', type: 'String'}, {name: '0', type: 'int'}],
    info: "",
  },Clazz,false,false);
  createMethod({
    name: 'setBoolean',
    args: [{name: 'key', type: 'String'}, {name: 'true', type: 'boolean'}],
    info: "",
  },Clazz,false,false);
  createMethod({
    name: 'setDouble',
    args: [{name: 'key', type: 'String'}, {name: '0', type: 'double'}],
    info: "",
  },Clazz,false,false);
}