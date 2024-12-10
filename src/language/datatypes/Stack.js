import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";

export function defineStack(clazz){
  clazz.name="Stack";
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
    name: "push",
    info: "",
    args: [{name: "element", type: typeT, info: ""}],
  },clazz,false,false);
  createMethod({
    name: "pop",
    info: "",
    args: [],
    returnType: typeT
  },clazz,false,false);
  createMethod({
    name: "top",
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
