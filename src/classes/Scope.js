import { Attribute } from "./Attribute";
import { Clazz } from "./Clazz";
import { Java } from "../language/java";
import { PrimitiveType } from "./PrimitiveType";
import { options } from "./Options";

export class Scope{
  constructor(project,method,endPosition,compileOptions){
    this.project=project;
    this.method=method;
    this.clazz=null;
    this.endPosition=endPosition;
    this.stack=[];
    this.methodStack=[];
    this.typeAnnotations={};
    this.assignmentTargetObjectStack=[];
    this.addLocalVariablesUpdates=true;
    this.ignoreVisibilityRestrictions=false;
    this.optimizeCompiler=false;
    this.referencedVariables={};
    this.referencedVariablesCount=0;
    if(compileOptions){
      if(compileOptions.addLocalVariablesUpdates===false){
        this.addLocalVariablesUpdates=false;
      }
      if(compileOptions.ignoreVisibilityRestrictions===true){
        this.ignoreVisibilityRestrictions=true;
      }
      if(compileOptions.optimizeCompiler===true){
        this.optimizeCompiler=true;
        console.log("optimize compiler in scope");
      }
    }
    
    this.pushLayer();
    if(method && method.params){
      this.pushParameterList(method.params);
    }
  }

  // setNodeInfo(node,info){
  //   let c=this.getClazz();
  //   if(!c) return;
  //   c.nodeInfos[node.index]=info;
  // }

  pushAssignmentTargetObject(obj){
    this.assignmentTargetObjectStack.push(obj);
  }

  popAssignmentTargetObject(){
    return this.assignmentTargetObjectStack.pop();
  }

  getTopAssignmentTargetObject(){
    return this.assignmentTargetObjectStack[this.assignmentTargetObjectStack.length-1];
  }

  addReferencedVariable(name){
    this.referencedVariables[name]=true;
    this.referencedVariablesCount++;
  }

  clearReferencedVariables(){
    this.referencedVariables={};
    this.referencedVariablesCount=0;
  }

  isNodeBeyondEndPosition(node){
    return (this.endPosition!==undefined && node.from>=this.endPosition);
  }

  addTypeAnnotation(node,type,isStatic){
    let pos=node.to;
    this.typeAnnotations[pos]={
      type,isStatic
    };
    
  }

  getClazz(){
    if(this.method){
      return this.method.clazz;
    }else if(this.clazz){
      return this.clazz;
    }else{
      return null;
    }
  }

  pushLayer(){
    this.stack.push({});
  }

  popLayer(){
    this.stack.pop();
  }

  pushMethod(method){
    this.methodStack.push(method);
  }

  popMethod(){
    return this.methodStack.pop();
  }

  getMethodFromStack(){
    if(this.methodStack.length>0){
      return this.methodStack[0];
    }else{
      return this.method;
    }
  }

  pushParameterList(plist){
    for(let i=0;i<plist.parameters.length;i++){
      let p=plist.parameters[i];
      this.pushLocalVariable(p.name,p.type);
    }
  }

  
  pushLocalVariable(name,type){
    if(this.getLocalVariable(name)){
      throw "Es gibt bereits eine lokale Variable namens '"+name+"'.";
    }
    let c=this.getTypeByName(name);
    if(c){
      throw "Eine Variable darf nicht denselben Namen wie eine Klasse haben.";
    }
    let obj={
      name: name,
      type: type
    };
    let s=this.stack[this.stack.length-1];
    s[name]=obj;
  }

  getLocalVariableNames(){
    let obj={};
    for(let i=0;i<this.stack.length;i++){
      let s=this.stack[i];
      for(var a in s){
        obj[a]=true;
      }
    }
    return obj;
  }

  getLocalVariables(){
    let obj={};
    for(let i=0;i<this.stack.length;i++){
      let s=this.stack[i];
      for(var a in s){
        obj[a]=s[a];
      }
    }
    return obj;
  }


  /**Liefert die lokale Variable zu diesem Namen zurueck, falls vorhanden */
  getLocalVariable(name){
    let index=this.stack.length-1;
    /**Lokalen Stack durchsuchen: */
    while(index>=0){
      let s=this.stack[index];
      index--;
      let obj=s[name];
      if(obj){
        return obj;
      }
    }
    return null;
  }

  /**
   * Liefert das Attribut mit dem gegebenen Namen der aktuellen Klasse zurueck, falls dieses existiert 
   * @param {String} name 
   * @param {Boolean} isStatic 
   * @param {Clazz} clazz optional: die Klasse, zu der das Attribut gehoert
   * @returns 
   */
  getAttribute(name,isStatic,clazz){
    if(!clazz && !this.method) return null;
    let c=clazz? clazz : this.method.clazz;
    if(c.name==="null"){
      return {
        error: "Das null-Objekt hat keine Attribute."
      };
    }
    if(c instanceof PrimitiveType){
      return {
        error: "Der primitive Datentyp '"+c.name+"' hat keine Attribute."
      };
    }
    if(!c.getAttribute){
      console.log("kein attribute");
    }
    let a=c.getAttribute(name,isStatic);
    if(a.error){
      return a;
    }
    if(!this.ignoreVisibilityRestrictions && a.isPrivate() && this.method.clazz.name!==c.name){
      return {
        error: "Das Attribut '"+name+"' ist private."
      };
    }
    let m=this.method;
    if(a.isStatic() ){
      if(!isStatic){
        return {
          error: "Das Attribut '"+name+"' ist statisch. Schreibe stattdessen '"+c.name+"."+name+"'."
        };  
      }
    }else{
      if(!clazz && !isStatic && this.method.isStatic()){
        return {
          error: "Innerhalb einer statischen Methode kannst du nicht auf das dynamische Attribut '"+name+"' zugreifen."
        };
      }
    }
    
    return a;
  }
  
  /**
   * 
   * @param {String} name 
   * @param {ArgumentList} parameterSignature
   * @param {Boolean} isStatic 
   * @param {Clazz} clazz 
   * @returns 
   */
  getMethod(name,isStatic,clazz){
    let c=clazz? clazz : this.method.clazz;
    if(c.name==="null"){
      return {
        error: "Das null-Objekt kann keine Methode aufrufen."
      };
    }
    if(c instanceof PrimitiveType){
      return {
        error: "Der primitive Datentyp '"+c.toString()+"' hat keine Methoden."
      };
    }
    let m=c.getMethod(name,isStatic);
    if(m.error){
      return m;
    }
    if(!this.ignoreVisibilityRestrictions && m.isPrivate && m.isPrivate() && this.method.clazz!==clazz){
      return {
        error: "Die Methode '"+name+"' ist private."
      };
    }
    if(m.isStatic && m.isStatic() || m.static){
      if(!isStatic){
        return {
          error: "Die Methode '"+name+"' ist statisch. Schreibe stattdessen '"+c.name+"."+name+"(...)'."
        };  
      }
    }
    return m;
  }

  getTypeByName(name){
    let c=this.getClazz();
    if(c){
      c=c.getClazzByName(name);
    }else{
      c=this.project.getClazzByName(name);
    }
    if(!c){
      return this.getPrimitiveTypeByName(name);
    }
    return c;
  }

  getPrimitiveTypeByName(name){
    let c=Java.datatypes[name];
    if(!c) return null;
    return c;
  }
}