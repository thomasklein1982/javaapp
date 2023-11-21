import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";
import { Java } from "../java";

export function defineHTMLElement(clazz){
  clazz.superClazz=Java.clazzes.JComponent;
}