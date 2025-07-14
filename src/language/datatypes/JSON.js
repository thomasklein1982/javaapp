import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineJSON(Clazz,Java){
  createConstructor({
    args: [
      
    ]
  },Clazz);
  createMethod({
    name: 'stringify',
    isExtraFunction: true,
    args: [
      {name: 'obj', type: 'Object'}
    ],
    returnType: "String",
    jsName: "$jsstringify"
  },Clazz,true,false);
  createMethod({
    name: 'putData',
    isExtraFunction: true,
    args: [
      {name: 'target', type: 'Object'}
    ],
    returnType: null,
    jsName: "$jsputData"
  },Clazz,false,false);
  createMethod({
    name: 'parse',
    isExtraFunction: true,
    args: [
      {name: 's', type: 'String'}
    ],
    info: "",
    returnType: "JSON",
    jsName: "$jsparse"
  },Clazz,true,false);
  createMethod({
    name: 'getKeys',
    isExtraFunction: true,
    args: [
    ],
    info: "",
    returnType: {baseType: "String",dimension: 1},
    jsName: "$jsgetKeys"
  },Clazz,false,false);
  createMethod({
    name: 'hasKey',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "boolean",
    jsName: "$jshasKey"
  },Clazz,false,false);
  createMethod({
    name: 'getString',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "String",
    jsName: "$jsgetString"
  },Clazz,false,false);
  createMethod({
    name: 'getInt',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "int",
    jsName: "$jsgetInt"
  },Clazz,false,false);
  createMethod({
    name: 'toInt',
    isExtraFunction: true,
    args: [],
    info: "",
    returnType: "int",
    jsName: "$jstoInt"
  },Clazz,false,false);
  createMethod({
    name: 'getDouble',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "double",
    jsName: "$jsgetDouble"
  },Clazz,false,false);
  createMethod({
    name: 'toDouble',
    isExtraFunction: true,
    args: [],
    info: "",
    returnType: "double",
    jsName: "$jstoDouble"
  },Clazz,false,false);
  createMethod({
    name: 'getBoolean',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "boolean",
    jsName: "$jsgetBoolean"
  },Clazz,false,false);
  createMethod({
    name: 'toBoolean',
    isExtraFunction: true,
    args: [],
    info: "",
    returnType: "boolean",
    jsName: "$jstoBoolean"
  },Clazz,false,false);
  createMethod({
    name: 'toArray',
    isExtraFunction: true,
    args: [],
    info: "",
    returnType: {baseType: "JSON", dimension: 1},
    jsName: "$jstoArray"
  },Clazz,false,false);
  createMethod({
    name: 'get',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: "JSON",
    jsName: "$jsget"
  },Clazz,false,false);
  createMethod({
    name: 'getArray',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}],
    info: "",
    returnType: {baseType: "JSON", dimension: 1},
    jsName: "$jsgetArray"
  },Clazz,false,false);

  createMethod({
    name: 'setString',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}, {name: '"wert"', type: 'String'}],
    info: "",
    jsName: "$jsset"
  },Clazz,false,false);
  createMethod({
    name: 'setInt',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}, {name: '0', type: 'int'}],
    info: "",
    jsName: "$jsset"
  },Clazz,false,false);
  createMethod({
    name: 'setBoolean',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}, {name: 'true', type: 'boolean'}],
    info: "",
    jsName: "$jsset"
  },Clazz,false,false);
  createMethod({
    name: 'setDouble',
    isExtraFunction: true,
    args: [{name: 'key', type: 'String'}, {name: '0', type: 'double'}],
    info: "",
    jsName: "$jsset"
  },Clazz,false,false);
}