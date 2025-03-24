import App from "../App.vue";
import { getMimeFromDataURL } from "../functions/getMimeFromDataURL.js";
import { Java } from "../language/java.js";
import { Clazz } from "./Clazz";
import { options } from "./Options.js";
import { UIClazz } from "./UIClazz.js";
import { Database } from "./Database.js";
import { SourceFile } from "./SourceFile.js";

let start="Project Code Start";
let stop="Project Code Stop";

export class Project{
  constructor(name,code){
    this.javaappVersion=app.version;
    this.clazzes=[];
    this.css="";
    this.database=new Database();
    this.includeAlaSQL=false;
    this.assets=[];
    if(!name){
      name="MyApp";
      code="class MyApp{\n  \n  void onStart(){\n    \n  }\n\n  public static void main(String[] args){\n    new MyApp();\n  }\n}";
    }
    this.name=name;
    this.date=new Date();
    if(code && code.splice){
      for(let i=0;i<code.length;i++){
        let c;
        if(code[i].type==="UI"){
          c=new UIClazz("T",this);
          let obj=JSON.parse(code[i].code);
          console.log("restore",obj);
          c.restoreFromSaveObject(obj);
        }else{
          c=new Clazz("T",this);
          c.src=code[i];
        }
        this.clazzes.push(c);
      }
    }else{
      var c=new Clazz(name,this);
      c.src=code;
      this.clazzes.push(c);
    }
    this.clazzes[0].setAsFirstClazz();
    this.uiClazzCount=this.getUiClazzCount();
    this.description="";
    this.theme_color="black";
    this.background_color="black";
    this.icon=null;
    this.urls=["./"];
  }
  getUiClazzCount(){
    let count=0;
    for(var i=0;i<this.clazzes.length;i++){
      var c=this.clazzes[i];
      if((c instanceof UIClazz)) count++;
    }
    this.uiClazzCount=count;
    return count;
  }
  handleAssetsInCode(code,before,after){
    if(!before) before="";
    if(!after) after="";
    let s=code.split("asset(");
    let t="";
    //let referencedAssets={};
    for(let i=0;i<s.length;i++){
      if(i===0){
        t+=s[i];
      }else{
        let pos=s[i].indexOf(")");
        let assetName=s[i].substring(0,pos);
        let asset=this.getAssetByName(assetName);
        if(asset){
          //referencedAssets[assetName]=asset;
          //t+="var(--"+assetName+")";
          t+=before+asset.file.code+after;
        }else{
          t+=assetName;
        }
        t+=s[i].substring(pos+1);
      }
    }
    let pos=code.indexOf("<img");
    while(pos>=0){
      let pos2=code.indexOf(">",pos);
      let part=code.substring(pos+4,pos2).trim();
      let res=/src\s*=\s*["']([^ ]*)/.exec(part);
      console.log("assets",res);

    }
    // let prefix=":root{";
    // for(var a in referencedAssets){
    //   let asset=referencedAssets[a];
    //   prefix+="--"+a+": url("+asset.file.code+");\n";
    // }
    // prefix+="}\n";
    return t;
  }
  prepareCSS(cssText){
    return this.handleAssetsInCode(cssText,"url(",")");
  }
  getAssetByName(name){
    let i=this.getAssetIndexByName(name);
    if(i>=0){
      return this.assets[i];
    }
    return null;
  }
  getAssetIndexByName(name){
    for(let i=0;i<this.assets.length;i++){
      let a=this.assets[i];
      if(a.name===name){
        return i;
      }
    }
    return -1;
  }
  
  getUIPreviewCode(startPage){
    let assetsCode="/****** ASSETS START ******/";
    for(let i=0;i<this.assets.length;i++){
      let a=this.assets[i];
      assetsCode+="loadAsset('"+a.file.code+"','"+a.name+"');";
    }
    assetsCode+="\n/****** ASSETS END ******/"
    let uiclazzesString=[];
    let uiclazzes=this.getUIClazzes();
    for(let i=0;i<uiclazzes.length;i++){
      let c=uiclazzes[i];
      if(c.name===startPage.name) continue;
      uiclazzesString.push(c.name);
    }
    uiclazzesString.push(startPage.name);
    uiclazzesString="["+uiclazzesString.join(",")+"]";

    let js="";
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(!(c instanceof UIClazz || c instanceof SourceFile)) continue;
      js+=c.getJavaScriptCode();
    }

    let css=this.prepareCSS(this.css);

    let code=`<!doctype html>
<html>
    <head>
      <title>${this.name}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
      <link rel="manifest" href="./manifest.webmanifest">
      <script>
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./sw.js').then((r)=>{
            console.log("Service Worker Registrierung erfolgreich");
          }, (e)=>{
            console.log("Service Worker Registrierung nicht erfolgreich",e);
          });
        }
        window.language="java";
        window.appJSdebugMode=true;
        window.$asyncInitFunctions=[];
        ${window.appJScode}
        $App.hideConsoleIfUIPresentAfterSetup=true;
        ${window.additionalJSCode}
        //${assetsCode}
        ${js}
        window.$exerciseChecker=async()=>{};
        window.addEventListener('DOMContentLoaded',async function(){
          await $App.setup();
          await $createAllUIClazzes(${uiclazzesString});
          
        });
        
      </script>
      <style>
        .jimage{
          justify-self: stretch;
        }
        #dialog-backdrop{
          z-index: 1000;
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          place-content: center;
          align-items: center;
        }
        #dialog-frame{
          background-color: white;
          border-radius: 0.5rem;
          max-width: 85%;
          max-height: 85%;
          box-shadow: 5px 5px 5px teal;
          min-width: 40%;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        #dialog-content{
          flex: 1;
          overflow: auto;
        }
        #dialog-input{
          width: 100%;
          min-height: 2rem;
        }
        .dialog-footer{
          margin-top: 0.2rem;
          text-align: right;
        }
        .dialog-footer-button{
          min-height: 2rem;
        }
        ${css}
      </style>
    </head>
    <body>
    </body>
</html>`;
    return code;
  }

