import { compileScript } from "@vue/compiler-sfc";
import { createParamsString } from "../functions/snippets";
import { Block } from "../language/compile/Block";
import { LocalVariableDeclaration } from "../language/compile/LocalVariableDeclaration";
import { Modifiers } from "./Modifiers";
import { options } from "./Options";
import { ParameterList } from "./Parameters";
import { Scope } from "./Scope";
import { Type } from "./Type";
import { CompileFunctions } from "../language/CompileFunctions";
import { FormalParameters } from "../language/compile/FormalParameters";
import { concatArrays } from "../functions/helper";
import { Definition } from "../language/compile/Definition";
import { TypeParameters } from "../language/compile/TypeParameters";
import { Java } from "../language/java";

export class Method{
  constructor(clazz, isConstructorNode, comment){
    this.clazz=clazz;
    this.isConstructorNode=isConstructorNode;
    this.name=null;
    this.params=null;
    this.type=null;
    this.modifiers=null;
    this.typeParameters=null;
    this.bodyNode=null;
    this.block=null;
    this.comment=null;
    this.typeAnnotations={};
    this.jsName=null;
    this.node=null;
    this.errors=null;
    this.bodyErrors=null;
    this.nodeOffset=0;
    this.hide=false;
    this.comment=comment;
    this.allowedArgsCounts=null;
  }
  getFrom(){
    return this.node.from+this.nodeOffset;
  }
  getTo(){
    return this.node.to+this.nodeOffset;
  }
  isConstructor(){
    if(!this.clazz) throw "Die Methode kennt ihre Klasse nicht!";
    return this.name===this.clazz.name;
  }
  isBuiltIn(){
    return this.bodyNode===null;
  }
  createParamsString(){
    
  }
  getRealParameterList(typeArguments){
    let params=this.params.getCopy(typeArguments);
    return params;
  }
  getRenamedParameterList(typeArguments,newNames){
    return this.params.getRenamedCopy(typeArguments,newNames);
  }
  getRealReturnType(replacementTypes,typeArguments){
    if(!this.type) return null;
    if(!this.type.baseType.isGeneric) return this.type;
    if(replacementTypes){
      for(let n in replacementTypes){
        if(n===this.type.baseType.name){
          return new Type(replacementTypes[n],this.type.dimension);
        }
      }
    }
    if(!typeArguments) return this.type;
    for(let i=0;i<typeArguments.length;i++){
      let a=typeArguments[i];
      if(a.param.name===this.type.baseType.name){
        let t=new Type(a.baseType,this.type.dimension);
        t.typeArguments=a.typeArguments;
        t.replaceTypeParameters(a.typeArguments);
        return t;
      }
    } 
  }
  getJavaScriptCode(additionalJSCode){
    let code;
    if(this.isConstructor()){
      code="async $constructor";
      code+=this.params.getJavaScriptCode("typeArguments,")+"{\nthis.$typeArguments=typeArguments;";
    }else{
      // if(this.name==="toJSON"){
      //   code=this.modifiers.getJavaScriptCode()+" "+this.name;
      // }else{
        code=this.modifiers.getJavaScriptCode()+" async "+this.name;
      // }
      
      code+=this.params.getJavaScriptCode()+"{";
    }
    code+="let $scope=new $Scope(this);";
    code+="$App.debug.incCallDepth();";
    for(let i=0;i<this.params.parameters.length;i++){
      let p=this.params.parameters[i];
      code+="$scope.pushVariable("+JSON.stringify(p.name)+","+JSON.stringify(p.type.baseType.name)+","+p.type.dimension+","+p.name+");";
    }
    if(this.isConstructor() && this.clazz.superClazz && this.clazz.superClazz.hasUnparameterizedConstructor()){
      code+="\nif(super.$constructor){super.$constructor();}\n";
    }
    if(additionalJSCode) code+=additionalJSCode;
    if(this.block){
      code+="\n"+this.block.code;
    }
    code+="\n";
    code+="$App.debug.decCallDepth();";
    if(this.isConstructor()){
      code+="\nreturn this;\n}";
    }else{
      code+="return undefined;\n}";
    }
    return code;
  }
  isStatic(){
    return (!this.modifiers || this.modifiers.isStatic);
  }

