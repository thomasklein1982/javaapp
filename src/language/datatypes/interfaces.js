
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineInterfaces(){
  defineActionListener(Java.interfaces.ActionListener);
  defineComparable(Java.interfaces.Comparable);
  defineComparator(Java.interfaces.Comparator);
  defineRunnable(Java.interfaces.Runnable);
  defineRealFunction(Java.interfaces.RealFunction);
  defineMessageListener(Java.interfaces.MessageListener);
}

function defineRunnable(clazz){
  createMethod({
    name: "run",
    args: [],
  },clazz,false,false);
}

function defineActionListener(clazz){
  createMethod({
    name: "actionPerformed",
    args: [{name: "ev",type: "ActionEvent"}],
  },clazz,false,false);
}

function defineMessageListener(clazz){
  createMethod({
    name: "onMessage",
    args: [{name: "ev",type: "MessageEvent"}],
  },clazz,false,false);
}

function defineComparable(clazz){
  let m=createMethod({
    name: "compareTo",
    args: [{name: "a",type: "int"}],
    returnType: "int"
  },clazz,false,false);
  let c=new Clazz("T");
  c.isGeneric=true;
  m.typeParameters=[c];
  m.params.parameters[0].type.baseType=c;
}

function defineComparator(clazz){
  let T=new Clazz("T");
  T.cannotBeInstantiated=true;
  T.isGeneric=true;
  T.genericIndex=0;
  clazz.typeParameters=[T];
  let typeT=new Type(T,0);
  let m=createMethod({
    name: "compare",
    args: [{name: "a",type: typeT}, {name: "b",type: typeT}],
    returnType: "int"
  },clazz,false,false);
}

function defineRealFunction(clazz){
  let m=createMethod({
    name: "apply",
    args: [{name: "x",type: "double"}],
    returnType: "double"
  },clazz,false,false);
}

// function defineFunction(clazz){
//   let T=new Clazz("T");
//   T.cannotBeInstantiated=true;
//   T.isGeneric=true;
//   T.genericIndex=0;
//   let R=new Clazz("R");
//   R.cannotBeInstantiated=true;
//   R.isGeneric=true;
//   R.genericIndex=1;
//   clazz.typeParameters=[T,R];
//   let typeT=new Type(T,0);
//   let typeR=new Type(R,0);
//   let m=createMethod({
//     name: "apply",
//     args: [{name: "x",type: typeT}],
//     returnType: typeR
//   },clazz,false,false);
// }