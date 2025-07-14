import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineStorage(clazz){
  createConstructor({
    args: [
      {
        name: "name",
        type: "String",
        info: "Der Name des Speichers."
      },
    ],
    info: "Erzeugt einen neuen Speicher oder stellt die Verbindung zu einem bestehenden Speicher her."
  },clazz);
  createMethod({
    name: "save",
    args: [
      {name: "key", type: "String", info: "Schlüssel, unter dem der String gespeichert wird."},
      {name: "value", type: "String", info: "String, der gespeichert wird."}
    ],
    info: "Speichert einen String unter einem bestimmten key im lokalen Speicher des Browsers."
  },clazz,false,false);
  // createMethod({
  //   name: "saveObject",
  //   args: [
  //     {name: "key", type: "String", info: "Wort, unter dem dieses Datum gespeichert wird."},
  //     {name: "value", type: "Object", info: "Objekt, das gespeichert wird."}
  //   ],
  //   info: "Speichert ein Objekt unter einem bestimmten key."
  // },clazz,false,false);
  createMethod({
    name: "load",
    args: [
      {name: "key", type: "String", info: "Schlüssel, unter dem der String gespeichert wurde."}
    ],
    returnType: "String",
    info: "Lädt einen gespeicherten String und liefert diesen zurück, falls er existiert. Ansonsten wird null zurückgegeben."
  },clazz,false,false);
  // createMethod({
  //   name: "loadObject",
  //   args: [
  //     {name: "key", type: "String", info: "Schlüssel, unter dem das Datum gespeichert wurde."}
  //   ],
  //   returnType: "JSON",
  //   info: "Liefert ein gespeichertes Objekt als JSON (JavaScript-Object-Notation) zurück."
  // },clazz,false,false);
  createMethod({
    name: "remove",
    args: [
      {name: "key", type: "String", info: "Schlüssel, der gelöscht werden soll."}
    ],
    info: "Löscht einen Eintrag aus diesem Speicher."
  },clazz,false,false);
  createMethod({
    name: "removeAll",
    args: [
      
    ],
    info: "Löscht alle Einträge aus diesem Speicher."
  },clazz,false,false);
  createMethod({
    name: "getKeys",
    args: [
      
    ],
    returnType: {
      baseType: "String",
      dimension: 1
    },
    info: "Liefert ein Array mit allen verwendeten Schlüsseln dieses Speichers zurück."
  },clazz,false,false);
  createMethod({
    name: "hasKey",
    args: [
      {name: "key",type: "String"}
    ],
    returnType: "boolean",
    info: "Checkt, ob es den Key gibt."
  },clazz,false,false);
  createMethod({
    name: "deleteStorage",
    args: [{name: "name", type: "String", info: "Name des Speichers, der gelöscht werden soll."}],
    info: "Löscht einen Speicher von der Festplatte."
  },clazz,true,false);
  createMethod({
    name: "getStorageNames",
    args: [],
    returnType: {
      baseType: "String",
      dimension: 1
    },
    info: "Liefert die Namen aller verwendeten Speicher zurück."
  },clazz,true,false);
}