  isPrivate(){
    return (this.modifiers && this.modifiers.visibility==="private");
  }
  hasMandatoryParameters(){
    return this.params.hasMandatoryParameters();
  }
  matchesArgumentList(argumentList){
    return this.params.matchesArgumentList(argumentList);
  }
  getSignatureString(){
    var t=this.name+"(";
    if(this.params){
      t+=this.params.toString();
    }
    t+=")";
    if(this.type){
      t+=" : "+this.type.toString();
    }
    return t;
  }

  compileDeclarationWithoutClazz(node,source,scope){
    this.node=node;
    var m=new Modifiers();
    this.modifiers=m;
    if(node.name==="LocalVariableDeclaration"){
      console.log(node,source.getText(node));
      let snode=node.firstChild;
      if(snode.name==="void"){
        this.type=null;
      }else{
        if(snode.name.indexOf("Type")<0){
          throw (source.createError("Datentyp oder Schlüsselwort 'void' erwartet",snode));
        }
        let f=CompileFunctions.get(snode,source);
        let res=f(snode,source,scope);
        this.type=res.type;
      }
      snode=snode.nextSibling;
      this.name=source.getText(snode);
      
      if(!node.nextSibling || node.nextSibling.name!=="ExpressionStatement"){
        throw(source.createError("'(' erwartet",node));
      }
      node=node.nextSibling;
      let nextNode=node.nextSibling;
      
      if(!node.firstChild || node.firstChild.name!=="LambdaExpression"){
        throw(source.createError("'(' erwartet",node));
      }
      node=node.firstChild;
      snode=node.firstChild;
      if(snode.name==='FormalParameters'){
        let list=new ParameterList(this);
        let errors=list.compile(snode,source);
        if(errors.length>0) throw errors[0];
        this.params=list;
      }
      snode=snode.nextSibling;
      //console.error(node,source.getText(node));
      if(snode.type.isError && snode.firstChild){
        if(snode.firstChild.name!=="{"){
          throw (source.createError("'{' erwartet",snode));
        }
        let bra=node.firstChild.nextSibling.nextSibling;
        if(!bra){
          //methoden-inhalt
          node=this.node?.nextSibling?.nextSibling;
          if(!node){
            throw (source.createError("'}' erwartet",snode));
          }
          this.bodyNode={
            firstChild: {
              name: "{",
              nextSibling: node,
              type: {
                isError: false
              }
            },
            from: node.from
          };
          let openCount=1;
          //console.log("methoden-inhalt von ",this.name);
          node=node.prevSibling;
          while(node.nextSibling){
            node=node.nextSibling;
            //console.log(node,source.getText(node));
            if(node.name==="{"){
              openCount++;
            }
            if(node.name==="}" || node.type.isError && node.firstChild && node.firstChild.name==="}"){
              openCount--;
              if(openCount===0){
                nextNode=node.nextSibling;
                node.isBlockEnd=true;
                this.bodyNode.to=node.to;
                return nextNode;
              }
            }
          }
          throw (source.createError("'}' erwartet",snode.nextSibling? snode.nextSibling:snode));
        }else{
          //leerer Methodenrumpf
          if(bra.firstChild.name!=="}"){
            throw (source.createError("'}' erwartet",snode.nextSibling? snode.nextSibling:snode));
          }
        }
        return nextNode;
        //gibt keinen nextSibling mehr
      }else{
        //es folgt ein Block
        node=this.node.nextSibling.nextSibling;
        if(!node || node.name!=="Block"){
          throw (source.createError("'{' erwartet",node?node:this.node));
        }
        this.bodyNode=node;
        return node.nextSibling;
      }

      // this.type=lv.type;
      // this.name=lv.name;
      return null;
    }
    //console.log("method compiled: "+this.name,this);
    return null;
  }

  /**
   * Verschiebt alle Fehler um delta, sofern das attribut hinter from liegt
   * @param {*} from 
   * @param {*} delta 
   * @returns true, wenn das attribut dahinter liegt, sonst false
   */
  shiftPosition(source,from,delta){
    if(!this.node) return;
    if(this.node.from>=from){
      if(this.errors){
        for(let e of this.errors){
          e.shift(source,delta);
        }
      }
      if(this.bodyErrors){
        for(let e of this.bodyErrors){
          if(!e || !e.shift) continue;
          e.shift(source,delta);
        }
      }
      this.nodeOffset+=delta;
      return true;
    }else{
      return false;
    }
  }

