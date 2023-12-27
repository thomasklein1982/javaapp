import { parseJava } from "../functions/parseJava";
import { CompileFunctions } from "../language/CompileFunctions";
import { createAttribute } from "../language/helper/createAttribute";
import { createMethod } from "../language/helper/createMethod";
import { Java } from "../language/java";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Type } from "./Type";

/**
 * UIClazz ist eine Klasse, die von JPanel erbt
 */
export class UIClazz {
  static UIClazzes={
    JButton: {
      params: ["value","x","y","width","height"],
      labels: {
        value: "Der angezeigte Text des Buttons."
      }
    },
    JTextField: {
      params: ["inputType","placeholder","x","y","width","height"],
      labels: {
        value: "Der eingegebene Wert des Textfelds."
      }
    },
    JLabel: {
      params: ["value","x","y","width","height"],
      labels: {
        value: "Der angezeigte Text."
      }
    },
    JImage: {
      params: ["value","x","y","width","height"],
      labels: {
        value: "Die URL zur Bilddatei."
      }
    },
    JTextArea: {
      params: ["placeholder","x","y","width","height"],
      labels: {
        value: "Der eingebene Text der TextArea."
      }
    },
    DataTable: {
      params: []
    },
    JPanel: {
      params: ["template","x","y","width","height"],
    },
    JCheckBox: {
      params: ["label","x","y","width","height"],
      labels: {
        value: "Ist die Checkbox markiert oder nicht."
      }
    },
    JComboBox: {
      params: ["options","x","y","width","height"],
      labels: {
        value: "Die aktuell ausgewählte Option."
      }
    },
    Canvas: {
      params: ["minX","maxX","minY","maxY","x","y","width","height"],
      labels: {
        minX: "Minimale x-Koordinate.",
        maxX: "Maximale x-Koordinate.",
        minY: "Minimale y-Koordinate.",
        maxY: "Maximale y-Koordinate."
      }
    }
  };

  constructor(name,project){
    this.name=name;
    this.project=project;
    this.methods={};
    this.errors=[];
    this.props=[];
    this.variablesRaw="";
    this.variables=[];
    this.variablesErrors=[];
    this.components=[];
    this.componentCode="";
    this.hasClazzDeclaration=true;
    this.rerenderMethod=createMethod({
      name: "rerender",
      params: []
    },this,false,false);
    this.cssClass="";
    this.template="1";
    this.forceAbsolute=false;
    this.x=50;
    this.y=50;
    this.width=100;
    this.height=100;
    this.cssCode="";
    this.superClazz=Java.clazzes.JPanel;
    this.attributes={};
    /**Komponente:
     * type
     * name
     * x,y,width,height
     * style
     * css-class
     * components
     * template
     */
  }

  getPrimitiveTypeByName(name){
    return Java.datatypes[name];
  }

  getClazzByName(name){
    return this.project.getClazzByName(name);
  }

  getTypeByName(name){
    return this.project.getTypeByName(name);
  }

  isUIClazz(){
    return true;
  }

  getComponentObject(){
    let values={};
    for(let i=0;i<this.variables.length;i++){
      let v=this.variables[i];
      values[v.name]=v.type.baseType.initialValue;
    }
    return {
      type: "UIClazz",
      componentName: this.name,
      variablesValues: values
    }
  }

  getComponentData(){
    let data=this.getComponentObject();
    data.components=this.components;
    return data;
  }

  setComponentData(data){
    for(let a in data){
      this[a]=data[a];
    }
  }

  getSetterMethodName(attributeName){
    return "set"+attributeName.charAt(0).toUpperCase()+attributeName.substring(1);
  }

  compileVariables(scope){
    if(!scope) scope=new Scope(this.project,undefined,undefined,{addLocalVariablesUpdates: false, ignoreVisibilityRestrictions: true});
    this.variables=[];
    this.variablesErrors=[];
    this.methods={};
    let source=this.variablesRaw;
    if(source){
      source=source.trim(); 
    }else{
      this.variablesRaw="";
      return;
    }
    let tree=parseJava(source);
    let node=tree.topNode.firstChild;
    source=new Source(source,tree,this);
    let code=[];
    while(node){
      if(node.name==="LocalVariableDeclaration"){
        let f=CompileFunctions.get(node,source);
        try{
          let c=f(node,source,scope);
          for(let i=0;i<c.updateLocalVariablesAfter.length;i++){
            let a=createAttribute({
              name: c.updateLocalVariablesAfter[i],
              type: c.type
            },this,false,"private");
            a.initialValue=c.initialValues[i];
            a.isNamedComponent=false;
            this.variables.push(a);
            this.attributes[a.name]=a;
            let setterMethodName=this.getSetterMethodName(a.name);
            this.methods[setterMethodName]=createMethod({
              name: setterMethodName,
              args: [
                {
                  name: a.name,
                  type: a.type
                }
              ],
              jscode: "this."+a.name+"="+a.name+";\nif(arguments[1]!==true){this.$update();}"
            },this,false,false);
          }
        }catch(e){
          this.variablesErrors.push(e);
        }
      }
      node=node.nextSibling;
    }
  }

