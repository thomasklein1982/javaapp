import { createAttribute } from "../helper/createAttribute";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";
import { defineGenericClazz } from "./GenericClazz";

export function defineFile(clazz){
  createMethod({
    name: "getName",
    isExtraFunction: true,
    args: [],
    info: "Liefert den Namen dieser Datei zurück.",
    returnType: 'String',
    jsName: "$getFileName",
  },clazz,false,false);
  createMethod({
    name: "getContentAsString",
    isExtraFunction: true,
    args: [],
    info: "Liefert den Inhalt dieser Datei als String zurück.",
    returnType: 'String',
    jsName: "$getFileContentAsString",
  },clazz,false,false);
}