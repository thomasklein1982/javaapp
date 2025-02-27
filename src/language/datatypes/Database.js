import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineDatabaseClazzes(Java){
  defineDatabase(Java.datatypes.Database,Java);
}

// function defineRecord(Clazz){
//   //Clazz.superClazz=Java.clazzes.JSON;
//   createConstructor ({
//     args: [
//       {type: 'String', name: 'label'}, {type: 'double', name: 'x'}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
//     ],
//   },Clazz);
//   createMethod({
//     name: "get",
//     info: "Liefert einen bestimmten Wert des Datensatzes zurück.",
//     returnType: 'String',
//     args: [
//       {name: "attribute", type: "String", info: "Der Name des abgefragten Attributs."}
//     ],
//   },Clazz,false,false);
// }

function defineDatabase(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'name', info: 'Name der Datenbank', optional: true}
    ],
    info: 'Erzeugt ein neues Database-Objekt, das eine Verbindung zur Datenbank herstellt.'
  },Clazz,Java);
  createMethod({
    name: "sql",
    info: "Wendet einen SQL-Befehl auf die Datenbank an und liefert eine Ergebnis-Relation zurück.",
    returnType: {
      baseType: 'JSON',
      dimension: 1
    },
    args: [
      {name: "sqlcommand", type: "String", info: "Der SQL-Befehl."}
    ],
  },Clazz,false,false,Java);
  createMethod({
    name: "sqlError",
    info: "Wendet einen SQL-Befehl auf die Datenbank an.\nWenn ein Fehler auftritt wird die Fehlermeldung zurückgegeben, ansonsten wird null zurückgegeben.",
    returnType: "String",
    args: [
      {name: "sqlcommand", type: "String", info: "Der SQL-Befehl."}
    ],
  },Clazz,false,false,Java);
  createMethod({
    name: "isEmpty",
    info: "Prüft, ob die Datenbank Tabellen enthält.",
    returnType: 'boolean',
  },Clazz,false,false,Java);
  createMethod({
    name: "areResultsEqual",
    info: "Prüft, ob die Ergebnisse zweier Abfragen identisch sind. Dabei kommt es auf die Reihenfolge der Datensätze an.",
    returnType: 'boolean',
    args: [
      {name: "array1", type: {baseType: "JSON", dimension: 1}, info: "Das erste Array, das verglichen werden soll."},
      {name: "array2", type: {baseType: "JSON", dimension: 1}, info: "Das zweite Array, das verglichen werden soll."}
    ],
  },Clazz,false,false,Java);
  createMethod({
    name: "areResultsEqualIgnoreOrder",
    info: "Prüft, ob die Ergebnisse zweier Abfragen identisch sind. Dabei kommt es nicht auf die Reihenfolge der Datensätze an.",
    returnType: 'boolean',
    args: [
      {name: "array1", type: {baseType: "JSON", dimension: 1}, info: "Das erste Array, das verglichen werden soll."},
      {name: "array2", type: {baseType: "JSON", dimension: 1}, info: "Das zweite Array, das verglichen werden soll."}
    ],
  },Clazz,false,false,Java);
  createMethod({
    name: "save",
    info: "Speichert die Datenbank im Speicher des Browsers (in der IndexedDB).",
  },Clazz,false,false,Java);
  createMethod({
    name: "load",
    info: "Lädt die Datenbank aus dem Speicher des Browsers (aus der IndexedDB).",
    returnType: "boolean"
  },Clazz,false,false,Java);
  createMethod({
    name: "getVersion",
    info: "Liefert die Versionsnummer der Datenbank zurück.",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: "setVersion",
    info: "Legt die Versionsnummer der Datenbank fest.",
    args: [
      {name: "version", type: "int"}
    ]
  },Clazz,false,false);
  createMethod({
    name: "exportTableDataAsCSVString",
    info: "Exportiert die Tabelle als CSV-String (comma separated values).",
    args: [
      {name: "tablename", type: "String"},
      {name: "separator", type: "String", optional:true}
    ],
    returnType: "String"
  },Clazz,false,false,Java);
  createMethod({
    name: "importTableDataFromCSVString",
    info: "Importiert die Daten einer Tabelle im CSV-Format.",
    args: [
      {name: "tablename", type: "String"},
      {name: "s", type: "String"},
      {name: "separator", type: "String", optional: true}
    ]
  },Clazz,false,false);
}