  getFullAppCode(additionalCode, includeSave, dontCallMain, args, afterMainCallCode){
    if(!additionalCode) additionalCode="";
    this.date=new Date();
    let databaseCode="";
    if(this.includeAlaSQL){
      databaseCode+=alasql_code+"\nalasql_code();alasql.options.casesensitive=false;\n";
      databaseCode+=`alasql.fn.datepart=function(date_part,date){
        if(/^\\d\\d(?:\\:\\d\\d(?:\\:\\d\\d)?)?$/.test(date)){
          let s=date.split(':');
          let part=date_part.toLowerCase();
          if(part==='second' || part==='ss'){
            if(s.length>2){
              return s[2]*1;
            }
          }else if(part==='minute'||part==='mm'){
            if(s.length>1){
              return s[1]*1;
            }
          }else if(part==='hour'|| part==="hh"){
            if(s.length>0){
              return s[0]*1;
            }
          }
          return 0;
        } 
        return null;
      };`;
      databaseCode+="$clearAlaSQL();\ntry{";
      let cmds=this.database.createInMemory(true);
      if(cmds && cmds.length>1){
        for(var i=0;i<cmds.length;i++){
          databaseCode+="alasql("+JSON.stringify(cmds[i])+");\n";
        }
      }
      databaseCode+="}catch(e){console.log('** Datenbank-Fehler: **');console.log(e);console.log('**************')}\n";
    }
    let assetsCode="/****** ASSETS START ******/";
    for(let i=0;i<this.assets.length;i++){
      let a=this.assets[i];
      assetsCode+="loadAsset('"+a.file.code+"','"+a.name+"');";
    }
    assetsCode+="\n/****** ASSETS END ******/"
    let js=this.getJavaScriptCode();
    let body="";
    if(includeSave){
      let save=this.toSaveString(true);
      body=`<textarea style="display: none">${save}</textarea>`;
    }
    let mainClazz=this.getMainClazz();
    

    let uiclazzesString="[";
    let uiclazzes=this.getUIClazzes();
    for(let i=0;i<uiclazzes.length;i++){
      let c=uiclazzes[i];
      uiclazzesString+=c.name+",";
    }
    uiclazzesString+="]";
    let codeMainCall="(async function(){await $App.setup();\nawait $createAllUIClazzes("+uiclazzesString+");";;
    let mainObjectCode; /**der Name der Klasse oder des Objekts, das die Main-Methode enthält */
    if(mainClazz){
      if(mainClazz.hasStaticMainMethod()){
        if(!args) args=[];
        mainObjectCode=mainClazz.name;
      }else {
        if(!args) args=[];
        mainObjectCode="$main";
        codeMainCall="\nwindow.$main=new "+mainClazz.name+"();\n"+codeMainCall+"\nawait $App.asyncFunctionCall(window.$main,'$constructor',[{$hideFromConsole:true}]);";
      }
    }else{
      mainObjectCode="$main";
    }
    /* alle Funktionen aus window.$asyncInitFunctions werden aufgerufen:*/
    codeMainCall+="\nfor(let i=0;i<window.$asyncInitFunctions.length;i++){await window.$asyncInitFunctions[i]();}";
    codeMainCall+="\nif("+mainObjectCode+"?.main){await "+mainObjectCode+".main("+JSON.stringify(args)+");"+(afterMainCallCode?afterMainCallCode:"")+"}\n";
    codeMainCall+="\n$App.enableOnNextFrame=true;\nsetTimeout(async ()=>{await window.$exerciseChecker();},100);})();";
    let css=this.prepareCSS(this.css);
    codeMainCall="window.addEventListener('DOMContentLoaded',async function(){"+codeMainCall+"});";
    if(dontCallMain){
      codeMainCall="";
    }
    let code=`<!doctype html>
<html>
    <head>
      <title>${this.name}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, minimal-ui">
      <link rel="manifest" href="./manifest.webmanifest">
      <script>
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./sw.js').then((r)=>{
            console.log("Service Worker Registrierung erfolgreich");
          }, (e)=>{
            console.log("Service Worker Registrierung nicht erfolgreich",e);
          });
        }
        window.language="java";
        window.appJSdebugMode=true;
        window.$asyncInitFunctions=[];
        ${window.appJScode}
        ${includeSave? '$App.hideConsoleIfUIPresentAfterSetup=true;':''}
        ${window.additionalJSCode}
        ${databaseCode}
        ${assetsCode}
        window.$exerciseChecker=async()=>{};
        ${additionalCode}
        ${js}
        ${codeMainCall}
      </script>
      <style>
        @layer{
          .__canvas{
            container-type: size;
          }
          .__jimage{
            justify-self: stretch;
            background-size: 100% 100%;
            backgroundRepeat: no-repeat;
          }
          .__jframe{
            background-color: white;
          }
          *{overscroll-behavior: none;}
          .__datatable_inner{background-color: white; text-align: center; border-collapse: collapse}
          .__datatable_inner>tr>td,.__datatable_inner>tr>th{border: 1pt solid black}
          .__datatable_inner>tr:nth-child(even){background-color: lightgray}
          .__datatable_inner>tr.selected{background-color: yellow}
          .__datatable_inner.show-index>tr>td:nth-child(1),.__datatable_inner.show-index>tr>th:nth-child(1){display: table-cell}
          .__datatable_inner>tr>td:nth-child(1),.__datatable_inner>tr>th:nth-child(1){display: none}
          .__jbutton:active{border-radius: 0;background-color:#e0e0e0}
          .__jbutton{border-radius: 0;background-color:#d0d0d0}
          .__jbutton:enabled:hover{border-radius: 0;background-color:#dadada}
          html{font-family: sans-serif;width:100%;height:100%;}
          .animation-pulse{
            animation: pulse 1s infinite; 
          }
          #dialog-backdrop{
            z-index: 1000;
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            place-content: center;
            align-items: center;
          }
          #dialog-frame{
            background-color: white;
            border-radius: 0.5rem;
            max-width: 85%;
            max-height: 85%;
            box-shadow: 5px 5px 5px teal;
            min-width: 40%;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
          #dialog-content{
            flex: 1;
            overflow: auto;
          }
          #dialog-input{
            width: 100%;
            min-height: 2rem;
          }
          .dialog-footer{
            margin-top: 0.2rem;
            text-align: right;
          }
          .dialog-footer-button{
            min-height: 2rem;
          }
          .gamepad-button-settings{
            opacity: 0.5;
            background-color: gray;
            font-size: 8pt; 
            border-radius: 100%;
            cursor: pointer;
          }
          label{
            user-select: none;
            -webkit-user-select: none;
          }
          .__jcomponent{
            max-width: 100%;
            max-height: 100%;
            overflow: auto;
            display: inline-block;
            box-sizing: border-box;
          }
          .__jlabel{
            display: grid;
          }
          .__jtextfield{
            min-width: 0;
            width: 100%;
          }
          .__jtextarea{
            width: 100%;
            height: 100%;
            resize: none;
          }
          .__canvas>.__jcomponent,.__canvas>.__canvas-wrapper{
            position: absolute;
            left: 0;
            bottom: 0;
            max-width: none;
            max-height: none;
          }
          .__canvas-wrapper{
            contain: strict;
            width: 100%;
            height: 100%;
          }
          .__canvas{
            position: absolute;
            overflow: hidden;
          }
          .__
          .java-app-unselectable {
            -webkit-user-select: none;
            user-select: none;
          }
          .java-app-gamepad-settings-dialog{
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 101;
            background-color: #222;
            color: white;
            overflow: auto;
            padding: 0.5rem;
          }
          .java-app-gamepad-settings-dialog-table{
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            width: fit-content;
            text-align: center;
            gap: 0.5rem;
          }
          .java-app-gamepad-settings-dialog-table>div>span{
            padding: 0.5rem;
          }
          .java-app-gamepad-settings-dialog-table>div{
            border: 1pt solid white;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(1){
            grid-row: 2;
            grid-column: 1;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(2){
            grid-row: 2;
            grid-column: 3;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(3){
            grid-row: 1;
            grid-column: 2;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(4){
            grid-row: 3;
            grid-column: 2;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(5){
            grid-row: 6;
            grid-column: 3;
            background: red;
            color: black;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(6){
            grid-row: 7;
            grid-column: 2;
            background: yellow;
            color: black;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(7){
            grid-row: 5;
            grid-column: 2;
            background: blue;
            color: white;
          }
          .java-app-gamepad-settings-dialog-table>div:nth-child(8){
            grid-row: 6;
            grid-column: 1;
            background: green;
            color: white;
          }
        }
        @keyframes pulse {
          0% {
              transform: scale(0.8);
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
          }

          70% {
              transform: scale(1);
              box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
          }

          100% {
              transform: scale(0.8);
              box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }
        
        ${css}
      </style>
    </head>
    <body>
      ${body}
    </body>
</html>`;
    return code;
  }
  
