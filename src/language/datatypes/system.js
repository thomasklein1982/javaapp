import { createAttribute } from "../helper/createAttribute";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineSystem(clazz){
  clazz.description="Die System-Klasse enthält statische Objekte und Methoden zur Kommunikation mit dem Betriebssystem bzw. dem Browser, in dem die App läuft."
  createAttribute({
    name: "out",
    info: "Der Standard-Printstream des Systems.",
    type: 'PrintStream'
  },clazz,true,false,Java);
  createAttribute({
    name: "in",
    info: "Der Standard-Inputstream des Systems.",
    type: 'InputStream'
  },clazz,true,false,Java);
  createAttribute({
    name: "storage",
    info: "Ein Objekt, das das Speichern und Laden von Dateien und Daten erlaubt.",
    type: 'Storage'
  },clazz,true,false,Java);
  createMethod({
    name: "console",
    args: [],
    returnType: "Console"
  },clazz,true,false);
  createAttribute({
    name: "time",
    info: "Ein Objekt zum Abrufen der Zeit und zum Starten eines Timers.",
    type: 'Time'
  },clazz,true,false,Java);

  createMethod({
    name: "isMousePressed",
    args: [],
    returnType: "boolean"
  },clazz,true,false);

  createMethod({
    name: "isKeyPressed",
    args: [{name: "key", type: "String"}],
    returnType: "boolean"
  },clazz,true,false);

  createMethod({
    name: "alert",
    args: [{name: "text", type: "String"}]
  },clazz,true,false);

  createMethod({
    name: "prompt",
    args: [{name: "text", type: "String"}, {name: "defaultValue", type: "String", optional: true}],
    returnType: "String"
  },clazz,true,false);

  createMethod({
    name: "confirm",
    args: [{name: "text", type: "String"}, {name: "defaultValue", type: "String", optional: true}],
    returnType: "boolean"
  },clazz,true,false);

  createMethod({
    name: "toast",
    args: [{name: 'text', type: 'String', info: 'Der Text, der angezeigt werden soll.'}, {name: 'position', type: 'String', info: 'Eine Angabe aus bis zu 2 Woertern, die bestimmen, wo der Text erscheinen soll. Moegliche Woerter: <code>"left"</code>, <code>"center"</code>, <code>"right"</code> und <code>"top"</code>, <code>"middle"</code>, <code>"bottom"</code>.'}, {name: 'duration', type: 'int', info: 'Optional: Die Dauer der Anzeige in Millisekunden.', optional: true}]
  },clazz,true,false);

  
}