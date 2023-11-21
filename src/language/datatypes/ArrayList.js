import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";

export function defineArrayList(clazz){
  clazz.name="ArrayList";
  let T=new Clazz("T");
  T.cannotBeInstantiated=true;
  T.isGeneric=true;
  T.genericIndex=0;
  clazz.typeParameters=[T];
  createConstructor ({
    args: [
      {name: "initialCapacity", type: "int", optional: true}
    ]
  },clazz);
  let typeT=new Type(T,0);
  createMethod({
    name: "add",
    info: "",
    args: [{name: "element", type: typeT, info: ""},{name: "index", type: "int", info: "", optional: true}],
    reverseArgsOrder: true,
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "remove",
    info: "",
    args: [{name: "index", type: "int", info: ""}],
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "clear",
    info: "",
    args: [],
  },clazz,false,false);
  createMethod({
    name: "addAll",
    info: "",
    args: [{name: "collection", type: clazz, info: ""}, {name: "index", type: "int", info: "",optional: true}],
    reverseArgsOrder: true,
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "get",
    info: "",
    args: [{name: "index", type: "int", info: ""}],
    returnType: typeT
  },clazz,false,false);
  createMethod({
    name: "set",
    info: "",
    args: [{name: "index", type: "int", info: ""}, {name: "element", type: typeT, info: ""}]
  },clazz,false,false);
  createMethod({
    name: "toArray",
    info: "",
    args: [],
    returnType: {baseType: T, dimension: 1}
  },clazz,false,false);
  createMethod({
    name: "size",
    info: "",
    args: [],
    returnType: "int"
  },clazz,false,false);
  createMethod({
    name: "isEmpty",
    info: "",
    args: [],
    returnType: "boolean"
  },clazz,false,false);
  createMethod({
    name: "contains",
    info: "",
    args: [{name: "element", type: typeT, info: ""}],
    returnType: "boolean"
  },clazz,false,false);
  createMethod({
    name: "indexOf",
    info: "",
    args: [{name: "element", type: typeT, info: ""}],
    returnType: "int"
  },clazz,false,false);
  createMethod({
    name: "lastIndexOf",
    info: "",
    args: [{name: "element", type: typeT, info: ""}],
    returnType: "int"
  },clazz,false,false);
  createMethod({
    name: "removeRange",
    info: "",
    args: [{name: "fromIndex", type: "int", info: ""}, {name: "toIndex", type: "int", info: ""}],
  },clazz,false,false);
  createMethod({
    name: "removeAll",
    info: "",
    args: [{name: "collection", type: clazz, info: ""}],
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "retainAll",
    info: "",
    args: [{name: "collection", type: clazz, info: ""}],
    returnType: 'boolean'
  },clazz,false,false);
  // createMethod({
  //   name: "subList",
  //   info: "",
  //   args: [{name: "fromIndex", type: "int", info: ""}, {name: "toIndex", type: "int", info: ""}],
  //   returnType: {name: "ArrayList"}
  // },clazz,false,false);
  createMethod({
    name: "sort",
    info: "",
    args: [{name: "comparator", type: "$LAMBDA"}],
  },clazz,false,false);
}
