import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";


export function defineMatrix(clazz){
  clazz.name="Matrix";
  createMethod({
    args: [
      {name: "rows", type: "int", info: "Anzahl der Zeilen"},
      {name: "cols", type: "int", info: "Anzahl der Spalten"}
    ]
  },clazz,false,true);
  createMethod({
    name: "asString",
    args: [
      {name: "stellen", type: "int", info: "Anzahl Nachkommastellen", optional: true}
    ],
    returnType: "String",
    info: "Liefert eine String-Repräsentation der Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "set",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"},
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"},
      {name: "value", type: "double", info: "Neuer Wert an dieser Stelle"}
    ],
    info: "Legt den Eintrag in der r-ten Zeile und der c-ten Spalte fest."
  },clazz,false,false);
  createMethod({
    name: "get",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"},
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"}
    ],
    returnType: "double",
    info: "Gibt den Wert des Eintrags in der r-ten Zeile und der c-ten Spalte zurück."
  },clazz,false,false);
  createMethod({
    name: "getRowCount",
    args: [],
    returnType: "int",
    info: "Gibt die Anzahl der Zeilen der Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "getColCount",
    args: [],
    returnType: "int",
    info: "Gibt die Anzahl der Spalten der Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "setColumn",
    args: [
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"},
      {name: "values", type: {baseType: "double", dimension: 1}, info: "Die neuen Werte für die Spalte."}
    ],
    info: "Legt die Werte der c-ten Spalte fest.",
    returnType: "Matrix"
  },clazz,false,false);
  createMethod({
    name: "getColumn",
    args: [
      {name: "c", type: "int", info: "Spaltennummer (beginnt mit 1)"}
    ],
    returnType: {
      baseType: "double",
      dimension: 1
    },
    info: "Gibt die c-te Spalte zurück."
  },clazz,false,false);
  createMethod({
    name: "setRow",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"},
      {name: "values", type: {baseType: "double", dimension: 1}, info: "Die neuen Werte für die Zeile."}
    ],
    info: "Legt die Werte der r-ten Zeile fest.",
    returnType: "Matrix"
  },clazz,false,false);
  createMethod({
    name: "getRow",
    args: [
      {name: "r", type: "int", info: "Zeilennummer (beginnt mit 1)"}
    ],
    returnType: {
      baseType: "double",
      dimension: 1
    },
    info: "Gibt die r-te Zeile zurück."
  },clazz,false,false);
  createMethod({
    name: "setFromMatrix",
    args: [
      {name: "m", type: "Matrix", info: "Eine andere Matrix mit denselben Dimensionen"}
    ],
    info: "Kopiert die Einträge der Matrix in diese Matrix.",
    returnType: "Matrix"
  },clazz,false,false);
  createMethod({
    name: "setToZero",
    args: [
      
    ],
    info: "Setzt alle Einträge der Matrix auf 0.",
    returnType: "Matrix"
  },clazz,false,false);
  createMethod({
    name: "multiply",
    args: [
      {name: "m", type: "Matrix", info: "Die Matrix, mit der multipliziert wird. Muss so viele Zeilen haben wie diese Matrix Spalten hat."}
    ],
    returnType: "Matrix",
    info: "Multipliziert diese Matrix mit der Matrix m und gibt die Ergebnis-Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "multiplyVector",
    args: [
      {name: "v", type: "Vector", info: "Der Vektor, mit dem multipliziert wird. Muss so viele Zeilen haben wie diese Matrix Spalten hat."}
    ],
    returnType: "Vector",
    info: "Multipliziert diese Matrix mit dem Vektor v und gibt den Ergebnis-Vektor zurück."
  },clazz,false,false);
  createMethod({
    name: "add",
    args: [
      {name: "m", type: "Matrix", info: "Die Matrix, die addiert wird. Muss diesen Dimensionen wie diese Matrix haben."}
    ],
    returnType: "Matrix",
    info: "Addiert zu dieser Matrix die Matrix m und gibt die Ergebnis-Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "sub",
    args: [
      {name: "m", type: "Matrix", info: "Die Matrix, die subtrahiert wird. Muss diesen Dimensionen wie diese Matrix haben."}
    ],
    returnType: "Matrix",
    info: "Subtrahiert von dieser Matrix die Matrix m und gibt die Ergebnis-Matrix zurück."
  },clazz,false,false);
  createMethod({
    name: "scale",
    args: [
      {name: "s", type: "double", info: "Der Faktor, mit dem die Matrix skaliert wird."}
    ],
    returnType: "Matrix",
    info: "Multipliziert alle Einträge dieser Matrix mit s."
  },clazz,false,false);
  createMethod({
    name: "lengthSquared",
    args: [
    ],
    returnType: "double",
    info: "Liefert die quadrierte Länge der Matrix zurück (d.h., die Summe aller Quadrate der Einträge)."
  },clazz,false,false);
  createMethod({
    name: "length",
    args: [
    ],
    returnType: "double",
    info: "Liefert die Länge der Matrix zurück (d.h., die Wurzel aus der Summe aller Quadrate der Einträge)."
  },clazz,false,false);
  createMethod({
    name: "getCopy",
    args: [
    ],
    returnType: "Matrix",
    info: "Liefert eine neue Matrix mit den gleichen Einträgen zurück."
  },clazz,false,false);
}