  getErrors(){
    if(this.errors){
      if(this.bodyErrors){
        return this.errors.concat(this.bodyErrors);
      }else{
        return this.errors;
      }
    }else{
      if(this.bodyErrors){
        return this.bodyErrors;
      }else{
        return [];
      }
    }
    
  }

  getTypeParameterByName(name){
    if(this.typeParameters){
      for(let i=0;i<this.typeParameters.length;i++){
        if(this.typeParameters[i].name===name){
          return this.typeParameters[i];
        }
      }
    }
    return null;
  }

  getPrimitiveTypeByName(name){
    return Java.datatypes[name];
  }

  getClazzByName(name){
    let tp=this.getTypeParameterByName(name);
    if(tp) return tp;
    return this.clazz.getClazzByName(name);
  }

  getTypeByName(name){
    let tp=this.getTypeParameterByName(name);
    if(tp) return tp;
    return this.clazz.getTypeByName(name);
  }

  /**
   * 
   * @param {*} node 
   * @param {*} source 
   * @returns 
   */
  compileDeclaration(node,source){
    this.nodeOffset=0;
    let errors=[];
    this.errors=errors;
    node=node.firstChild;
    var m=new Modifiers();
    this.modifiers=m;
    if(node.name==="Modifiers"){
      errors=errors.concat(m.compile(node,source));
      node=node.nextSibling;
    }
    this.typeParameters=null;
    if(node.name==="TypeParameters"){
      this.typeParameters=TypeParameters(node,source,undefined);
      node=node.nextSibling;
    }
    this.type=null;
    if(!this.isConstructorNode){
      if(node.name.indexOf("Type")>=0){
        this.type=Type.compile(node,source,this,errors);
      }else if(node.name==='void'){
        this.type=null;
      }else{
        errors.push(source.createError("Datentyp oder 'void' erwartet",node));
        return errors;
      }
      if(this.type && !this.type.baseType){
        return errors;
      }
      node=node.nextSibling;
    }
    if(node.name==='Definition'){
      let def=Definition(node,source);
      this.name=def.code;
      if(!options.voidOptional && this.isConstructorNode && this.name!==this.clazz.name){
        errors.push(source.createError("Der Konstruktor muss genauso heißen wie die Klasse.",node));  
      }
    }else{
      errors.push(source.createError("Name erwartet",node));
      return errors;
    }
    this.node=node;
    node=node.nextSibling;

    if(node.name==='FormalParameters'){
      let list=new ParameterList(this);
      errors=errors.concat(list.compile(node,source));
      this.params=list;
    }

    if(node){
      if(node.type.isError){
        errors.push(source.createError("'}' erwartet",node));
      }
    }
    node=node.nextSibling;
    if(this.clazz.isInterface){
      if(!node || node.name!==";"){
        console.log(node.name);
        if(node.name==="Block"){
          errors.push(source.createError("';' erwartet. Ein Interface darf Methoden nur deklarieren, nicht aber implementieren.",node));
        }else{
          errors.push(source.createError("';' erwartet.",node));
        }
      }else{
        this.bodyNode=null;
      }
    }else{
      if(!node || node.name!=="Block" && node.name!=="ConstructorBody"){
        console.log("abstract?",this.clazz,node);
        if(this.clazz.isAbstract && node.name===";"){
          this.bodyNode=null;
        }else{
          errors.push(source.createError("'{' erwartet.",node));
        }
      }else{
        this.bodyNode=node;
      }
    }
    
    return errors;
  }

  containsPosition(pos){
    if(!this.bodyNode) return false;
    if(this.clazz){
      pos-=this.clazz.getPositionShift();
    }
    return (this.bodyNode.from+this.nodeOffset<=pos && pos<=this.bodyNode.to+this.nodeOffset);
  }

  getScopeAtPosition(pos){
    let scope=new Scope(this.clazz.project,this,pos-this.nodeOffset);
    Block(this.bodyNode,this.clazz.source,scope);
    return scope;
  }

  recompileBody(newDeclarationNode,source,optimizeCompiler){
    this.compileDeclaration(newDeclarationNode,source);
    return this.compileBody(source,optimizeCompiler);
  }

  compileBody(source,optimizeCompiler){
    if(!this.bodyNode){
      return null;
    }
    let scope=new Scope(this.clazz.project,this,undefined,{optimizeCompiler: optimizeCompiler});
    this.block=Block(this.bodyNode,source,scope);
    this.typeAnnotations=scope.typeAnnotations;
    this.bodyErrors=this.block.errors;
    return this.block;
  }
}