
import { Clazz } from "../../classes/Clazz";
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineInterfaces(){
  defineActionListener(Java.interfaces.ActionListener);
  defineComparable(Java.interfaces.Comparable);
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
    args: [{name: "a",type: "int"}, {name: "b",type: "int"}],
    returnType: "int"
  },clazz,false,false);
  let c=new Clazz("T");
  c.isGeneric=true;
  m.typeParameters=[c];
  m.params.parameters[0].type.baseType=c;
  m.params.parameters[1].type.baseType=c;
}

