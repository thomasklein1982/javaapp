import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineRandom(Clazz,Java){
  createConstructor({
    args: [
      {name: 'seed', type: 'int', optional: true}
    ]
  },Clazz);
  createMethod({
    name: 'setSeed',
    args: [
      {name: 'seed', type: 'int'}
    ],
    info: "Legt den Seed fest."
  },Clazz,false,false);
  createMethod({
    name: 'nextInt',
    args: [
      {name: 'bound', type: 'int'}
    ],
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'nextDouble',
    args: [
    ],
    returnType: "double"
  },Clazz,false,false);
}