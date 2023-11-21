import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineDatabaseClazzes(Java){
  defineRecord(Java.datatypes.Record,Java);
  defineDatabase(Java.datatypes.Database,Java);
}

function defineRecord(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'label'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  createMethod({
    name: "get",
    info: "Liefert einen bestimmten Wert des Datensatzes zurück.",
    returnType: 'String',
    args: [
      {name: "attribute", type: "String", info: "Der Name des abgefragten Attributs."}
    ],
  },Clazz,false,false,Java);
}

function defineDatabase(Clazz,Java){
  createConstructor ({
    args: [
    ]
  },Clazz,Java);
  createMethod({
    name: "sql",
    info: "Wendet einen SQL-Befehl auf die Datenbank an und liefert eine Ergebnis-Relation zurück.",
    returnType: {
      baseType: 'Record',
      dimension: 1
    },
    args: [
      {name: "sqlcommand", type: "String", info: "Der SQL-Befehl."}
    ],
  },Clazz,false,false,Java);
  createMethod({
    name: "areResultsEqual",
    info: "Prüft, ob die Ergebnisse zweier Abfragen identisch sind. Dabei kommt es auf die Reihenfolge der Datensätze an.",
    returnType: 'boolean',
    args: [
      {name: "array1", type: {baseType: "Record", dimension: 1}, info: "Das erste Array, das verglichen werden soll."},
      {name: "array2", type: {baseType: "Record", dimension: 1}, info: "Das zweite Array, das verglichen werden soll."}
    ],
  },Clazz,false,false,Java);
  createMethod({
    name: "areResultsEqualIgnoreOrder",
    info: "Prüft, ob die Ergebnisse zweier Abfragen identisch sind. Dabei kommt es nicht auf die Reihenfolge der Datensätze an.",
    returnType: 'boolean',
    args: [
      {name: "array1", type: {baseType: "Record", dimension: 1}, info: "Das erste Array, das verglichen werden soll."},
      {name: "array2", type: {baseType: "Record", dimension: 1}, info: "Das zweite Array, das verglichen werden soll."}
    ],
  },Clazz,false,false,Java);
}

