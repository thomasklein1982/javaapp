import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";
import { defineGenericClazz } from "./GenericClazz";

export function defineFile(clazz){
  clazz.jsName="$File";
  clazz.description=`Die File-Klasse dient dazu, Dateien zu erzeugen, auf dem Gerät des Users zu speichern oder vom Gerät des Users hochzuladen.
  <h3>Beispiel 1: Text-Datei erzeugen und herunterladen</h3>
<pre><code>File f = new File( "Text.txt" );
f.setContentAsString("Dies ist der Inhalt der Datei.\\nNach einem Zeilenumbruch geht es weiter.");
f.download();
</code></pre>`;
  createConstructor({
    args: [
      {
        name: "name",
        type: "String",
        info: "Name der Datei, einschließlich Endung (z. B. '.txt')"
      }
    ],
    info: "Erzeugt eine neue, leere Datei."
  },clazz);

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
  createMethod({
    name: "getContentAsDataURL",
    isExtraFunction: true,
    args: [],
    info: "Liefert den Inhalt dieser Datei als DataURL zurück.",
    returnType: 'String',
    jsName: "$getFileContent",
  },clazz,false,false);
  createMethod({
    name: "setContentAsString",
    isExtraFunction: true,
    args: [{name: "text", type: "String", info: "Der neue Inhalt der Datei."}],
    info: "Legt den Inhalt dieser Datei als String fest.",
    jsName: "$setFileContentAsString",
  },clazz,false,false);
  createMethod({
    name: "setContentAsDataURL",
    isExtraFunction: true,
    args: [{name: "dataurl", type: "String", info: "Der neue Inhalt der Datei als DataURL."}],
    info: "Legt den Inhalt dieser Datei als DataURL fest.",
    jsName: "$setFileContent",
  },clazz,false,false);
  createMethod({
    name: "download",
    isExtraFunction: true,
    args: [],
    info: 'Lädt die Datei herunter, sodass der*die User*in die Datei auf seinem*ihrem Gerät speichern können.',
    jsName: "$downloadFile",
  },clazz,false,false);
  createMethod({
    name: "upload",
    isExtraFunction: true,
    returnType: "File",
    args: [],
    info: 'Erlaubt es dem User eine Datei von seinem:ihrem Gerät hochzuladen und liefert die Datei zurück.',
    jsName: "$upload",
  },clazz,true,false);
}