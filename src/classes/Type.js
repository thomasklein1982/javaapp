import { PrimitiveType } from "./PrimitiveType";
import {Clazz} from "./Clazz";
import { Java } from "../language/java";
import { CompileFunctions } from "../language/CompileFunctions";
import { options } from "./Options";

export class Type{
  constructor(baseType,dimension){
    if(baseType && baseType.type){
      if(baseType.dim){
        dimension=baseType.dim;
      }
      baseType=baseType.type;
    }
    this.baseType=baseType;
    this.dimension=dimension;
    
  }
  toString(){
    let t=this.baseType? this.baseType.name:"Unbekannter Datentyp";
    let d=this.dimension;
    while(d>0){
      t+="[]";
      d--;
    }
    return t;
  }
  static compile(node,source,clazzOrMethod,errors){
    try{
      let f=CompileFunctions.get(node,source);
      let res=f(node,source,clazzOrMethod);
      let type=res.type;
      return type;
    }catch(e){
      errors.push(e);
    }
    return;
    let name,dimension,isPrimitive;
    let startNode=node;
    if(node.name==="PrimitiveType"){
      name=source.getText(node);
      dimension=0;
      isPrimitive=true;
    }else if(node.name==="TypeName"){
      name=source.getText(node);
      dimension=0;
      isPrimitive=false;
    }else if(node.name==="ArrayType"){
      node=node.firstChild;
      if(node.name==="PrimitiveType"){
        isPrimitive=true;
        name=source.getText(node);
      }else{
        isPrimitive=false;
        name=source.getText(node);
      }
      node=node.nextSibling;
      var parent=node;
      /**jetzt Folge von [] */
      dimension=0;
      while(parent){
        node=parent.firstChild;
        if(node.name==="["){
          
        }else{
          errors.push(source.createError("'[' erwartet.",node));
          break;
        }
        node=node.nextSibling;
        if(node.name==="]"){
          
        }else{
          errors.push(source.createError("']' erwartet.",node));
          break;
        }
        parent=parent.nextSibling;
        dimension++;
      }
    }
    let basetype=clazzOrMethod.getTypeByName(name);
    if(!basetype){
      errors.push(source.createError("Es gibt keinen Datentyp '"+name+"'.",startNode));
      basetype=null;
    }
    if(basetype.typeParameters){
      console.log("type parameter",node);
    }
    return new Type(basetype,dimension);
  }
  
  isNumeric(){
    if(this.dimension>0) return false;
    return this.baseType?.isNumeric===true;
  }
  isString(){
    if(this.dimension>0) return false;
    return this.baseType?.name==="String";
  }
  isInt(){
    if(this.dimension>0) return false;
    return this.baseType?.name==="int";
  }
  isDouble(){
    if(this.dimension>0) return false;
    return this.baseType?.name==="double";
  }
  isChar(){
    if(this.dimension>0) return false;
    return this.baseType?.name==="char";
  }
  isBoolean(){
    if(this.dimension>0) return false;
    return this.baseType?.name==="boolean";
  }
  isPrimitiveWrapper(){
    if(this.dimension>0 || !this.baseType) return false;
    return this.baseType.wrappedPrimitiveType!==null && this.baseType.wrappedPrimitiveType!==undefined;
  }
  isPrimitive(){
    return this.dimension===0 && (this.baseType instanceof PrimitiveType);
  }
  applyAutoboxing(value){
    if(this.dimension!==value.type.dimension) return false;
    if(this.baseType instanceof PrimitiveType && this.baseType.wrapperClass && value.type.baseType.isSubtypeOf(this.baseType.wrapperClass)){ //&& value.type.baseType.name===this.baseType.wrapperClass.name){
      value.code="("+value.code+".value)";
      value.type=new Type(this.baseType,0);//.baseType=this.baseType;
    }else if(value.type.baseType instanceof PrimitiveType && value.type.baseType.wrapperClass && value.type.baseType.wrapperClass.isSubtypeOf(this.baseType)){
      value.code="("+value.type.baseType.wrapperClass.getJsName()+".valueOf("+value.code+"))";
      value.type=new Type(value.type.baseType.wrapperClass,0);
    }
    // this.baseType.name===value.type.baseType.wrapperClass.name
    return true;
  }
  autoCastValue(value){
    if(!value.type) return false;
    value.code="$u("+value.code+")";
    //if(!options.autocast) return false;
    let castFromStringToPrimitive=false;
    if(value.type.isString() && this.isPrimitive()){
      if(!options.autocast) return false;
      castFromStringToPrimitive=true;
      value.type=this;
    }
    if(this.isInt() && value.type.isDouble()){
      if(!options.autocast) return false;
      value.type=this;
      value.code="$i("+value.code+")";
    }else if(value.type.isInt()){
      value.code="$i("+value.code+")";
    }else if(value.type.isChar() && this.isInt()){
      value.type=this;
      value.code="$i("+value.code+".int)";
    }
    if(castFromStringToPrimitive){
      if(this.isNumeric()){
        value.code="$v("+value.code+")";
      }else if(this.isBoolean()){
        value.code="("+value.code+"+''==='true')";
      }
      return true;
    }else if(this.isString()&&options.autocast){
      if(value.type.baseType!==Java.datatypes.nullType){
        value.code="$s("+value.code+")";
      }
      value.type=this;
      return true;
    }
    return false;
  }
  isNumericOrString(){
    return this.isNumeric() || this.isString();
  }
  checkCompatibility(type){
    if(!type) return this;
    if(this.isSubtypeOf(type)) return type;
    if(type.isSubtypeOf(this)) return this;
    return false;
  }
  isSubtypeOf(type){
    if(!type){
      return true;
    }
    if(type instanceof PrimitiveType || type instanceof Clazz){
      type={
        baseType: type,
        dimension: 0
      };
    }
    if(type.baseType){
      if(type.dimension===0 && !(this.isPrimitive()) && type.baseType.name===Java.clazzes.Object.name){
        return true;
      }
      if(this.baseType===Java.datatypes.nullType){
        return !type.isPrimitive();
      }
      if(type.dimension===this.dimension){
        if(!type.baseType){
          return true;
        }
        return this.baseType.isSubtypeOf(type.baseType);
      }else{
        return false;
      }
    }
    
  }
}