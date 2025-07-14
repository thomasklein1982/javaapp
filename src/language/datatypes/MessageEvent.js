import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";
import { createAttribute } from "../helper/createAttribute";

export function defineMessageEvent(clazz){
  clazz.description="Ein MessageEvent wird erzeugt, wenn eine Nachricht über eine NetworkSession eingeht.";
  createAttribute({
    name: "sender",
    info: "Der Name des Clients, der dir die Nachricht sendet oder null, wenn die Nachricht vom Server kommt.",
    type: 'String'
  },clazz,false,false);
  createAttribute({
    name: "message",
    info: "Der Inhalt der Nachricht.",
    type: 'String'
  },clazz,false,false);
  createAttribute({
    name: "time",
    info: "Der Zeitpunkt, zu dem die Nachricht gesendet wurde.",
    type: 'int'
  },clazz,false,false);
  createAttribute({
    name: "header",
    info: "Zusätzliche Header-Informationen, die mitgesendet wurden.",
    type: 'String'
  },clazz,false,false);
}