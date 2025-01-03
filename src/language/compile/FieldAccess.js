import { Clazz } from "../../classes/Clazz";
import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { SourceFile } from "../../classes/SourceFile";
import { Type } from "../../classes/Type";
import { CompileFunctions } from "../CompileFunctions";
import { ArrayAccess } from "./ArrayAccess";
import { Identifier } from "./Identifier";
import { MethodInvocation } from "./MethodInvocation";
import { Super } from "./Super";
import { ThisExpression } from "./ThisExpression";

/**
 * 
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @returns 
 */
export function FieldAccess(node,source,scope){

  node=node.firstChild;
  let code="";
  let owner;
  let staticContext=scope.method? scope.method.isStatic():false;
  //TODO: Verallgemeinern der owner-Suche
  if(node.name==="FieldAccess" || node.name==="ScopedTypeName"){
    let fa=FieldAccess(node,source,scope);
    code+=fa.code;
    owner={
      type: fa.type,
      static: false
    };
  }else if(node.name==="ArrayAccess"){
    let fa=ArrayAccess(node,source,scope);
    code+=fa.code;
    
    // if(fa.type.dimension>0){
    //   throw source.createError("Ein Array hat keine Attribute.",node.node);
    // }
    owner={
      type: fa.type,
      static: false
    };
  }else if(node.name==="MethodInvocation"){
    let fa=MethodInvocation(node,source,scope);
    code+=fa.code;
    if(!fa.type){
      throw source.createError("Die Methode '"+fa.method.name+"' liefert keine Rückgabe (void).",node)
    }
    owner={
      type: fa.type,
      static: false
    };
  }else if(node.name==="this"){
    if(staticContext){
      throw source.createError("Das Schlüsselwort 'this' existiert nicht in statischen Methoden.",node);
    }
    let This=ThisExpression(node,source,scope);
    code+=This.code;
    owner={
      type: This.type,
      static: false
    };
  }else if(node.name==="super"){
    if(staticContext){
      throw source.createError("Das Schlüsselwort 'super' existiert nicht in statischen Methoden.",node);
    }
    let sup=Super(node,source,scope);
    code+=sup.code;
    owner={
      type: sup.type,
      static: false
    };
  }else if(node.name==="Identifier" || node.name==="TypeName"){
    let ident=Identifier(node,source,scope);
    code+="$N("+ident.code+",'"+ident.name+"')";
    if(ident.object instanceof Clazz|| ident.object instanceof SourceFile){
      owner={
        type: ident.object,
        static: true
      };
    }else{
      owner={
        type: ident.type,
        static: false,
        object: ident.object
      };
    }
  }
  if(!owner){
    throw source.createError("Dieses Attribut hat keinen Besitzer.",node);
  }
  let type=owner.type;
  if(!type?.baseType){
    type=new Type(type,0);
  }
  scope.addTypeAnnotation(node,type,owner.static);
  node=node.nextSibling;
  let object=null;
  if(node.name==="."){
    code+=".";
    node=node.nextSibling;
    if(node.name==="Identifier" || node.name==="TypeName"){
      object=Identifier(node,source,scope,{owner});
      code+=object.code;
      let type=object.type;
      if(!type.baseType){
        type=new Type(type,0);
      }
      scope.addTypeAnnotation(node,type,false);
    }
  }else{
    let f=CompileFunctions.get(node,source);
    object=f(node,source,scope);
    code+=object.code;
    //throw (source.createError(null,node));
  }
  if(!object){
    throw source.createError("Name eines Attributs oder einer Methode erwartet.",node);
  }
  let returnType=object.type.baseType;
  if(returnType.isGeneric && owner.object){
    let typeArguments=owner.object.type.typeArguments;
    returnType=typeArguments[returnType.genericIndex].baseType;
    returnType=new Type(returnType,object.type.dimension);
  }else{
    returnType=object.type;
  }
  return {
    code,type: returnType, owner: owner.object, codeAssign: code, codeUpdate: code
  };
}