  getUIClazzes(){
    let array=[];
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c instanceof UIClazz || c.fileType==="html"){
        array.push(c);
      }
    }
    return array;
  }

  getMainClazz(){
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c.hasStaticMainMethod()){
        return c;
      }
    }
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c.hasDynamicMainMethod()){
        return c;
      }
    }
    if(options.mainOptional){
      return this.clazzes[0];
    }
    return null;
  }
  getJavaScriptCode(){
    let code="";
    let mainClazz=null;
    let finished={};
    let remaining=[];
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(!mainClazz && c.hasStaticMainMethod()){
        mainClazz=c;
      }
      remaining.push(c);
    }
    if(!mainClazz && options.mainOptional){
      mainClazz=this.clazzes[0];
      mainClazz.superClazz=Java.clazzes.JavaApp;
    }
    let loopCounter=0;
    while(remaining.length>0 && loopCounter<=this.clazzes.length*this.clazzes.length){
      loopCounter++;
      let c=remaining.pop();
      let finish=true;
      if(c.superClazz && c.superClazz.isBuiltIn && !c.superClazz.isBuiltIn()){
        /**ist die Oberklasse schon abgehandelt? wenn nein, wieder in die queue! */
        if(remaining.length>0 && !finished[c.superClazz.name]){
          remaining.splice(0,0,c);
          finish=false;
        }
      }
      if(finish){
        code+="\n"+c.getJavaScriptCode();
        finished[c.name]=true;
      }
    }
    code+="console.log(window.$uiPreviewMode);if(window.$uiPreviewMode){console.log('preview mode')}"
    //code+="\nasync function onStart(){if($main && $main.onStart){$main.onStart();}}\n";
    let clazzInfos={};
    /**Informationen zu allen Klassen anhaengen: Name, Attribute mit Datentyp, factory-Funktion */
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      clazzInfos[c.name]=c.getRuntimeInfos();
    }
    code+="\n/***Klassen-Runtime-Informationen:**/\n$clazzRuntimeInfos="+JSON.stringify(clazzInfos)+";";
    return code;
  }
  initialize(){
    //this.compile(true);
    for(var i=0;i<this.clazzes.length;i++){
      var c=this.clazzes[i];
      if(c instanceof UIClazz){
        c.compile();
      }else{
        c.compileDeclarations(true);
      }
    }
  }
  getClazzByName(name){
    let i=this.getClazzIndexByName(name);
    if(i>=0){
      return this.clazzes[i];
    }else{
      if(Java.clazzes[name]){
        return Java.clazzes[name];
      }
      return null;
    }
  }
  getClazzIndexByName(name,ignoreUIClazzes){
    let index=0;
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(ignoreUIClazzes && c.isUIClazz()){
        continue;
      }
      if(c.name===name){
        return index;
      }
      index++;
    }
    return -1;
  }
  getTypeByName(name){
    // let t=Java.datatypes[name];
    // if(t) return t;
    // return this.getClazzByName(name); 
    let t=this.getClazzByName(name);
    if(t) return t;
    return Java.datatypes[name]; 
  }
  /**Kompiliert das gesamte Projekt */
  async compile(fromSource,optimizeCompiler){
    app.log("compile project, fromSource="+fromSource+" clazzes="+this.clazzes.length);
    this.includeAlaSQL=false;
    /**
     * 1. Alle Klassendeklarationen parsen
     * 2. Alle Memberdeklarationen parsen
     * 3. Alle Methoden parsen
     */
    /**Klassen-Deklarationen: */
    let start=Date.now();
    let toCompile=[];
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(fromSource){
        c.generateSrcAndTree(c.src,c.isFirstClazz||c.isUIClazz());
      }
      toCompile.push(c);
    }
    let loopCounter=0;
    while(toCompile.length>0 && loopCounter<=this.clazzes.length*this.clazzes.length){
      loopCounter++;
      let c=toCompile.pop();
      c.compileDeclaration();
      if(c.superClazz && (c.superClazz.isBuiltIn && !c.superClazz.isBuiltIn())){
        /**ist die Oberklasse schon deklariert? wenn nein, wieder in die queue! */
        if(toCompile.length>0 && !this.getClazzByName(c.superClazz)){
          toCompile.splice(0,0,c);
        }
      }
    }
    /**Member-Deklarationen: */
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      c.compileDeclarationTypeParameters();
      c.compileMemberDeclarations(true,true);
      c.resolveSuperClazz();
    }

    /**Methoden: */
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      c.compileMethods(optimizeCompiler);
      app.log("project.compile: clazz "+c.name+" compiled: error-count="+c.errors.length);
    }

    let end=Date.now();
    console.log("parsing done in "+(end-start)+"ms");
  }
  deleteClazzes(){
    while(this.clazzes.length>0) this.clazzes.pop();
  }
  removeClazz(c){
    let index=this.clazzes.indexOf(c);
    if(index<=0) return false;
    this.clazzes.splice(index,1);
    this.compile();
    return true;
  }
  async addClazz(c){
    await c.compile(true);
    this.clazzes.push(c);
    this.compile();
  }
  getName(){
    if(this.name){
      return this.name;
    }
    return this.clazzes[0].name;
  }
  updateAssetsSaveString(){
    this.assetsSaveString=JSON.stringify(this.assets);
  }
  addAsset(asset){
    this.assets.push(asset);
  }
  deleteAssetAt(index){
    this.assets.splice(index,1);
  }
  /**
   * fuegt die Klassen, Assets und Datenbank-Relationen diesem Projekt hinzu. Überschreibt gleichnamiges.
   * @param {*} p 
   */
  add(p){
    console.log("add project",p,this);
    for(let i=0;i<p.clazzes.length;i++){
      let c=p.clazzes[i];
      let index=this.getClazzIndexByName(c.name);
      if(index>=0){
        this.clazzes[index]=c;
        console.log("replace",c.name);
      }else{
        this.clazzes.push(c);
        console.log("add",c.name);
      }
    }
    for(let i=0;i<p.assets.length;i++){
      let a=p.assets[i];
      let index=this.getAssetIndexByName(a.name);
      if(index>=0){
        this.assets[index]=a;
        console.log("replace",a.name);
      }else{
        this.assets.push(a);
        console.log("add",a.name);
      }
    }
    for(let i=0;i<p.database.tables.length;i++){
      let t=p.database.tables[i];
      let index=this.database.getTableIndexByName(t.name);
      if(index>=0){
        this.database.tables[index]=t;
        console.log("replace",t.name);
      }else{
        this.database.tables.push(t);
        console.log("add",t.name);
      }
      this.database.changed=true;
      this.compile(true);
    }
  }
  toJSON(excludeAssets){
    var t=[];
    for(var i=0;i<this.clazzes.length;i++){
      var c=this.clazzes[i];
      t.push(c.getSaveObject());
    }
    let db=this.database.toCSVString();
    return {
      clazzes: t,
      database: db,
      databaseInitCode: this.database.sqlInitCode,
      css: this.css,
      assets: !excludeAssets? JSON.parse(JSON.stringify(this.assets)): this.assets.length>0,
      name: this.name,
      description: this.description,
      theme_color: this.theme_color,
      background_color: this.background_color,
      icon: this.icon,
      urls: JSON.parse(JSON.stringify(this.urls)),
      date: new Date(),
      javaappVersion: app.version
    };
  }
  toSaveString(excludeAssets){
    let o=this.toJSON(excludeAssets);
    return start+JSON.stringify(o)+stop;
  }
  fromJSON(o){
    if(o.database){
      this.database.fromCSVString(o.database);
    }
    if(o.databaseInitCode){
      this.database.sqlInitCode=o.databaseInitCode;
      if(!this.database.sqlInitCode) this.database.sqlInitCode="";
    }
    if(o.css){
      this.css=o.css;
    }
    if(o.assets){
      if(o.assets.splice){
        this.assets=o.assets;
      }
    }
    if(o.name){
      this.name=o.name;
    }
    if(o.description){
      this.description=o.description;
    }
    if(o.theme_color){
      this.theme_color=o.theme_color;
    }
    if(o.background_color){
      this.background_color=o.background_color;
    }
    if(o.icon){
      this.icon=o.icon;
    }
    if(o.urls){
      this.urls=o.urls;
    }
    if(o.date){
      this.date=o.date;
    }else{
      this.date=null;
    }
    if(o.javaappVersion){
      this.javaappVersion=o.javaappVersion;
    }else{
      this.javaappVersion=null;
    }
    this.deleteClazzes();
    let clazzes=o.clazzesSourceCode||o.clazzes;
    for(var i=0;i<clazzes.length;i++){
      var src=clazzes[i];
      if(!src) continue;
      if(src.components){
        var c=new UIClazz(null,this);
        c.restoreFromSaveObject(src);
      }else if(src.fileType){
        var c=new SourceFile(null,src.fileType,this);
        c.restoreFromSaveObject(src);
      }else{
        var c=new Clazz(null,this);
        if(src.substring){
          c.src=src;
        }else{
          c.restoreFromSaveObject(src);
        }
        //console.log("load class",src.length,src.substring(src.length-300));
      }
      this.clazzes.push(c);
    }
    if(o.hiddenClazzes){
      clazzes=o.hiddenClazzes;
      for(var i=0;i<clazzes.length;i++){
        var src=clazzes[i];
        if(!src) continue;
        if(src.components){
          var c=new UIClazz(null,this);
          c.restoreFromSaveObject(src);
        }else{
          var c=new Clazz(null,this);
          if(src.substring){
            c.src=src;
          }else{
            c.restoreFromSaveObject(src);
          }
          //console.log("load class",src.length,src.substring(src.length-300));
        }
        c.isHidden=true;
        this.clazzes.push(c);
      }
    }
    if(this.clazzes.length>0){
      this.clazzes[0].setAsFirstClazz();
    }
  }
  fromSaveString(appcode){
    console.log("from save string");
    this.assets=[];
    let pos=appcode.indexOf(start);
    let saveString;
    if(pos<0){
      return false;
    }else{
      var pos2=appcode.indexOf(stop,pos);
      if(pos2<0) return false;
      saveString=appcode.substring(pos+start.length,pos2);
    }
    try{
      console.log("parse");
      var o=JSON.parse(saveString);
      console.log(o);
      let pos=appcode.indexOf("/****** ASSETS START ******/");
      if(pos>=0){
        let pos2=appcode.indexOf("/****** ASSETS END ******/",pos+12);
        if(pos2>=0){
          let assetsCode=appcode.substring(pos+28,pos2);
          pos=assetsCode.indexOf("(");
          o.assets=[];
          while(pos>=0){
            let sep=assetsCode.charAt(pos+1);
            let pos2=assetsCode.indexOf(sep,pos+2);
            if(pos2<0) break;
            let pos3=assetsCode.indexOf(")",pos2);
            if(pos3<0) break;
            let data=assetsCode.substring(pos+2,pos2);
            let name=assetsCode.substring(pos2+3,pos3-1);
            let mime=getMimeFromDataURL(data);
            o.assets.push({
              name,
              file: {
                code: data,
                mime
              }
            });
            pos=assetsCode.indexOf("(",pos3+1);
          }
        }
      }
      this.fromJSON(o);
    }catch(e){
      return false;
    }
    
    return true;
  }
}