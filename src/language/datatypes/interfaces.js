
import { Clazz } from "../../classes/Clazz";
import { Type } from "../../classes/Type";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineInterfaces(){
  defineActionListener(Java.interfaces.ActionListener);
  defineComparable(Java.interfaces.Comparable);
  defineComparator(Java.interfaces.Comparator);
}

function defineActionListener(clazz){
  createMethod({
    name: "actionPerformed",
    args: [{name: "ev",type: "ActionEvent"}],
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
  // let c=new Clazz("T");
  // c.isGeneric=true;
  // m.typeParameters=[c];
  // m.params.parameters[0].type.baseType=c;
  // m.params.parameters[1].type.baseType=c;
}

