import { createMethod } from "../helper/createMethod";
import { Java } from "../java";

export function defineReflectionAPI(){
  defineClass();
  defineMethod();
  defineField();
}

function defineClass(){
  let Clazz=Java.clazzes.Class;

  createMethod({
    name: "getDeclaredFields",
    args: [

    ],
    returnType: {
      baseType: "Field",
      dimension: 1
    }
  }, Clazz, false, false);
  createMethod({
    name: "getDeclaredField",
    args: [
      {
        name: "name",
        type: "String"
      }
    ],
    returnType: "Field"
  }, Clazz, false, false);
  createMethod({
    name: "getField",
    args: [
      {
        name: "name",
        type: "String"
      }
    ],
    returnType: "Field"
  }, Clazz, false, false);
  createMethod({
    name: "getFields",
    args: [
      {
        name: "name",
        type: "String"
      }
    ],
    returnType: {
      baseType: "Field",
      dimension: 1
    }
  }, Clazz, false, false);
}

function defineField(){
  let Field=Java.clazzes.Field;
}

function defineMethod(){
  let Method=Java.clazzes.Method;
}