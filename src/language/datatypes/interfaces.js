
import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineInterfaces(){
  defineActionListener(Java.interfaces.ActionListener);
}

function defineActionListener(clazz){
  createMethod({
    name: "onAction",
    args: [{name: "trigger",type: "JComponent"}],
  },clazz,false,false);
}