export function defineVector(clazz){
  clazz.name="Vector";
  createMethod({
    args: [
      {name: "size", type: "int", info: "Anzahl der Einträge"}
    ]
  },clazz,false,true);
  createMethod({
    name: "setToZero",
    args: [
    ],
    returnType: "Vector",
    info: "Setzt alle Einträge des Vektors auf 0."
  },clazz,false,false);
  createMethod({
    name: "asString",
    args: [
      {name: "stellen", type: "int", info: "Anzahl Nachkommastellen"}
    ],
    returnType: "String",
    info: "Liefert eine String-Repräsentation des Vektors zurück."
  },clazz,false,false);
  createMethod({
    name: "set",
    args: [
      {name: "pos", type: "int", info: "Position im Vektor (beginnt mit 1)"},
      {name: "value", type: "double", info: "Neuer Wert an dieser Stelle"}
    ],
    returnType: "Vector",
    info: "Legt den Eintrag an der Position pos fest."
  },clazz,false,false);
  createMethod({
    name: "get",
    args: [
      {name: "pos", type: "int", info: "Position im Vektor (beginnt mit 1)"}
    ],
    returnType: "double",
    info: "Gibt den Wert des Eintrags an der Position pos zurück."
  },clazz,false,false);
  createMethod({
    name: "getAsArray",
    args: [],
    returnType: {baseType: "double", dimension: 1},
    info: "Gibt die Einträge als double-Array zurück."
  },clazz,false,false);
  createMethod({
    name: "setFromArray",
    args: [{
      name: "array", type: {baseType: "double", dimension: 1}, info: "Das Array, das die Einträge enthält."
    }],
    info: "Legt die Einträge des Vektors fest.",
    returnType: "Vector"
  },clazz,false,false);
  createMethod({
    name: "setFromVector",
    args: [{
      name: "v", type: "Vector", info: "Ein Vector, dessen Werte übernommen werden sollen."
    }],
    info: "Legt die Einträge des Vektors fest.",
    returnType: "Vector"
  },clazz,false,false);
  createMethod({
    name: "add",
    args: [
      {name: "v", type: "Vector", info: "Der Vektor, der addiert wird. Muss dieselbe Dimension wie dieser Vektor haben."}
    ],
    returnType: "Vector",
    info: "Addiert zu diesem Vektor den Vektor v und gibt den Ergebnis-Vektor zurück."
  },clazz,false,false);
  createMethod({
    name: "sub",
    args: [
      {name: "v", type: "Vector", info: "Der Vektor, der subtrahiert wird. Muss dieselbe Dimension wie dieser Vektor haben."}
    ],
    returnType: "Vector",
    info: "Subtrahiert von diesem Vektor den Vektor v und gibt den Ergebnis-Vektor zurück."
  },clazz,false,false);
  createMethod({
    name: "lengthSquared",
    args: [
    ],
    returnType: "double",
    info: "Liefert die quadrierte euklidische Länge des Vektors zurück (d.h., die Summe aller Quadrate der Einträge)."
  },clazz,false,false);
  createMethod({
    name: "length",
    args: [
    ],
    returnType: "double",
    info: "Liefert die euklidische Länge des Vektors zurück (d.h., die Wurzel aus der Summe aller Quadrate der Einträge)."
  },clazz,false,false);
  createMethod({
    name: "getSize",
    args: [
    ],
    returnType: "int",
    info: "Liefert die Anzahl der Komponenten des Vektors."
  },clazz,false,false);
  createMethod({
    name: "scale",
    args: [
      {name: "s", type: "double", info: "Der Faktor, mit dem der Vektor skaliert wird."}
    ],
    returnType: "Vector",
    info: "Mutipliziert alle Einträge dieses Vektors mit s."
  },clazz,false,false);
  createMethod({
    name: "mul",
    args: [
      {name: "v", type: "Vector", info: "Ein Vektor, dessen Komponenten mit den Komponenten dieses Vektors multipliziert werden."}
    ],
    returnType: "Vector",
    info: "Bildet das komponentenweise Produkt der beiden Vektoren."
  },clazz,false,false);
  createMethod({
    name: "scalarProduct",
    args: [
      {name: "v", type: "Vector", info: "Der Vektor, mit dem das Skalarpdodukt gebildet wird."}
    ],
    returnType: "double",
    info: "Berechnet das Skalarprodukt der beiden Vektoren."
  },clazz,false,false);
  createMethod({
    name: "getMaxComponent",
    args: [],
    returnType: "int",
    info: "Gibt die Position des größten Eintrags des Vektors zurück."
  },clazz,false,false);
  createMethod({
    name: "getMinComponent",
    args: [],
    returnType: "int",
    info: "Gibt die Position des kleinsten Eintrags des Vektors zurück."
  },clazz,false,false);
  createMethod({
    name: "getMax",
    args: [],
    returnType: "double",
    info: "Gibt den größten Eintrag des Vektors zurück."
  },clazz,false,false);
  createMethod({
    name: "getMin",
    args: [],
    returnType: "double",
    info: "Gibt den kleinsten Eintrags des Vektors zurück."
  },clazz,false,false);
  // let T=new Clazz("T");
  // T.cannotBeInstantiated=true;
  // T.isGeneric=true;
  // T.genericIndex=0;
  // let R=new Clazz("R");
  // R.cannotBeInstantiated=true;
  // R.isGeneric=true;
  // R.genericIndex=1;
  // clazz.typeParameters=[T,R];
  // let typeT=new Type(T,0);
  // let typeR=new Type(R,0);
  
  createMethod({
    name: "applyFunction",
    args: [
      {name: "func", default: "(x)->{ return 0; }", type: "RealFunction"}
    ],
    returnType: "Vector",
    info: "Wendet die Funktion auf jeden Eintrag des Vektors an und gibt das Ergebnis zurück."
  },clazz,false,false);
  createMethod({
    name: "applyMatrix",
    args: [
      {name: "m", type: "Matrix"}
    ],
    returnType: "Vector",
    info: "Wendet die Matrix auf den Vektor an und gibt den veränderten Vektor zurück."
  },clazz,false,false);
  createMethod({
    name: "copy",
    args: [
    ],
    returnType: "Vector",
    info: "Liefert einen neuen Vektor mit den gleichen Einträgen zurück."
  },clazz,false,false);
}