  getAttribute(name,staticAccess){
    if(staticAccess){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'."
      };
    } 
    let a=this.attributes[name];
    if(!a && this.superClazz){
      a=this.superClazz.getAttribute(name,staticAccess);
      if(a && a.error){
        a=null;
      }
    }
    if(!a){
      return {
        error: "Die Klasse '"+this.name+"' hat kein "+(staticAccess? "statisches ":"")+"Attribut namens '"+name+"'."
      };
    }
    return a;
  }

  getMethod(name,staticAccess){
    if(staticAccess){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    let m=this.methods[name];
    if(m) return m;
    m=this.superClazz.getMethod(name,staticAccess);
    if(m && m.error){
      m=null;
    }
    if(!m){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    return m;
  }

  static getAllAttributesFromComponent(component,names,standardValue){
    for(let i=0;i<component.components.length;i++){
      let c=component.components[i];
      if(c.name){
        if(standardValue!==undefined){
          names[c.name]=standardValue;
        }else{
          names[c.name]=c;
        }
      }
      if(c.components){
        UIClazz.getAllAttributesFromComponent(c,names,standardValue);
      }
    }
    return names;
  }

  getAllAttributeNames(names){
    if(!names) names={};
    UIClazz.getAllAttributesFromComponent(this,names,true);
    if(this.superClazz){
      return this.superClazz.getAllAttributeNames(names);
    }
    return names;
  }


  isNative(){
    return false;
  }

  isSubtypeOf(clazz){
    if(!clazz || clazz===this || this.superClazz.isSubtypeOf(clazz)){
      return true;
    }
    return false;
  }

  hasStaticMainMethod(){
    return false;
  }

  isBuiltIn(){
    return false;
  }

  getUIPreviewCode(){
    let code=this.project.getFullAppCode("\n$uiPreviewMode=true;\nconsole.hide();\nasync function onStart(){\n\n(new "+this.name+"("+")).$constructor();}");
    return code;
  }

  getJavaScriptCode(){
    let code="class "+this.name+" extends JPanel";
    code+="{";
    code+="\nconstructor(){";
    code+="super("+JSON.stringify(this.template)+","+this.x+","+this.y+","+this.width+","+this.height+");";
    for(let i in this.attributes){
      let a=this.attributes[i];
      code+="\n"+a.getJavaScriptCode();
    }
    //code+="\n"+JSON.this.components
    //code+="\n$App.canvas.addElement(this.$el,this.x,this.y,this.width,this.height);";
    code+="\n}";
    code+="\nasync $constructor(){";
    for(let i in this.attributes){
      let a=this.attributes[i];
      if(!a.isNamedComponent){
        code+="\n"+a.getJavaScriptCode();
        if(a.initialValue){
          code+="\nthis."+a.name+"="+a.initialValue+";";
        }
      }
    }
    code+="\nthis.rerender();"
    code+="\nreturn this;"
    code+="\n}";
    code+="\nrerender(){\nlet lastComponent,component=this;";
    code+="\nif(this.$el.replaceChildren) this.$el.replaceChildren(); else this.$el.innerHTML='';";
    code+="\n"+this.componentCode;
    // code+="\nlet elements=document.querySelectorAll('*[id]');";
    // code+="\nfor(let e of elements){e.id='"+this.name+"-'+e.id;}";
    code+="\nthis.$update();}";
    code+="\n$update(){\nif(!this.$el) return;\n";
    code+="\nfor(var i=0;i<this.$el.childNodes.length;i++){";
    code+="\nvar c=this.$el.childNodes[i];";
    code+="\nif(c.component.$update) \nc.component.$update.call(c.component,c.component);";
    code+="\n}\n}";
    for(let i in this.methods){
      let m=this.methods[i];
      code+="\n"+m.getJavaScriptCode();
    }
    code+="\n}";
    return code;
  }  

  getConstructorParameters(){
    return [];
  }

  getSaveObject(){
    return {
      name: this.name,
      components: this.components,
      cssClass: this.cssClass,
      cssCode: this.cssCode,
      variablesRaw: this.variablesRaw,
      template: this.template,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  restoreFromSaveObject(obj){
    let props=["name","components","variablesRaw","cssClass","template","x","y","width","height","onAction","cssCode"];
    for(let i=0;i<props.length;i++){
      let p=props[i];
      if(obj[p]!==undefined){
        this[p]=obj[p];
      }
    }
    
  }

  compile(){
    let scope=new Scope(this.project,undefined,undefined,{addLocalVariablesUpdates: false, ignoreVisibilityRestrictions: true});
    this.attributes={};
    this.methods={};
    this.compileVariables(scope);
    let namedComponents=UIClazz.getAllAttributesFromComponent(this,{},undefined);
    for(let name in namedComponents){
      let c=namedComponents[name];
      let type;
      if(c.type==="UIClazz"){
        type=c.componentName;
        type=this.project.getClazzByName(type);
      }else{
        type=c.type;
      }
      let a=createAttribute({
        name,
        type: c.array? {baseType: type, dimension: 1} : type
      },this,false);
      a.isNamedComponent=true;
      this.attributes[name]=a;
    }
    this.methods.getElementByID=createMethod({
      name: 'getElementByID',
      args: [
        {name: 'id', type: 'String'}
      ],
      info: 'Liefert das HTML-Element mit der angegebenen ID zurück',
      returnType: 'HTMLElement',
      jsName: "$getElementById",
      isExtraFunction: true
    },this,false,false);
    
    this.componentCode="";
    let codeObject={code: "let container0=this;\nwindow.$insertPosition=0;\n", nextUIControlStatementIndex:1};
    scope=new Scope(this.project,this.rerenderMethod,undefined,{addLocalVariablesUpdates: false, ignoreVisibilityRestrictions: true});
    codeObject.code+=this.generateJavaScriptCodeForComponent(scope,this,codeObject,0,null);

    if(this.onAction===true){
      console.log("on action");
      codeObject.code+="\ncontainer0.setTriggerOnAction("+(c.onAction===true)+");";
      newCode+="\n"+last+code;
    }
    if(this.actionCommand){
      scope.clearReferencedVariables();
      codeObject.code+="\ncontainer0.setActionCommand("+this.parseInterpolatedString(scope, this.actionCommand)+");";
    }
    if(this.cssClass){
      scope.clearReferencedVariables();
      codeObject.code+="\ncontainer0.setCSSClass("+this.parseInterpolatedString(scope,this.cssClass)+");";
    }
    if(this.cssCode){
      scope.clearReferencedVariables();
      codeObject.code+="\ncontainer0.$el.style.cssText=container0.$el.style.cssText+';'+"+this.parseInterpolatedString(scope,this.project.prepareCSS(this.cssCode))+";";
    }

    /**insertPosition: falls >=0: index des Einfuegens, ansonsten wird angehängt */
    this.componentCode=codeObject.code;
  }

  compileDeclarationTypeParameters(){
    
  }

  parseInterpolatedString(scope,src){
    if(!src) return '""';
    src=src.trim();
    let parts=[];
    let pos2=-1;
    let pos=src.indexOf("{{");
    let lastPos2=0;
    while(pos>=0){
      pos2=src.indexOf("}}",pos);
      if(pos2>=pos){
        if(lastPos2<pos){
          parts.push(JSON.stringify(src.substring(lastPos2,pos)));
        }
        let code=src.substring(pos+2,pos2);
        let res=this.parseJavaStatement(scope,code);
        parts.push(res.code);
        pos=src.indexOf("{{",pos2+1);
        lastPos2=pos2+2;
      }else{
        pos=-1;
      }
    }
    if(parts.length===0){
      return JSON.stringify(src);
    }
    if(pos2+2<src.length){
      parts.push(JSON.stringify(src.substring(pos2+2)));
    }
    return parts.join("+");
  }

  parseJavaStatement(scope,src){
    if(src===undefined || src===null) return "";
    src+="";
    if(!src) return "";
    try{
      let tree=parseJava(src);
      let node=tree.topNode.firstChild;
      if(node.name!=="ExpressionStatement"){
        throw "Kein Java-Ausdruck";
      }
      node=node.firstChild;
      let source=new Source(src,tree,this);
      let f=CompileFunctions.get(node,source);
      if(f){
        var res=f(node,source,scope);
        res.referencedVariables=scope.referencedVariables;
      }else{
        var res={code: src};
      }
      res.code="(()=>{try{return "+res.code+"}catch(e){}})()";
      return res;
    }catch(e){
      console.error(e);
      return {code: src};
    }
  }

  generateJavaScriptCodeForComponent(scope,comp,codeObject,containerIndex,parentUIControlStatementIndex){
    let newCode="";
    for(let i=0;i<comp.components.length;i++){
      let c=comp.components[i];
      if(c.controlComponent){
        let updateCode;
        newCode+="\n{\n";
        let uiControlStatementIndex=codeObject.nextUIControlStatementIndex;
        newCode+="\nlet uiControlStatement"+uiControlStatementIndex+"=new UIControlStatement("+JSON.stringify(c.type)+");";
        newCode+="\ncontainer"+containerIndex+".add(uiControlStatement"+codeObject.nextUIControlStatementIndex+",$insertPosition);";
        newCode+="\n$insertPosition++;if("+parentUIControlStatementIndex+"){uiControlStatement"+parentUIControlStatementIndex+".attachComponent(uiControlStatement"+uiControlStatementIndex+")}";
        codeObject.nextUIControlStatementIndex++;
        newCode+="\nuiControlStatement"+uiControlStatementIndex+".uiClazz=this;";
        if(c.type==='For'){
          scope.pushLayer();
          let min=this.parseJavaStatement(scope,c.controlComponent.min);
          let max=this.parseJavaStatement(scope,c.controlComponent.max);
          let variable=c.controlComponent.variable;
          scope.pushLocalVariable(variable,new Type(Java.datatypes.int, 0));
          let code="\nfor(let "+variable+"= "+min.code+";"+variable+"<= "+max.code+";"+variable+"++){\n";
          code+=this.generateJavaScriptCodeForComponent(scope, c,codeObject,containerIndex,uiControlStatementIndex);
          code+="\n}\n";
          scope.popLayer();
          updateCode=code;
          newCode+="";
        }else if(c.type==='If'){
          let condition=this.parseJavaStatement(scope,c.controlComponent.condition);
          let code="if( "+condition.code+"){\n";
          code+=this.generateJavaScriptCodeForComponent(scope, c,codeObject,containerIndex,uiControlStatementIndex);
          code+="\n}\n";
          updateCode=code;
          newCode+=code;
        }
        if(updateCode){
          newCode+="\nuiControlStatement"+uiControlStatementIndex+".$update=function(component){";
          newCode+="\ncomponent.prepareForUpdate();";
          newCode+=updateCode+"};";
          //newCode+="\nuiControlStatement"+uiControlStatementIndex+".$update();"
        }
        newCode+="\n}";
        continue;
      }
      let last="component";
      newCode+="{\n";//Klammer für den Scope
      newCode+="\nlet "+last+"=";
      if(c.type==="UIClazz"){
        newCode+="new "+c.componentName+"();";
        let uiClazz=this.project.getClazzByName(c.componentName);
        if(uiClazz){
          let variables=uiClazz.variables;
          if(!c.variablesValues){
            c.variablesValues={};
          }
          for(let vn in variables){
            let v=variables[vn];
            let setterName=this.getSetterMethodName(v.name);
            if(!(v.name in c.variablesValues)){
              c.variablesValues[v.name]=v.type.baseType.initialValue;
            }
            let value=c.variablesValues[v.name];
            value=this.parseJavaStatement(scope,value);
            newCode+="\n"+last+"."+setterName+"("+value.code+",true);";
          }
        }else{

        }
        newCode+="\n"+last+".rerender();";
      }else{
        newCode+="new "+c.type+"(";
        let clazz=UIClazz.UIClazzes[c.type];
        let args=[];
        for(let j=0;j<clazz.params.length;j++){
          let p=clazz.params[j];
          if(p==="x" || p==="y" || p==="width" || p==="height"){
            args.push(c[p]);
          }else if(p==="options"){
            try{
              let array=JSON.parse(c[p]);
              args.push("$createArray('String',"+array.length+","+JSON.stringify(array)+")");
            }catch(e){

            }
          }else{
            args.push(JSON.stringify(c[p]));
          }
        }
        newCode+=args.join(",");
        newCode+=");";
      }
      newCode+="\n"+last+".uiClazz=this;";
      newCode+="\ncontainer"+containerIndex+".add("+last+",$insertPosition);";
      newCode+="\n$insertPosition++;if("+parentUIControlStatementIndex+"){uiControlStatement"+parentUIControlStatementIndex+".attachComponent(component)}";
      let updateCode="";
      if(c.name){
        newCode+="\nthis."+c.name+"= "+last+";";
      }
      if(c.type==="JCheckBox" || c.type==="JComboBox" || c.type==="JTextField"){
        newCode+="\n"+last+".$el.onchange=function(){\nif(this.component.$triggerOnAction){$main.onAction(this.component);}}";
      }else{
        newCode+="\n"+last+".$el.onclick=function(ev){\nif(this.component.$triggerOnAction){ev.stopPropagation();$main.onAction(this.component);}}";
      }
      if(c.onAction===true){
        console.log("on action");
        let code=".setTriggerOnAction("+(c.onAction===true)+");";
        newCode+="\n"+last+code;
      }
      if(c.actionCommand){
        scope.clearReferencedVariables();
        let code=".setActionCommand("+this.parseInterpolatedString(scope, c.actionCommand)+");";
        newCode+="\n"+last+code;
        if(scope.referencedVariablesCount>0){
          updateCode+="\ncomponent"+code;
        }
      }
      if(c.align!==undefined){
        let code=".setAlignContent('"+c.align+"');";
        newCode+="\n"+last+code;
      }
      if(c.disabled===true){
        let code=".setEnabled(false);";
        newCode+="\n"+last+code;
      }
      if(c.cssClass){
        scope.clearReferencedVariables();
        let code=".setCSSClass("+this.parseInterpolatedString(scope,c.cssClass)+");";
        newCode+="\n"+last+code;
        if(scope.referencedVariablesCount>0){
          updateCode+="\ncomponent"+code;
        }
      }
      if(c.cssCode){
        scope.clearReferencedVariables();
        //let code=".$el.style.cssText="+last+".$el.style.cssText+';'+"+this.parseInterpolatedString(scope,this.project.prepareCSS(c.cssCode))+";";
        let code=".setCSS("+last+".$el.style.cssText+';'+"+this.parseInterpolatedString(scope,c.cssCode)+")";
        newCode+="\n"+last+code;
        if(scope.referencedVariablesCount>0){
          updateCode+="\ncomponent"+code;
        }
      }
      // if(c.forceAbsolute){
      //   newCode+="\n"+last+".setStyle('position','absolute');";
      //   newCode+="\n"+last+".$el.updatePosition();";
      // }
      if(c.value!==null && c.value!==undefined){
        let code;
        if(c.valueType==="Boolean"){
          code=".setValue("+c.value+");";
        }else{
          scope.clearReferencedVariables();
          code=".setValue("+this.parseInterpolatedString(scope,c.value)+");";
          if(scope.referencedVariablesCount>0){
            updateCode+="\ncomponent"+code;
          }
        }
        newCode+="\n"+last+code;
      }
      if(c.components){
        newCode+="\nlet container"+(containerIndex+1)+"="+last+";";
        newCode+=this.generateJavaScriptCodeForComponent(scope,c,codeObject,containerIndex+1);
        updateCode+="\nif(!component || !component.$el) return;"
        updateCode+="\nfor(var i=0;i<component.$el.childNodes.length;i++){";
        updateCode+="\nvar c=component.$el.childNodes[i];";
        updateCode+="\nif(c && c.component && c.component.$update){\nc.component.$update.call(c.component,c.component);}";
        updateCode+="\n}";
        
      }
      if(c.invisible){
        newCode+="\n"+last+".setVisible(false);";
      }
      if(updateCode.length>0){
        newCode+="\n"+last+".$update=function(component){"+updateCode+"};";
        newCode+="\n"+last+".$update();";
      }
      newCode+="}\n"; //Klammer zu für den Scope
    }
    return newCode;
  }

  getRealSuperClazz(){
    return this.superClazz;
  }
  
  getRuntimeInfos(){
    
  }

  compileMethodDeclarations(){

  }

  compileAttributeDeclarations(){
    
  }

  compileMemberDeclarations(){

  }

  compileMethods(){

  }

  resolveSuperClazz(){

  }
}
