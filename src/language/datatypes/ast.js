import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineAST(Clazz,Java){
  // createAttribute({
  //   name: "name",
  //   type: "String"
  // },Clazz,false,"public");
  // createAttribute({
  //   name: "start",
  //   type: "int"
  // },Clazz,false,"public");
  // createAttribute({
  //   name: "end",
  //   type: "int"
  // },Clazz,false,"public");
  // createAttribute({
  //   name: "line",
  //   type: "int"
  // },Clazz,false,"public");
  createMethod({
    name: 'name',
    args: [],
    returnType: "String",
    info: "Liefert den Namen des Knoten zurück.",
    jsName: "$AST_getName",
    isExtraFunction: true
  },Clazz,false,false);
  createMethod({
    name: 'start',
    args: [],
    returnType: "int",
    info: "Liefert den Start-Index des Knoten zurück.",
    jsName: "$AST_getStart",
    isExtraFunction: true
  },Clazz,false,false);
  createMethod({
    name: 'end',
    args: [],
    returnType: "int",
    info: "Liefert den End-Index des Knoten zurück.",
    jsName: "$AST_getEnd",
    isExtraFunction: true
  },Clazz,false,false);
  createMethod({
    name: 'line',
    args: [],
    returnType: "int",
    info: "Liefert den Zeilennummer des Knoten zurück.",
    jsName: "$AST_getLine",
    isExtraFunction: true
  },Clazz,false,false);
  createMethod({
    name: 'getChild',
    args: [
      {name: 'index', type: 'int'}
    ],
    returnType: "AST",
    info: "Liefert das n-te Kind zurück.",
    jsName: "$AST_getChild",
    isExtraFunction: true
  },Clazz,false,false);
  
}