import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";

export function defineQueue(clazz){
  clazz.name="Queue";
  let T=new Clazz("T");
  T.cannotBeInstantiated=true;
  T.isGeneric=true;
  T.genericIndex=0;
  clazz.typeParameters=[T];
  createConstructor ({
    args: []
  },clazz);
  let typeT=new Type(T,0);
  createMethod({
    name: "add",
    info: "",
    args: [{name: "element", type: typeT, info: ""}],
  },clazz,false,false);
  createMethod({
    name: "remove",
    info: "",
    args: [],
    returnType: typeT
  },clazz,false,false);
  createMethod({
    name: "peek",
    info: "",
    args: [],
    returnType: typeT
  },clazz,false,false);
  createMethod({
    name: "isEmpty",
    info: "",
    args: [],
    returnType: "boolean"
  },clazz,false,false);
}
