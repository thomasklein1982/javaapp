import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { ArgumentList } from "./ArgumentList";
import { Identifier } from "./Identifier";
import { PrimitiveType } from "../../classes/PrimitiveType";
import { TypeName } from "./TypeName";
import { GenericType } from "./GenericType";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 */
export function ObjectCreationExpression(node,source,scope,infos){
  let code;
  let root=node;
  node=node.firstChild;
  let assignTarget=null;
  if(infos && infos.assignTarget){
    assignTarget=infos.assignTarget;
  }
  if(node.name!=='new'){
    let dot=node.nextSibling;
    if(dot.name==="."){
      /**Seltsames Verhalten? Hier scheinen alle Ausdruecke zu landen, die mit einem . enden */
      /**TODO: Autocompletion klappt nicht bei mehr als einer Ebene: screen.bmi.=> keine Completion! */
      let node=root.firstChild;
      console.log("ende mit .",node);
      while(node && node.nextSibling && !node.nextSibling.type.isError){
        let f=CompileFunctions.get(node,source);
        if(f){
          try{
            f(node,source,scope);
          }catch(e){

          }
        }
        node=node.nextSibling;
      }
      throw source.createError("Unerwartetes Ende der Anweisung: Attribut oder Methode erwartet.", node);
      // let src=source.getText(root);

      // src=src.substring(0,src.length-1);
      // return Identifier({node: root, src: src, from: root.from,to: root.to-1},source,scope);
    }
    if(node.name==="Identifier"){
      Identifier(node,source,scope);
    }
  }
  node=node.nextSibling;
  if(node.name!=='TypeName'){

  }
  let clazz,typename;
  let runtimeTypeArguments={$hideFromConsole: true};
  let useTypeArguments=false;
  if(node.name==="TypeName"){
    typename=TypeName(node,source,scope);
    clazz=typename.type.baseType;
    if(typename.type.baseType.typeParameters){
      throw source.createError("Die Klasse '"+clazz.name+"' deklariert generische Typen. Du musst diese Typen innerhalb spitzer Klammern <> angeben.",node);
    }
  }else if(node.name==="GenericType"){
    useTypeArguments=true;
    typename=GenericType(node,source,scope);
    clazz=typename.type.baseType;
    let typeParameters=clazz.typeParameters;
    let typeArguments=typename.type.typeArguments;//die typen, die hier angegeben sind
    if(!typeParameters){
      throw source.createError("Die Klasse '"+clazz.name+"' deklariert keine generischen Typen. Entferne die spitzen Klammern <>.",node);
    }
    if(typeArguments.length>0 && typeParameters.length!==typeArguments.length){
      throw source.createError("Falsche Anzahl an generischen Typen.",node);
    }
    if(assignTarget){
      if(typeArguments.length===0){
        typeArguments=assignTarget.type.typeArguments;
      }else{
        /**pruefen, ob typen gleich sind: */
        let shouldTypeArguments=assignTarget.type.typeArguments;
        let argNode=node?.firstChild?.nextSibling?.firstChild;
        for(let i=0;i<shouldTypeArguments.length;i++){
          let soll=shouldTypeArguments[i];
          let ist=typeArguments[i];
          if(soll.baseType.name!==ist.baseType.name){
            throw source.createError("Datentyp '"+ist.baseType.name+"' gefunden, aber Datentyp '"+soll.baseType.name+"' gefunden.",argNode);
          }
          argNode=argNode?.nextSibling?.nextSibling;
        }
      }
    }
    for(let i=0;i<typeArguments.length;i++){
      let a=typeArguments[i];
      let infos={
        name: a.baseType.name
      };
      if(a.baseType instanceof PrimitiveType){
        infos.initialValue=a.baseType.initialValue;
      }else{
        infos.initialValue=null;
      }
      runtimeTypeArguments[typeParameters[i].name]=infos;
    }
  }
  if(clazz instanceof PrimitiveType){
    throw source.createError("Zu dem primitiven Datentyp '"+clazz.name+"' kann kein Objekt erzeugt werden.",node);
  }
  node=node.nextSibling;
  if(!node){
    throw source.createError("'(' erwartet.")
  }
  let al=ArgumentList(node,source,scope,clazz.getConstructorParameters());
  code="new "+typename.code;
  if(!clazz.isNative()){
    code="await $App.asyncFunctionCall("+code+"(),'$constructor',["+JSON.stringify(runtimeTypeArguments)+","+al.code.substring(1,al.code.length-1)+"])";
  }else{
    if(useTypeArguments){
      code+="("+JSON.stringify(runtimeTypeArguments)+","+al.code.substring(1);
    }else{
      code+=al.code;
    }
  }
  return {
    code,
    clazz: clazz,
    type: new Type(clazz,0)
  };
  // let method=scope.getMethod(mn,al.list,owner.static,owner.clazz);
  // if(method.error){
  //   throw (source.createError(method.error,node));
  // }
  // return {
  //   method,arguments: al, code
  // }
}