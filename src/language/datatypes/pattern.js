import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";

export function definePattern(clazz){
  clazz.name="Pattern";
  createAttribute({
    name: "CASE_INSENSITIVITY",
    type: "int"
  },clazz,true);
  createAttribute({
    name: "MULTI_LINE",
    type: "int"
  },clazz,true);
  createAttribute({
    name: "DOT_ALL",
    type: "int"
  },clazz,true);
  createMethod({
    name: "compile",
    info: "Erzeugt ein Pattern-Objekt zu dem gegebenen regulären Ausdruck.",
    args: [{name: "regex", type: "String", info: "Der reguläre Ausdruck."}, {name: "flags", type: "int", info: "Zusatz-Flags für den regulären Ausdruck.", optional: true}],
    returnType: 'Pattern'
  },clazz,true,false);
  createMethod({
    name: "matcher",
    info: "Liefert ein Matcher-Objekt zu der zu durchsuchenden Zeichenkette zurück.",
    args: [{name: "input", type: "String", info: "Die Zeichenkette, die durchsucht wird."}],
    returnType: 'Matcher'
  },clazz,false,false);
  
  
}
