import { createMethod } from "../helper/createMethod";


export function defineObject(clazz){
  clazz.info="'Object' ist die grundlegende Klasse in Java: Jede andere Klasse ist eine Unterklasse von 'Object'.";
  createMethod({
    name: "serialize",
    info: "Wandelt das Objekt in einen String um, der anschließend per mit der deserialize-Methode wieder in ein Objekt umgewandelt werden kann.",
    returnType: 'String',
    isExtraFunction: true,
    jsName: "$object_serialize"
  },clazz,false,false);
  createMethod({
    name: "deserialize",
    info: "Erzeugt ein neues Objekt aus dem übergebenen String.",
    args: [{name: "serializedObject", type: "String", info: "Ein String, der aus der Serialisierung eines Objekts entstanden ist."}],
    returnType: 'Object',
    isExtraFunction: true,
    jsName: "$object_deserialize"
  },clazz,true,false);
  createMethod({
    name: "toString",
    info: "Liefert eine String-Repräsentation dieses Objekts.",
    returnType: 'String',
    isExtraFunction: true,
    jsName: "$object_toString"
  },clazz,false,false);
}