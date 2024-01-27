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
    returnType: "int"
  },Clazz,true,false,Java);
}