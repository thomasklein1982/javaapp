import {Type} from "./Type"
import {Modifiers} from "./Modifiers"
import {Error} from "./Error"
import { Clazz } from "./Clazz";
import { VariableDeclarator } from "../language/compile/VariableDeclarator";

export class Attribute{
  constructor(clazz){
    this.clazz=clazz;
    this.type=null;
    this.name=null;
    this.attributes=null;
    this.modifiers=null;
    this.node=null;
    this.initialValue=null;
    this.errors=null;
    this.nodeOffset=0;
  }

  getFrom(){
    return this.node.from+this.nodeOffset;
  }

  getTo(){
    return this.node.to+this.nodeOffset;
  }

  isPrivate(){
    return (this.modifiers && this.modifiers.visibility==="private");
  }

  getDeclarationJavaScriptCode(){
    let code;
    if(this.isStatic()){
      code="static "+this.name;
    }else{
      code=this.name;
    }
    code+="=";
    let v;
    if(this.isStatic() && this.initialValue){
      v=this.initialValue;
    }else{
      if(!this.type){
        return "";
      }
      if(this.type.baseType instanceof Clazz || this.type.dimension>0){
        v="null";
      }else{
        v=JSON.stringify(this.type.baseType.initialValue);
      }
    }
    code+=v+";";
    return code;
  }

  getJavaScriptCode(){
    let code;
    if(this.isStatic()){
      return "";
    }
    code="this."+this.name;
    code+="=";
    let v;
    if(this.initialValue){
      v=this.initialValue;
    }else{
      if(!this.type){
        return "";
      }
      if(this.type.baseType instanceof Clazz || this.type.dimension>0){
        v="null";
      }else{
        v=JSON.stringify(this.type.baseType.initialValue);
      }
    }
    code+=v+";";
    return code;
  }
  
  isStatic(){
    return !this.modifiers || this.modifiers.isStatic;
  }

  getSignatureString(){
    return this.name+" : "+this.type?.toString();
  }

  getSingleAttributes(){
    if(!this.attributes || this.attributes.length===0){
      return null;
    }
    return this.attributes;
  }
  /**
   * Verschiebt alle Fehler um delta, sofern das attribut hinter from liegt
   * @param {*} from 
   * @param {*} delta 
   * @returns true, wenn das attribut dahinter liegt, sonst false
   */
  shiftPosition(src,from,delta){
    if(!this.node) return;
    if(this.node.from>=from){
      for(let e of this.errors){
        e.shift(src,delta);
      }
      this.offset+=delta;
      return true;
    }else{
      return false;
    }
  }

  compile(node,source,scope){
    if(!scope){
      console.error("compile attribute without scope");
    }
    this.nodeOffset=0;
    this.errors=[];
    this.node=node;
    node=node.firstChild;
    var m=new Modifiers();
    this.modifiers=m;
    if(node.name==="Modifiers"){
      this.errors=this.errors.concat(m.compile(node,source));
      node=node.nextSibling;
    }
    if(node.name.indexOf("Type")>=0){
      this.type=Type.compile(node,source,this.clazz,this.errors);
      node=node.nextSibling;
    }
    /**beliebig viele Variablennamen, mit Komma getrennt */
    this.attributes=[];
    while(true){
      if(node.name==="VariableDeclarator"){
        try{
          let vdekl=VariableDeclarator(node,source,scope,this.type);
          let a=new Attribute(this.clazz);
          a.type=this.type;
          a.name=vdekl.name;
          a.modifiers=this.modifiers;
          a.initialValue=vdekl.initialValue;
          a.node=node;
          if(this.attributes.length===0){
            a.errors=this.errors;
          }
          this.attributes.push(a);
          node=node.nextSibling;
          if(node.name===","){
            node=node.nextSibling;
            if(node.isError){
              this.errors.push(source.createError("Attributsname erwartet",node));
              return errors;
            }
          }else{
            break;
          }
        }catch(e){
          this.errors=this.errors.concat(e);
          return this.errors;
        }
      }else{
        this.errors.push(source.createError("Attributsname erwartet",node));
        return this.errors;
      }
    }
    if(node){
      if(node.type.isError || node.name!==";"){
        this.errors.push(source.createError("';' erwartet",node));
      }
    }
    return this.errors;
  }
}