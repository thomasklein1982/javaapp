import { createMethod } from "../helper/createMethod";

export function defineString(StringClazz,Java){
  StringClazz.name="String";
  createMethod({
    name: "length",
    info: "Liefert die Anzahl der Zeichen des Strings zurück.",
    returnType: 'int',
    jsName: "len"
  },StringClazz,false,false,Java);
  createMethod({
    name: "indexOf",
    args: [{name: "search",type: "String"}],
    info: "Liefert die (erste) Position des gesuchten Strings innerhalb dieses Strings zurück oder -1, wenn der gesuchte String nicht vorkommt.",
    returnType: 'int'
  },StringClazz,false,false,Java);
  createMethod({
    name: "lastIndexOf",
    args: [{name: "search",type: "String"}],
    info: "Liefert die letzte Position des gesuchten Strings innerhalb dieses Strings zurück oder -1, wenn der gesuchte String nicht vorkommt.",
    returnType: 'int'
  },StringClazz,false,false,Java);
  createMethod({
    name: "charAt",
    args: [{name: "index",type: "int"}],
    info: "Liefert das Zeichen an der angegebenen Stelle zurück.",
    returnType: 'String',
    jsName: "charAt"
  },StringClazz,false,false,Java);
  createMethod({
    name: "codePointAt",
    args: [{name: "index",type: "int"}],
    info: "Liefert den Zahlencode des Zeichens an der angegebenen Position zurück.",
    returnType: 'int'
  },StringClazz,false,false,Java);
  createMethod({
    name: "substring",
    args: [{name: "index1",type: "int"}, {name: "index2", type: "int", optional: true}],
    info: "Liefert einen Teilstring zurück und zwar ab der Position index1. Wenn der zweite Index angegeben ist, ist dies die Position des ersten Zeichens, das NICHT mehr mit ausgeschnitten wird.",
    returnType: 'String'
  },StringClazz,false,false,Java);
  createMethod({
    name: "replaceAll",
    isExtraFunction: true,
    args: [{name: "search",type: "String"}, {name: "replacement", type: "String"}],
    info: "Ersetzt alle Vorkommnisse des Suchstrings durch den Replacement-String und liefert das Ergebnis zurück.",
    returnType: 'String',
    jsName: "$StringReplaceAll",
  },StringClazz,false,false,Java);
  createMethod({
    name: "compareTo",
    isExtraFunction: true,
    args: [{name: "string2",type: "String"}],
    info: "Vergleicht diesen String mit dem angegebenen String. Ein Ergebnis von 0 sagt, dass die beiden Strings identisch sind, ein Ergebnis kleiner als 0, dass der String kleiner ist als der angegebene String und ein Ergebnis größer als 0, dass der String größer ist als der angegebene String.",
    returnType: 'String',
    jsName: "$StringCompareTo",
  },StringClazz,false,false,Java);
  createMethod({
    name: "compareToIgnoreCase",
    isExtraFunction: true,
    args: [{name: "string2",type: "String"}],
    info: "Vergleicht diesen String mit dem angegebenen String ohne Beachtung der Groß-/Kleinschreibung. Ein Ergebnis von 0 sagt, dass die beiden Strings identisch sind, ein Ergebnis kleiner als 0, dass der String kleiner ist als der angegebene String und ein Ergebnis größer als 0, dass der String größer ist als der angegebene String.",
    returnType: 'String',
    jsName: "$StringCompareToIgnoreCase",
  },StringClazz,false,false,Java);
  createMethod({
    name: "contains",
    isExtraFunction: true,
    args: [{name: "string2",type: "String"}],
    info: "Findet heraus, ob der String einen anderen String enthält oder nicht.",
    jsName: "$StringContains",
    returnType: 'boolean'
  },StringClazz,false,false,Java);
  createMethod({
    name: "equals",
    isExtraFunction: true,
    args: [{name: "string2",type: "String"}],
    info: "Findet heraus, ob die beiden Strings gleich sind.",
    jsName: "$StringEquals",
    returnType: 'boolean'
  },StringClazz,false,false,Java);
  createMethod({
    name: "equalsIgnoreCase",
    isExtraFunction: true,
    args: [{name: "string2",type: "String"}],
    info: "Findet heraus, ob die beiden Strings gleich sind, wobei Groß-/Kleinschreibung keine Rolle spielt.",
    jsName: "$StringEquals",
    returnType: 'boolean'
  },StringClazz,false,false,Java);
  createMethod({
    name: "endsWith",
    args: [{name: "string2",type: "String"}],
    info: "Findet heraus, ob dieser String mit dem angegebenen String endet.",
    returnType: 'boolean'
  },StringClazz,false,false,Java);
  createMethod({
    name: "startsWith",
    args: [{name: "string2",type: "String"}],
    info: "Findet heraus, ob dieser String mit dem angegebenen String beginnt.",
    returnType: 'boolean'
  },StringClazz,false,false,Java);
  createMethod({
    name: "endsWith",
    args: [{name: "string2",type: "String"}],
    info: "Findet heraus, ob dieser String mit dem angegebenen String endet.",
    returnType: 'boolean'
  },StringClazz,false,false,Java);
  createMethod({
    name: "toLowerCase",
    info: "Liefert eine Kopie des Strings zurück, in dem alle Zeichen Kleinbuchstaben sind.",
    returnType: 'String'
  },StringClazz,false,false,Java);
  createMethod({
    name: "toUpperCase",
    info: "Liefert eine Kopie des Strings zurück, in dem alle Zeichen Großbuchstaben sind.",
    returnType: 'String'
  },StringClazz,false,false,Java);
  createMethod({
    name: "trim",
    info: "Liefert eine Kopie des Strings zurück, bei dem aller Whitepace am Anfang und am Ende entfernt wurden.",
    returnType: 'String'
  },StringClazz,false,false,Java);
  createMethod({
    name: "split",
    isExtraFunction: true,
    jsName: "$StringSplit",
    args: [{name: "regexp", type: "String"}, {name: "limit", optional: true, type: "int"}],
    info: "Teilt den String in mehrere Teile auf und zwar anhand des angegebenen regulären Ausdrucks. Liefert ein String-Array zurück.",
    returnType: {
      baseType: 'String',
      dimension: 1
    }
  },StringClazz,false,false,Java);
  createMethod({
    name: "format",
    isExtraFunction: true,
    args: [{name: '"%.2f"',type: "String", info: "Beschreibung des Formats."}, {name: "number", type: "String", info: "Objekt, das formatiert wird."}],
    info: "Formatiert das Objekt.",
    returnType: 'String',
    jsName: "$StringFormat"
  },StringClazz,true,false,Java);
  createMethod({
    name: "matches",
    isExtraFunction: true,
    args: [{name: "regexp",type: "String"}],
    info: "Prüft, ob der String den gegebenen regulären Ausdruck erfüllt.",
    returnType: 'boolean',
    jsName: "$StringMatches"
  },StringClazz,false,false,Java);
  createMethod({
    name: "applyRegExp",
    isExtraFunction: true,
    args: [{name: "regexp",type: "String"}, {name: "flags", type: "String", optional: true}],
    info: "Wendet den regulären Ausdruck auf diesen String an. Liefert null zurück, wenn der reguläre Ausdruck nicht passt. Ansonsten wird ein Array zurückgegeben, das an erster Stelle den kompletten Match enthält und an den Folgestellen die extrahierten Teil-Strings.",
    returnType: {
      baseType: 'String',
      dimension: 1
    },
    jsName: "$StringApplyRegExp"
  },StringClazz,false,false,Java);
  
}
