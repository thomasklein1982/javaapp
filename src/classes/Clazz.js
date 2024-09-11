import { nextTick } from "vue";
import { concatArrays } from "../functions/helper";
import { parseJava } from "../functions/parseJava";
import { SuperInterfaces } from "../language/compile/SuperInterfaces";
import { TypeParameters } from "../language/compile/TypeParameters";
import { createAttribute } from "../language/helper/createAttribute";
import { Java } from "../language/java";
import {Attribute} from "./Attribute"
import { Method } from "./Method";
import { options } from "./Options";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Type } from "./Type";
import  * as autocomplete  from "@codemirror/autocomplete";
import { createMethod } from "../language/helper/createMethod";
import { parseComments } from "../functions/parseComments";

export class Clazz{
  constructor(name,project,isInterface){
    this.name=name;
    //this.nodeInfos={};
    this.cannotBeInstantiated=false;
    this.isAbstract=false;
    this.isHidden=false;
    this.isInterface=isInterface===true;
    this.wrappedPrimitiveType=null;
    this.comment="";
    this.hasClazzDeclaration=true;
    this.project=project;
    this.superClazz=null;
    this.implementedInterfaces=[];
    this.attributeErrors=null;
    this.errors=null;
    if(this.isInterface){
      this.src="interface "+this.name+"{\n  \n}";
    }else{
      this.isInterface=false;
      this.src="class "+this.name+"{\n  \n}";
    }
    this.editor=null;
    /**der erste Kindknoten des ClassBody: */
    this.clazzBody=null;
    this.attributes={};
    this.methods={};
    this.typeParameters=null;
    this.node=null;
    this.references=[];
    this.isFirstClazz=false;
    this._isBuiltIn=project===undefined;
    if(this.name){
      this.typeSnippet=autocomplete.snippetCompletion(this.name, {
          label: this.name,
          type: "function"
      });
    }else{
      this.typeSnippet=null;
    }
  }
  getSaveObject(){
    let o={};
    o.name=this.name;
    o.src=this.src;
    o.isHidden=this.isHidden;
    return o;
  }

