import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";

export function defineHashMap(clazz){
  clazz.name="HashMap";
  let T=new Clazz("E");
  T.cannotBeInstantiated=true;
  T.isGeneric=true;
  T.genericIndex=1;
  let K=new Clazz("K");
  K.cannotBeInstantiated=true;
  K.isGeneric=true;
  K.genericIndex=0;
  clazz.typeParameters=[K,T];
  createConstructor ({
    args: []
  },clazz);
  let typeK=new Type(K,0);
  let typeT=new Type(T,0);
  createMethod({
    name: "put",
    info: "",
    args: [{name: "key", type: typeK, info: "Key, unter dem das Element gespeichert wird"}, {name: "element", type: typeT, info: "Wert, der gespeichert wird"}],
  },clazz,false,false);
  createMethod({
    name: "get",
    info: "",
    args: [{name: "key", type: typeK}],
    returnType: typeT
  },clazz,false,false);
  createMethod({
    name: "remove",
    info: "",
    args: [{name: "key", type: typeK, info: "Key, unter dem das Element gespeichert ist"}],
  },clazz,false,false);
  createMethod({
    name: "containsKey",
    info: "",
    args: [{name: "key", type: typeK}],
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "isEmpty",
    info: "",
    args: [],
    returnType: "boolean"
  },clazz,false,false);
  createMethod({
    name: "size",
    info: "",
    args: [],
    returnType: "int"
  },clazz,false,false);
  createMethod({
    name: "keys",
    info: "",
    args: [],
    returnType: {baseType: K, dimension: 1}
  },clazz,false,false);
  createMethod({
    name: "values",
    info: "",
    args: [],
    returnType: {baseType: T, dimension: 1}
  },clazz,false,false);
}
