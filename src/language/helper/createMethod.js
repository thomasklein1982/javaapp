import { Method } from "../../classes/Method";
import { Modifiers } from "../../classes/Modifiers";
import { Parameter, ParameterList } from "../../classes/Parameters";
import { Type } from "../../classes/Type";
import { Java } from "../java";

export function createMethod(data,clazz,isStatic,isConstructor){
  let m=new Method(clazz);
  if(isConstructor){
    m.name=clazz.name;
  }else{
    m.name=data.name;
  }
  let name=m.name;
  if(name==="toString"){
    name="$"+name;
  }
  clazz.methods[name]=m;
  m.comment=data.info;
  m.params=new ParameterList(m);
  let minCount=-1;
  if(data.args){
    m.params.reverseOrder=data.reverseArgsOrder;
    for(let j=0;j<data.args.length;j++){
      let a=data.args[j];
      // if(data.reverseArgsOrder){
      //   a=data.args[data.args.length-1-j];
      // }else{
      //   a=data.args[j];
      // }
      let p=new Parameter(m.params);
      p.optional=a.optional;
      let types;
      if(Array.isArray(a.type)){
        types=a.type;
      }else{
        types=[a.type];
      }
      for(let i=0;i<types.length;i++){
        let type=types[i];
        if(type instanceof Type){
        }else if(type.baseType){
          type=new Type(Java.datatypes[type.baseType],type.dimension);
        }else{
          type=new Type(Java.datatypes[type],0);
        }
        types[i]=type;
      }
      if(types.length===1){
        p.type=types[0];
      }else{
        p.type=types;
      }
      p.name=a.name;
      m.params.parameters.push(p);
      if(minCount<0){
        if(a.optional){
          minCount=j;
          m.params.minCount=minCount;
        }
      }
    }
  }
  if(data.jsName){
    m.jsName=data.jsName;
  }
  if(data.isExtraFunction){
    m.isExtraFunction=true;
  }
  if(data.returnType){
    if(data.returnType instanceof Type){
      m.type=data.returnType;
    }else{
      let baseType=data.returnType;
      if(baseType.baseType){
        baseType=baseType.baseType;
      }
      if((baseType.substring)){
        baseType=Java.datatypes[baseType];
      }
      if(data.returnType.dimension>0){
        m.type=new Type(baseType,data.returnType.dimension);
      }else{
        m.type=new Type(baseType,0);
      }
    }
  }else{
    m.type=null;
  }
  m.modifiers=new Modifiers();
  m.modifiers.visibility='public';
  if(isStatic){
    m.modifiers.isStatic=true;
  }else{
    m.modifiers.isStatic=false;
  }
  if(data.jscode){
    m.block={
      code: data.jscode
    };
  }
  return m;
}