  restoreFromSaveObject(obj){
    if(obj.name){
      this.name=obj.name;
    }else{
      this.name=null;
    }
    if(obj.src){
      this.src=obj.src;
    }else{
      this.src="";
    }
    this.isHidden=false;
    if(obj.isHidden){
      this.isHidden=true;
    }
  }
  sortMembers(){
    let as=[];
    let ms=[];
    for(let v in this.attributes){
      let a=this.attributes[v];
      as.push(a);
    }
    for(let v in this.methods){
      let m=this.methods[v];
      ms.push(m);
    }
    as.sort((a,b)=>{
      if(a.name<b.name){
        return -1;
      }else{
        return 1;
      }
    });
    ms.sort((a,b)=>{
      if(a.name<b.name){
        return -1;
      }else{
        return 1;
      }
    });
    this.attributes={};
    for(let i=0;i<as.length;i++){
      this.attributes[as[i].name]=as[i];
    }
    this.methods={};
    for(let i=0;i<ms.length;i++){
      this.methods[ms[i].name]=ms[i];
    }
  }
  setWrappedPrimitiveType(ptype){
    this.wrappedPrimitiveType=ptype;
  }
  setAsFirstClazz(){
    this.isFirstClazz=true;
  }
  getConstructor(){
    for(let i in this.methods){
      let m=this.methods[i];
      if(m.isConstructor()){
        return m;
      }
    }
    return null;
  }
  hasUnparameterizedConstructor(){
    let c=this.getConstructor();
    if(!c) return true;
    return !c.hasMandatoryParameters();
  }
  isNative(){
    return this.project===undefined;
  }
  getJavaScriptCode(){
    let code="class "+this.name;
    if(this.superClazz){
      if(this.superClazz.splice){
        code+=" extends "+this.superClazz;
      }else{
        code+=" extends "+this.superClazz.name;
      }
    }
    code+="{";
    code+="\nconstructor(){";
    if(this.superClazz){
      code+="super();";
    }
    code+="\n}";
    // if(this.hasStaticMainMethod()){
    //   code+="if(!window.$main){window.$main=this;}";
    // }
    let attributesCode="";
    //let attributesInitCode="";
    for(let i in this.attributes){
      let a=this.attributes[i];
      code+="\n"+a.getDeclarationJavaScriptCode()+";";
      attributesCode+="\n"+a.getJavaScriptCode();
    }
    /**Falls option aktiv, wird in der Hauptklasse für jede UI-Klasse 1 Attribut mit einer Instanz der UI-Klasse erzeugt: */
    /** geändert: UI-Klassen werden prinzipiell als statische Singletons erzeugt */
    let onStartPrecode="";
    // if(this.isFirstClazz && options.instantiateUIClasses){
    //   for(var i=0;i<this.project.clazzes.length;i++){
    //     var c=this.project.clazzes[i];
    //     if(!(c.isUIClazz())) continue;
    //     let name=c.name;
    //     onStartPrecode+="\nthis."+name+"=(await $App.asyncFunctionCall(new "+c.name+"(),'$constructor',[{$hideFromConsole:true},]));";
    //     if(this.project.getUiClazzCount()>1){
    //       onStartPrecode+="\nthis."+name+".setVisible(false);";
    //     }
    //   }
    // }
    
    let hasConstructor=false;
    let hasOnStart=false;
    for(let i in this.methods){
      let m=this.methods[i];
      if(m.isConstructor()){
        code+="\n"+m.getJavaScriptCode(attributesCode);
        hasConstructor=true;
      }else{
        if(m.name==="main"){
          hasOnStart=true;
          code+="\n"+m.getJavaScriptCode(onStartPrecode);
        }else{
          code+="\n"+m.getJavaScriptCode();
        }
      }
    }
    if(onStartPrecode && !hasOnStart){
      //eigene onStart-Methode hinzufuegen:
      code+="\nasync main(){"+onStartPrecode+"\n}";
    }
    if(!hasConstructor){
      code+="\nasync $constructor(typeArguments){\nthis.$typeArguments=typeArguments;\n"+attributesCode+"\nreturn this;}";
    }
    code+="\n$getType(infos){\nif(infos.isGeneric){\nreturn this.$typeArguments[infos.name];}\nif(!infos){infos={name: 'Object',initialValue: null};}\nreturn infos;}";
    code+="\n}";
    return code;
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

  getMethodByPosition(pos, to){
    for(let i in this.methods){
      let m=this.methods[i];
      if(m.containsPosition(pos)){
        if(to===undefined){
          return m;
        }else{
          if(m.containsPosition(to)){
            return m;
          }else{
            return null;
          }
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
    return this.project.getClazzByName(name);
  }

  getTypeByName(name){
    let tp=this.getTypeParameterByName(name);
    if(tp) return tp;
    return this.project.getTypeByName(name);
  }

  getAllAttributeNames(names){
    if(!names) names={};
    for(let a in this.attributes){
      names[this.attributes[a].name]=true;
    }
    if(this.superClazz && this.superClazz.getAllAttributeNames){
      return this.superClazz.getAllAttributeNames(names);
    }
    return names;
  }

  getAttributeRuntimeInfos(names){
    if(!names) names={};
    for(let a in this.attributes){
      let at=this.attributes[a];
      
      if(!at.type) continue;
      names[at.name]={
        type: {
          baseType: at.type.baseType.name,
          dimension: at.type.dimension,
        },
        static: at.isStatic(),
        vis: at.modifiers.visibility
      };
    }
    if(this.superClazz && this.superClazz.getAttributeRuntimeInfos){
      return this.superClazz.getAttributeRuntimeInfos(names);
    }
    return names;
  }

  getMethodRuntimeInfos(names){
    if(!names) names={};
    for(let a in this.methods){
      let m=this.methods[a];
      let args;
      if(m.params){
        args=[];
        for(let i=0;i<m.params.parameters.length;i++){
          let a=m.params.parameters[i];
          args.push({
            name: a.name,
            type: {
              baseType: a.type.baseType.name,
              dimension: a.type.dimension
            }
          });
        }
      }else{
        args: []
      }
      names[m.name]={
        type: m.type? {
          baseType: m.type.baseType.name,
          dimension: m.type.dimension,
        }:null,
        static: m.isStatic(),
        vis: m.modifiers.visibility,
        args
      };
    }
    if(this.superClazz && this.superClazz.getMethodRuntimeInfos){
      return this.superClazz.getMethodRuntimeInfos(names);
    }
    return names;
  }

  getRealSuperClazz(){
    if(this.superClazz){
      return this.superClazz;
    }
    /**einfaches ==, weil der Proxy dazwischenfunkt */
    let c=this;
    if(c.name===Java.clazzes.Object.name){
      return null;
    }else{
      return Java.clazzes.Object;
    }
  }

  /**
   * 
   * @param {String} name 
   * @param {Boolean} staticAccess 
   * @returns 
   */
   getAttribute(name,staticAccess){
    let a=this.attributes[name];
    if(!a){
      let sc=this.getRealSuperClazz();
      if(sc && sc.getAttribute){
        return sc.getAttribute(name,staticAccess);
      }
    }
    if(!a){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'.",
        clazzHasAttribute: false
      };
    }
    if(staticAccess){
      if(a.isStatic && a.isStatic() || a.static){
        return a;
      }else{
        return {
          error: "Das Attribut '"+name+"' ist nicht statisch.",
          clazzHasAttribute: true
        };
      }
    }else{
      if(a.isStatic && a.isStatic() || a.static){
        return {
          error: "Das Attribut '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"' um darauf zuzugreifen.",
          clazzHasAttribute: true
        };
      }else{
        return a;
      }
    }
  }

  hasStaticMainMethod(){
    let m=this.methods['main'];
    if(!m) return false;
    if(m.isStatic && m.isStatic()){
      return true;
    }else{
      return false;
    }
  }

  hasDynamicMainMethod(){
    let m=this.methods['main'];
    if(!m) return false;
    else return true;
  }

  getMethod(name,staticAccess){
    if(name==="toString"){
      name="$toString";
    }
    let m=this.methods[name];
    if(!m){
      let sc=this.getRealSuperClazz();
      if(sc){
        m=sc.getMethod(name,staticAccess);
        if(m && m.error){
          m=null;
        }
      }
    }
    if(!m){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    if(staticAccess){
      if(m.isStatic && m.isStatic() || m.static){
        return m;
      }else{
        return {
          error: "Die Methode '"+name+"' ist nicht statisch."
        };
      }
    }else{
      if(m.isStatic && m.isStatic() || m.static){
        return {
          error: "Die Methode '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"(...)' um darauf zuzugreifen."
        };
      }else{
        return m;
      }
    }
  }

  isSubtypeOf(type){
    if(!type || type.name === Java.datatypes.Object.name) return true;

    if(type instanceof Type){
      if(type.dimension===0){
        type=type.baseType;
      }else{
        return false;
      }
    }
    if(type instanceof Clazz){
      if(type.name==="Object" || this.name===type.name){
        return true;
      }
      if(type.isInterface){
        
        if(this.implementedInterfaces){
          for(let i=0;i<this.implementedInterfaces.length;i++){
            let inter=this.implementedInterfaces[i];
            if(inter.name===type.name){
              return true;
            }
          }
          return false;
        }else{
          return false;
        }
      }
      if(this.superClazz && !this.superClazz.isSubtypeOf){
        console.error("superklasse is subtype of",this,this.superClazz);
      }
      return (this.superClazz && this.superClazz.isSubtypeOf(type));
    }
    return false;
  }

  isMainClazz(){
     return (this.hasStaticMainMethod()||options.mainOptional&&this.isFirstClazz);
  }

  getRuntimeInfos(){
    let superClazz=this.getRealSuperClazz();
    let typeParameters=null;
    if(this.typeParameters){
      typeParameters=[];
      for(let i=0;i<this.typeParameters.length;i++){
        let tp=this.typeParameters[i];
        typeParameters.push(tp.name);
      }
    }
    let infos={
      attributes: this.getAttributeRuntimeInfos(),
      methods: this.getMethodRuntimeInfos(),
      name: this.name,
      superClazzName: superClazz? superClazz.name : null,
      typeParameters
    };
    return infos;
  }

  isBuiltIn(){
    return this._isBuiltIn;
  }

  toString(){
    return this.name;
  }

  getPositionShift(){
    return 0;
  }

  generateSrcAndTree(src,withoutClazzDeclaration){
    let code=src;
    // if(!this.hasClazzDeclaration){
    //   code="class Main{"+src+"}";
    // }else{
    //   code=src;
    // }
    var tree=parseJava(code,withoutClazzDeclaration);
    // window.tree=tree;
    // window.tree2=parseJava(code,withoutClazzDeclaration);
    this.setSrcAndTree(code,tree);
    /**schlechte loesung */
    //this.src=src;
  }

  setSrcAndTree(src,tree,keepState){
    this.src=src;
    if(!keepState){
      if(!this.isUIClazz()){
        this.name=null;
        this.superClazz=null;
      }
      this.attributes={};
      this.methods={};
    }
    this.source=new Source(src,tree,this);
    
  }

  recompileMethod(methodInformation,src,tree,optimizeCompiler){
    this.setSrcAndTree(src,tree,true);
    let method=methodInformation.method;
    let delta=methodInformation.delta;
    let from=methodInformation.from;
    /**bei allen membern muessen die nodes aktualisiert werden, 
     * die eine Methode muss neu kompiliert werden,
     * in allen anderen Methode muessen die Fehler bestehen bleiben*/
    this.errors=this.attributeErrors.concat([]);

    for(let a in this.attributes){
      a=this.attributes[a];
      a.shiftPosition(this.source,from,delta);
      if(a.errors){
        this.errors=this.errors.concat(a.errors);
      }
    }
    for(let m in this.methods){
      m=this.methods[m];
      m.shiftPosition(this.source,from,delta);
      if(m.name!==method.name){
        this.errors=this.errors.concat(m.getErrors());
      }
    }

    let node=tree.topNode.firstChild;
    if(node.type.name==="ClassDeclaration"){
      node=node.firstChild;
      while(node.nextSibling){
        node=node.nextSibling;
      }
      node=node.firstChild.nextSibling;
    }
    this.clazzBody=node;
    /**node ist jetzt der erste Member-Node */
    while(node){
      if(node.name==="MethodDeclaration" || node.name==="ConstructorDeclaration"){   
        if(node.from===method.node.parent.from+method.nodeOffset){
          method.recompileBody(node,this.source,optimizeCompiler);
          this.errors=this.errors.concat(method.getErrors());
        }
      }
      node=node.nextSibling;
    }
    nextTick(()=>{
      if(!this.editor) return;
      this.editor.updateLinter();
    });
  }

  async compile(fromSource,optimizeCompiler){
    this.compileDeclarations(fromSource);
    this.compileMethods(optimizeCompiler);
    this.compileLastChecks();
  }

  compileLastChecks(){
    if(this.implementedInterfaces){
      for(let i=0;i<this.implementedInterfaces.length;i++){
        let inter=this.implementedInterfaces[i];
        for(let m in inter.methods){
          if(!this.methods[m]){
            this.errors.push(this.source.createError("Als "+inter.name+" muss diese Klasse eine Methode "+m+" implementieren.",inter.node));
          }
          console.log(m);
        }
      }
    }
  }

  compileDeclarations(fromSource){
    if(fromSource){
      console.log("compile declarations",this.src);
      this.generateSrcAndTree(this.src);
    }
    this.compileDeclaration();
    this.compileDeclarationTypeParameters();
    this.compileMemberDeclarations();
  }

  isUIClazz(){
    return false;
  }
  
  compileDeclaration(){
    var errors=[];
    this.errors=errors;
    this.superClazz=null;
    this.superClazzNode=null;
    this.hasClazzDeclaration=true;
    this.typeParametersNode=null;
    this.implementedInterfaces=null;
    var node=this.source.tree.topNode.firstChild;
    this.comment="";
    let comments=parseComments(this.source,node);
    node=comments.node;
    this.comment=comments.text;
    if(!node || (node.type.name!=="ClassDeclaration" && node.type.name!=="InterfaceDeclaration")){
      if(!(options.classOptional && this.isFirstClazz)){
        errors.push(this.source.createError("Du musst mit der Deklaration einer Klasse beginnen.",this.source.tree.topNode));
        return errors;
      }else{
        this.hasClazzDeclaration=false;
        this.name=options.exerciseMainClassName;//"Main";
        this.clazzBody=node;
      }
    }else{
      if(node.type.name==="ClassDeclaration"){
        this.isInterface=false;
      }else{
        this.isInterface=true;
      }
      node=node.firstChild;
      while(node.nextSibling && node.name!=="Definition"){
        node=node.nextSibling;
      }
      this.name=this.source.getText(node);
      this.node=node;
      node=node.nextSibling;
      if(node.name==="TypeParameters"){
        this.typeParametersNode=node;
        node=node.nextSibling;
      }
      if(node.name==="Superclass"){
        let subnode=node.firstChild;
        if(subnode.name!=="extends"){
          errors.push(this.source.createError("'extends' erwartet",node));
        }else{
          subnode=subnode.nextSibling;
          this.superClazz=this.source.getText(subnode);
          this.superClazzNode=subnode;
        }
        node=node.nextSibling;
      }
      if(node.name==="SuperInterfaces"){
        try{
          this.implementedInterfaces=node;
        }catch(e){
          errors.push(e);
        }
        node=node.nextSibling;
      }
      if(node.name!=="ClassBody" && node.name!=="InterfaceBody"){
        errors.push(this.source.createError("'{' erwartet",node));
      }else{
        this.clazzBody=node.firstChild.nextSibling;
      }
    }
    return errors;
  }

  resolveSuperClazz(){
    if(this.superClazz){
      let c=this.project.getClazzByName(this.superClazz);
      if(c){
        this.superClazz=c;
      }else{
        this.errors.push(this.source.createError("Unbekannte Klasse",this.superClazzNode));
      }
    }
  }
  compileDeclarationTypeParameters(){
    if(this.typeParametersNode){
      try{
        let tp=TypeParameters(this.typeParametersNode,this.source,new Scope(this.project));
        this.typeParameters=tp;
        if(tp.length===0){
          this.errors.push(source.createError("Du musst in den eckigen Klammern mindestens einen generischen Datentypen deklarieren.",this.typeParametersNode));
          this.typeParameters=null;
        }
      }catch(e){
        this.errors.push(e);
      }
    }else{
      this.typeParameters=null;
    }
    if(this.implementedInterfaces){
      let scope=new Scope(this.project);
      scope.clazz=this;
      try{
        let list=SuperInterfaces(this.implementedInterfaces, this.source, scope);
        this.implementedInterfaces=list.list.types;
      }catch(e){
        this.errors.push(e);
      }
    }
  }

  compileMemberNodes(scope,node){
    let hasConstructor=false;
    this.attributeErrors=[];
    while(node){
      // if(node.name==="ConstantDeclaration"){
      //   if(this.isInterface){
      //     this.errors.push(this.source.createError("Ein Interface kann keine attribute deklarieren.",node));
      //     continue;
      //   }
      // }
      let comments=parseComments(this.source,node);
      node=comments.node;
      let description=comments.text;
      if(node.name==="FieldDeclaration"){
        if(this.isInterface){
          this.errors.push(this.source.createError("Ein Interface kann keine Attribute deklarieren.",node));
          continue;
        }
        var a=new Attribute(this,description);

        this.errors=this.errors.concat(a.compile(node,this.source,scope));
        let attr=a.getSingleAttributes();
        if(!attr){
          concatArrays(this.attributeErrors,a.errors);
        }else{
          for(var i=0;i<attr.length;i++){
            let sa=attr[i];
            if(sa.name){
              if(this.attributes[sa.name]){
                this.errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+sa.name+"'.",sa.node));
              }else if(this.methods[sa.name]){
                this.errors.push(this.source.createError("Es gibt bereits eine Methode namens '"+sa.name+"'.",sa.node));
              }else{
                this.attributes[sa.name]=sa;
              }
            }
          }
        }
      }else if(node.name==='MethodDeclaration'){
        let m=new Method(this,false,description);
        this.errors=this.errors.concat(m.compileDeclaration(node,this.source));
        if(m.name){
          if(this.methods[m.name]){
            this.errors.push(this.source.createError("Es gibt bereits eine Methode namens '"+m.name+"'.",m.node));
          }else if(this.attributes[m.name]){
            this.errors.push(this.source.createError("Es gibt bereits ein Attribut namens '"+m.name+"'.",m.node));
          }else{
            this.methods[m.name]=m;
          }
        }
      }else if(node.name=="ConstructorDeclaration"){
        /**falls die option voidOptional true ist, werden normale Methoden auch als Konstruktor geparst. Dann hängt es am Namen, ob es sich um einen Konstruktor handelt */
        if(!options.voidOptional && hasConstructor){
          this.errors.push(this.source.createError("Eine Klasse kann höchstens einen Konstruktor besitzen.",node));
        }else{
          let m=new Method(this,true,description);
          this.errors=this.errors.concat(m.compileDeclaration(node,this.source));
          let isConstructor=m.isConstructor();
          if(hasConstructor){
            if(isConstructor){
              this.errors.push(this.source.createError("Eine Klasse kann höchstens einen Konstruktor besitzen.",node));
            }
          }else{
            hasConstructor=isConstructor;
          }
          this.methods[m.name]=m;
        }
      }else if(node.name==="LineComment" || node.name==="BlockComment"){
      }else if(node.name==="}"){
        break;
      }else{
        if(this.isInterface){
          this.errors.push(this.source.createError("Methodendeklaration erwartet.",node));
        }else{
          this.errors.push(this.source.createError("Attributs- oder Methoden- oder Konstruktordeklaration erwartet.",node));
        }
        
      }
      if(node.nextSibling){
        node=node.nextSibling;
      }else{
        break;
      }
    }
    if(node.type.isError || !node.name==="}"){
      this.errors.push(this.source.createError("Hier fehlt eine '}'",node));
    }
    node=node.parent;
    while(node){
      if(node.nextSibling){
        this.errors.push(this.source.createError("Nach Abschluss der Klasse darf kein weiterer Code folgen",node.nextSibling));
        break;
      }
      node=node.parent;
    }
  }

  /**
   * Kompiliert alle Member-Deklarationen
   */
  compileMemberDeclarations(){
    this.attributes={};
    // if(this.isFirstClazz && options.instantiateUIClasses){
    //   for(var i=0;i<this.project.clazzes.length;i++){
    //     var c=this.project.clazzes[i];
    //     if(!(c.isUIClazz())) continue;
    //     let name=c.name;
    //     let a=createAttribute({
    //       name,
    //       type: c
    //     },this,false);
    //     this.attributes[name]=a;
    //   }
    // }
    this.methods={};
    // if(!this.deserializeMethod){
    //   if(!this.isInterface){ 
    //     let m=createMethod({
    //       name: "deserialize",
    //       info: "Erzeugt ein neues Objekt aus dem übergebenen String.",
    //       args: [{name: "serializedObject", type: "String", info: "Ein String, der aus der Serialisierung eines Objekts dieser Klasse entstanden ist."}],
    //       returnType: new Type(this,0),
    //       isExtraFunction: true,
    //       jsName: "$object_deserialize"
    //     },this,true,false);
    //     m.hide=true;
    //     this.deserializeMethod=m;
    //   }
    // }
    // if(this.deserializeMethod){
    //   this.methods.deserialize=this.deserializeMethod;
    // }
    var node=this.clazzBody;
    if(!node) return;
    /**Klassenkoerper parsen: */
    let scope=new Scope(this.project);
    scope.clazz=this;
    this.compileMemberNodes(scope,node);
    if(options.autoextendJavaApp && !this.superClazz && this.hasStaticMainMethod()){
      console.log("auto extend javaapp",this.name);
      this.superClazz=Java.clazzes.JavaApp;
    }
    return this.errors;
  }

  getConstructorParameters(){
    let c=this.getConstructor();
    return c? c.params: null;
  }
  getConstructorRealParameters(){
    let c=this.getConstructor();
    if(!c) return null;
    return c.getRealParameterList();
  }

  /**
   * Kompiliert alle Methoden (inklusive Konstruktoren) der Klasse
   */
  compileMethods(optimizeCompiler){
    for(let mi in this.methods){
      let m=this.methods[mi];
      m.compileBody(this.source,optimizeCompiler);
      concatArrays(this.errors,m.getErrors());
    }
    this.compileLastChecks();
  }
}