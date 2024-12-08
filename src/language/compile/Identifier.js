import { Error } from "../../classes/Error";
import { Scope } from "../../classes/Scope";
import { Source } from "../../classes/Source";
import { Java } from "../java";
import { Type } from "../../classes/Type";

/**wenn owner=null: top level identifier, ansonsten ist owner ein Objekt mit folgenden Eigenschaften: 
 * clazz: Clazz Die Klasse des Objektes in der Hierarchie darueber 
 * static: boolean Gibt an, ob das Objekt in der Hierarchie darueber eine Klasse ist, also ob der Identifier statisch sein muss
 * @param {*} node 
 * @param {Source} source 
 * @param {Scope} scope 
 * @param {Error[]} errors 
 * @param {Object} owner 
 * @returns 
 */
export function Identifier(node,source,scope,infos){
  let name;
  let local=false;
  if(node.src){
    /**Spezialfall (Bug?) siehe ObjectCreationExpression */
    name=node.src;
  }else{
    name=source.getText(node);
  }
  if(!/^[a-zA-z0-9_]+$/.test(name)){
    throw source.createError("Der Bezeichner '"+name+"' ist ungültig. Ein Bezeichner darf nur aus Buchstaben, Ziffern und/oder Unterstrichen bestehen.",node);
  }
  let obj;
  let code=name;
  let codeAssign=code;
  let type=null;
  let owner=infos?.owner;
  if(owner && owner.type){
    if(owner.type.dimension>0){
      //Array!
      if(name!=="length"){
        throw source.createError("Ein Array hat keine Attribute außer der Länge 'length'.",node);
      }
      //scope.addTypeAnnotation(node.to,new Type(Java.datatypes.int,0),false);
      type=new Type(Java.datatypes.int,0);
    }else{
      let clazz;
      if(owner.static){
        clazz=owner.type;
      }else{
        clazz=owner.type.baseType;
      }
      obj=scope.getAttribute(name,owner.static,clazz);
      if(obj && obj.error){
        throw source.createError(obj.error,node);
      }
      type=obj.type;
      scope.addTypeAnnotation(node,type,false);
    }
  }else{
    //Top-Level
    if(!scope || !scope.getLocalVariable){
      console.log("fehler scope");
    }
    if(!scope.getLocalVariable){
      console.log("kein scope");
    }
    obj=scope.getLocalVariable(name);
    if(obj){
      code="$u("+code+")";
      local=true;
      type=obj.type;
      scope.addTypeAnnotation(node,type,false);
    }else{
      // if(!scope.method){
      //   throw source.createError("Es tut mir leid, ich kann diese Variable nicht außerhalb einer Methode verwenden.",node);
      // }
      let staticContext=scope.method && scope.method.isStatic()||false;
      obj=scope.getAttribute(name,staticContext);
      if(obj && obj.error){
        if(obj.clazzHasAttribute){
          throw source.createError(obj.error,node);
        }
        let error=obj.error;
        obj=scope.getTypeByName(name);
        if(obj){
          type=null;
          scope.addTypeAnnotation(node,new Type(obj,0),true);
        }else{
          throw source.createError("Der Bezeichner '"+name+"' ist undefiniert.",node);
          //t source.createError(error,node);
        }
        //throw source.createError(obj.error,node);
      }else{
        /**Attribut: */
        code="this."+code;
        codeAssign=code;
        type=obj.type;
        scope.addTypeAnnotation(node,type,false);
        if(!owner){
          scope.addReferencedVariable(name);
        }
      }
      
    }
    if(node.src){
      throw source.createError("Ein Ausdruck darf nicht mit '.' enden.",node.node);
    }
    if(!obj){
      throw source.createError("'"+name+"' ist undefiniert",node);
    }
  }
  //scope.setNodeInfo(node,type);
  return {
    code: code,
    codeAssign,
    codeUpdate: codeAssign,
    object: obj,
    type: type,
    local: local,
    name: name
  };
}