import { parseJava } from "../functions/parseJava";
import { CompileFunctions } from "../language/CompileFunctions";
import { createAttribute } from "../language/helper/createAttribute";
import { createMethod } from "../language/helper/createMethod";
import { Java } from "../language/java";
import { Clazz } from "./Clazz";
import { options } from "./Options";
import { Scope } from "./Scope";
import { Source } from "./Source";
import { Type } from "./Type";

/**
 * UIClazz ist eine Klasse, die von JPanel erbt
 */
export class UIClazz extends Clazz{
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
        maxY: "Maximale y-Koordinate.",
        sizePolicy: "Anpassung"
      }
    },
    HTMLElement: {
      params: ["tag","x","y","width","height"],
      labels: {
        tag: "HTML-Tag",
        value: "Der innerHTML-Wert"
      }
    }
  };

  constructor(name,project){
    super(name,project,false);
    this.errors=[];
    this.src="";
    this.components=[];
    this.componentCode="";
    this.hasClazzDeclaration=false;
    this.cssClass="";
    this.template="1";
    this.forceAbsolute=false;
    this.x=50;
    this.y=50;
    this.width=100;
    this.height=100;
    this.cssCode="";
    this.superClazz=Java.clazzes.UIClass;
    this.attributes={};
    this.showUIEditor=true;
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
    // for(let i=0;i<this.variables.length;i++){
    //   let v=this.variables[i];
    //   values[v.name]=v.type.baseType.initialValue;
    // }
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

  getGetterMethodName(attributeName){
    return "get"+attributeName.charAt(0).toUpperCase()+attributeName.substring(1);
  }

  compileVariables(scope){
    if(!scope) scope=new Scope(this.project,undefined,undefined,{addLocalVariablesUpdates: false, ignoreVisibilityRestrictions: true});
    this.variables=[];
    this.variablesErrors=[];
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
          }
        }catch(e){
          this.variablesErrors.push(e);
        }
      }
      node=node.nextSibling;
    }
  }

  getAttribute(name,staticAccess){
    
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

  getMethod(name,staticAccess){
    
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
      if(c.array){
        names[c.array]=c;
      }
      if(c.components){
        UIClazz.getAllAttributesFromComponent(c,names,standardValue);
      }
    }
    return names;
  }

  getAllAttributeNames(names){
    if(!names) names={};
    super.getAllAttributeNames(names);
    UIClazz.getAllAttributesFromComponent(this,names,true);
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
    let code=this.project.getFullAppCode("\n$uiPreviewMode=true;\nconsole.hide();\nconsole.log('set onstart');setTimeout(async ()=>{await $App.setup();var sheet = window.document.styleSheets[0];sheet.insertRule('.__jcomponent:hover{ background: cyan;opacity: 0.5; }', sheet.cssRules.length);\nwindow.addEventListener('message',function(ev){if(ev.data.type==='select'){$changePreviewSelection(ev.data.id)}});\nconsole.log('start preview');\n(new "+this.name+"("+")).$constructor();},100);",false,true);
    
    return code;
  }

  getJavaScriptCode(){
    let code="class "+this.name+" extends UIClazz";
    code+="{";
    code+="\nstatic $self;\n";//=$new("+this.name+");";
    code+=`static $createSelf(){
      ${this.name}.$self=$new(${this.name});
    }`;
    // code+="\n$constructor(){";
    // code+="super("+JSON.stringify(this.template)+","+this.x+","+this.y+","+this.width+","+this.height+");";
    // for(let i in this.attributes){
    //   let a=this.attributes[i];
    //   code+="\n"+a.getJavaScriptCode();
    // }
    // //code+="\n"+JSON.this.components
    // //code+="\n$App.canvas.addElement(this.$el,this.x,this.y,this.width,this.height);";
    // code+="\n}";
    let attributesCode="";
    //let attributesInitCode="";
    for(let i in this.attributes){
      let a=this.attributes[i];
      attributesCode+="\n"+a.getDeclarationJavaScriptCode()+";";
    }
    code+=attributesCode;
    let callInit=false;
    for(let i in this.methods){
      let m=this.methods[i];
      if(m.name==="init"){
        callInit=true;
      }
      code+="\n"+m.getJavaScriptCode();
    }
    code+="\nasync $constructor(){";
    code+="await super.$constructor("+JSON.stringify(this.template)+","+this.x+","+this.y+","+this.width+","+this.height+");";
    // for(let i in this.attributes){
    //   let a=this.attributes[i];
    //   if(!a.isNamedComponent){
    //     code+="\n"+a.getJavaScriptCode();
    //     if(a.initialValue){
    //       code+="\nthis."+a.name+"="+a.initialValue+";";
    //     }
    //   }
    // }
    code+="\nlet lastComponent,component=this;";
    code+="\nif(this.$el.replaceChildren) this.$el.replaceChildren(); else this.$el.innerHTML='';";
    code+="\nthis.componentArrays={};";
    code+="\n"+this.componentCode;
    code+="\nfor(let i in this.componentArrays){";
    code+="\nthis[i]=$createArray('JComponent',1,this.componentArrays[i]);";
    code+="\n}";
    if(callInit){
      code+="\nawait this.init();";
    }
    code+="\nreturn this;"
    code+="\n}";

    code+="\n}";
    return code;
  }  

  getConstructorParameters(){
    return [];
  }

  getSaveObject(){
    let o={};
    o.name=this.name;
    o.src=this.src;
    o.components=JSON.parse(JSON.stringify(this.components));
    o.cssClass=this.cssClass;
    o.cssCode=this.cssCode;
    o.template=this.template;
    return o;
  }

  restoreFromSaveObject(obj){
    let props=["name","src","components","cssClass","template","cssCode","isHidden"];
    for(let i=0;i<props.length;i++){
      let p=props[i];
      if(obj[p]!==undefined){
        this[p]=obj[p];
      }
    }
  }

  compile(fromSource,optimizeCompiler){
    super.compile(fromSource,optimizeCompiler);
    
    let scope=new Scope(this.project,undefined,undefined,{addLocalVariablesUpdates: false, ignoreVisibilityRestrictions: true});
    // this.attributes={};
    // this.methods={};
    
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
        type: c.array? {baseType: Java.datatypes.JComponent, dimension: 1} : type
      },this,true);
      a.isNamedComponent=true;
      this.attributes[name]=a;
    }
    
    this.componentCode="";
    let codeObject={code: "let container0=this;\nwindow.$insertPosition=0;\n"};
    codeObject.code+=this.generateJavaScriptCodeForComponent(this,codeObject,0,null);

    if(this.onAction===true){
      codeObject.code+="\ncontainer0.setTriggerOnAction("+(c.onAction===true)+");";
      newCode+="\n"+last+code;
    }
    if(this.onMouseUp===true){
      codeObject.code+="\ncontainer0.setTriggerOnMouseUp("+(c.onMouseUp===true)+");";
      newCode+="\n"+last+code;
    }
    if(this.onMouseDown===true){
      codeObject.code+="\ncontainer0.setTriggerOnMouseDown("+(c.onMouseDown===true)+");";
      newCode+="\n"+last+code;
    }
    if(this.onMouseMove===true){
      codeObject.code+="\ncontainer0.setTriggerOnMouseMove("+(c.onMouseMove===true)+");";
      newCode+="\n"+last+code;
    }
    if(this.actionCommand){
      codeObject.code+="\ncontainer0.setActionCommand("+JSON.stringify(this.actionCommand)+");";
    }
    if(this.cssClass){
      codeObject.code+="\ncontainer0.setCSSClass("+JSON.stringify(this.cssClass)+");";
    }
    if(this.cssCode){
      codeObject.code+="\ncontainer0.$el.style.cssText=container0.$el.style.cssText+';'+"+JSON.stringify(this.project.prepareCSS(this.cssCode))+";";
    }

    /**insertPosition: falls >=0: index des Einfuegens, ansonsten wird angehängt */
    this.componentCode=codeObject.code;
  }

  compileDeclarationTypeParameters(){
    
  }

  compileDeclaration(){
    this.errors=[];
    if(this.source && this.source.tree){
      this.clazzBody=this.source.tree.topNode.firstChild;
    }else{
      this.clazzBody=null;
    }
  }

  compileDeclarations(fromSource){
    if(fromSource){
      this.generateSrcAndTree(this.src);
    }
    this.compileMemberDeclarations();
  }

  compileMemberDeclarations(){
    super.compileMemberDeclarations();

    let scope=new Scope(this.project,undefined,undefined,{addLocalVariablesUpdates: false, ignoreVisibilityRestrictions: true});
    //this.compileVariables(scope);
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
      },this,true);
      a.isNamedComponent=true;
      this.attributes[name]=a;
    }
    
    this.componentCode="";
    let codeObject={code: "let container0=this;\nwindow.$insertPosition=0;\n"};
    codeObject.code+=this.generateJavaScriptCodeForComponent(this,codeObject,0,null);

    if(this.onAction===true){
      console.log("on action");
      codeObject.code+="\ncontainer0.setTriggerOnAction("+(c.onAction===true)+");";
      newCode+="\n"+last+code;
    }
    if(this.actionCommand){
      codeObject.code+="\ncontainer0.setActionCommand("+JSON.stringify(this.actionCommand)+");";
    }
    if(this.cssClass){
      codeObject.code+="\ncontainer0.setCSSClass("+JSON.stringify(this.cssClass)+");";
    }
    if(this.cssCode){
      codeObject.code+="\ncontainer0.$el.style.cssText=container0.$el.style.cssText+';'+"+JSON.stringify(this.project.prepareCSS(this.cssCode))+";";
    }

    /**insertPosition: falls >=0: index des Einfuegens, ansonsten wird angehängt */
    this.componentCode=codeObject.code;
  }

  generateJavaScriptCodeForComponent(comp,codeObject,containerIndex){
    let newCode="";
    for(let i=0;i<comp.components.length;i++){
      let c=comp.components[i];
      if(c.controlComponent){
        if(c.type==='For'){
          let max=c.controlComponent.max;
          let code="";
          for(let i=0; i < max; i++) {
            code+=this.generateJavaScriptCodeForComponent(c,codeObject,containerIndex);
          }
          newCode+="\n(()=>{\n"+code+"\n})();";
        }
        continue;
      }
      let last="component";
      newCode+="{\n";//Klammer für den Scope
      newCode+="\nlet "+last+"=";
      if(c.type==="UIClazz"){
        newCode+="$new("+c.componentName+");";
        let uiClazz=this.project.getClazzByName(c.componentName);
        if(uiClazz){
          let variables=uiClazz.variables;
          if(!c.variablesValues){
            c.variablesValues={};
          }
          for(let vn in variables){
            let v=variables[vn];
            let setterName=this.getSetterMethodName(v.name);
            if(!(v.name in c.variablesValues) || c.variablesValues[v.name]===undefined){
              c.variablesValues[v.name]=v.initialValue;
            }
            let value=c.variablesValues[v.name];
            newCode+="\n"+last+"."+setterName+"("+value+",true);";
          }
        }else{

        }
      }else{
        let additionalEnd="";
        newCode+="$new("+c.type+",";
        // if(c.type==="JImages"){
        //   newCode+="await $App.asyncFunctionCall(new "+c.type+"(),'$constructor',[";
        //   additionalEnd="]";
        // }else{
        //   newCode+="$new("+c.type+",";
        // }
        let clazz=UIClazz.UIClazzes[c.type];
        let args=[];
        for(let j=0;j<clazz.params.length;j++){
          let p=clazz.params[j];
          if(p==="x" || p==="y" || p==="width" || p==="height"){
            if(!c[p]) c[p]=0;
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
        newCode+=additionalEnd+");";
      }
      newCode+="\n"+last+".$uiClazz=this;";
      newCode+="\ncontainer"+containerIndex+".add("+last+",$insertPosition);";
      newCode+="\n$insertPosition++;";
      if(c.name){
        newCode+="\n"+this.name+"."+c.name+"= "+last+";";
      }
      if(c.array){
        newCode+="\nif(this.componentArrays["+JSON.stringify(c.array)+"]===undefined){this.componentArrays["+JSON.stringify(c.array)+"]=[];}\nthis.componentArrays["+JSON.stringify(c.array)+"].push("+last+");";
      }
      newCode+="\n"+last+".setX("+c.x+");";
      newCode+="\n"+last+".setY("+c.y+");";
      newCode+="\n"+last+".setWidth("+c.width+");";
      newCode+="\n"+last+".setHeight("+c.height+");";
      newCode+="\nif("+last+".$el){"+last+".$el.setAttribute('data-id',"+JSON.stringify(c.previewID)+");}\n";
      if(c.onAction===true || c.onAction===false){
        let code=".setTriggerOnAction("+(c.onAction===true)+");";
        newCode+="\n"+last+code;
      }
      if(c.onMouseUp===true || c.onMouseUp===false){
        let code=".setTriggerOnMouseUp("+(c.onMouseUp===true)+");";
        newCode+="\n"+last+code;
      }
      if(c.onMouseDown===true || c.onMouseDown===false){
        let code=".setTriggerOnMouseDown("+(c.onMouseDown===true)+");";
        newCode+="\n"+last+code;
      }
      if(this.onMouseMove===true || this.onMouseMove===false){
        let code=".setTriggerOnMouseMove("+(c.onMouseMove===true)+");";
        newCode+="\n"+last+code;
      }
      if(c.sizePolicy){
        let code=".setSizePolicy('"+(c.sizePolicy)+"');";
        newCode+="\n"+last+code;
      }
      if(c.actionCommand){
        let code=".setActionCommand("+JSON.stringify(c.actionCommand)+");";
        newCode+="\n"+last+code;
      }
      if(c.align!==undefined){
        let align=c.align;
        if(align!=="center"){
          align=align.substring(0,align.length-1).trim();
        }
        let code=".setAlignContent('"+align+"');";
        newCode+="\n"+last+code;
      }
      if(c.attributes!==undefined){
        let array=c.attributes.split("\n");
        let code=".setAttributes("+JSON.stringify(array)+");";
        newCode+="\n"+last+code;
      }
      if(c.disabled===true){
        let code=".setEnabled(false);";
        newCode+="\n"+last+code;
      }
      if(c.cssClass){
        let code=".setCSSClass("+JSON.stringify(c.cssClass)+");";
        newCode+="\n"+last+code;
      }
      if(c.cssCode){
        let code=".setCSS("+last+".$el.style.cssText+';'+"+JSON.stringify(c.cssCode)+")";
        newCode+="\n"+last+code;
      }
      if(c.imageZoom){
        let code=".setZoom("+JSON.stringify(c.imageZoom)+")";
        newCode+="\n"+last+code;
      }
      if(c.imageTranslationX){
        let code=".setImageTranslationX("+JSON.stringify(c.imageTranslationX)+")";
        newCode+="\n"+last+code;
      }
      if(c.imageTranslationY){
        let code=".setImageTranslationY("+JSON.stringify(c.imageTranslationY)+")";
        newCode+="\n"+last+code;
      }
      if(c.value!==null && c.value!==undefined){
        let code;
        if(c.valueType==="Boolean"){
          code=".setValue("+c.value+");";
        }else{
          code=".setValue("+JSON.stringify(c.value)+");";
          if(options.exerciseMode){
            code+=last+".$value="+JSON.stringify(c.value)+";";
          }
        }
        newCode+="\n"+last+code;
      }
      if(c.components){
        newCode+="\nlet container"+(containerIndex+1)+"="+last+";";
        newCode+=this.generateJavaScriptCodeForComponent(c,codeObject,containerIndex+1);
      }
      if(c.invisible){
        newCode+="\n"+last+".setVisible(false);";
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

  resolveSuperClazz(){

  }
}
