import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";

export function defineActionEvent(clazz){
  createMethod({
    name: "getSource",
    args: [],
    info: "Liefert das Objekt, das das Event ausgelöst hat.",
    returnType: 'Object'
  },clazz,false,false);
  createMethod({
    name: "getWhen",
    args: [],
    info: "Liefert die Zeit, zu der das Event ausgelöst wurde.",
    returnType: 'int'
  },clazz,false,false);
  createMethod({
    name: "getActionCommand",
    args: [],
    info: "Liefert das ActionCommand, das zu diesem Event gehört.",
    returnType: 'String'
  },clazz,false,false);
}