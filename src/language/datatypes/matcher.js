import { createMethod } from "../helper/createMethod";
import { createAttribute } from "../helper/createAttribute";

export function defineMatcher(clazz){
  clazz.name="Matcher";
  createMethod({
    name: "groupCount",
    info: "Liefert die Anzahl der Capturing-Gruppen des regulären Ausdrucks zurück.",
    returnType: 'int'
  },clazz,false,false);
  createMethod({
    name: "start",
    info: "Liefert den Start-Index des aktuellen Matches zurück.",
    returnType: 'int'
  },clazz,false,false);
  createMethod({
    name: "end",
    info: "Liefert den Index des ersten Zeichens nach dem aktuellen Match zurück.",
    returnType: 'int'
  },clazz,false,false);
  createMethod({
    name: "matches",
    info: "Prüft, ob der reguläre Ausdruck auf den kompletten String passt oder nicht.",
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "find",
    args: [{name: "start", type: "int", info: "Die Position, ab der gesucht wird.", optional: true}],
    info: "Liefert zurück, ob ein Match gefunden wurde oder nicht.",
    returnType: 'boolean'
  },clazz,false,false);
  createMethod({
    name: "group",
    args: [{name: "group", type: "int", info: "Die Nummer der Gruppe, die zurückgegeben werden soll.", optional: true}],
    info: "Liefert die gematchte Gruppe zurück.",
    returnType: 'String'
  },clazz,false,false);

  createMethod({
    name: "reset",
    args: [{name: "input", type: "String", info: "Der neue Text, der durchsucht werden soll."}],
    info: "Setzt den Matcher zurück und legt einen neuen zu durchsuchenden Text fest.",
    returnType: null
  },clazz,false,false);
  
}
