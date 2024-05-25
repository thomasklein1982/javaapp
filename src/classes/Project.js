import { getMimeFromDataURL } from "../functions/getMimeFromDataURL.js";
import { Java } from "../language/java.js";
import { Clazz } from "./Clazz";
import {database} from "./Database";
import { options } from "./Options.js";
import { UIClazz } from "./UIClazz.js";

let start="Project Code Start";
let stop="Project Code Stop";

export class Project{
  constructor(name,code){
    this.clazzes=[];
    this.css="";
    this.assets=[];
    if(!name){
      name="MyApp";
      code="class MyApp{\n  \n  void onStart(){\n    \n  }\n\n  public static void main(String[] args){\n    new MyApp();\n  }\n}";
    }
    this.name=name;
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
    for(let i=0;i<this.assets.length;i++){
      let a=this.assets[i];
      if(a.name===name){
        return a;
      }
    }
    return null;
  }
  // let code="\<script\>window.language='java';"+window.appJScode+" "+window.additionalJSCode;
  //       code+='\n\</script\>\n\<script\>'+src+'\n\</script\>';
  getFullAppCode(additionalCode, includeSave, dontCallMain, args){
    if(!additionalCode) additionalCode="";
    let databaseCode="";
    let cmds=database.createInMemory(true);
    if(cmds && cmds.length>1){
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
      for(var i=0;i<cmds.length;i++){
        databaseCode+="alasql("+JSON.stringify(cmds[i])+");\n";
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
    let codeMainCall="";
    if(mainClazz){
      if(mainClazz.hasStaticMainMethod()){
        if(!args) args=[];
        codeMainCall="(async function(){await $App.setup();\nawait "+mainClazz.name+".main("+JSON.stringify(args)+");})();";
      }else{
        codeMainCall="\nwindow.$main=new "+mainClazz.name+"();\n(async function(){await $App.setup();\nawait $App.asyncFunctionCall(window.$main,'$constructor',[{$hideFromConsole:true}]);})();";
      }
    }
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
        ${window.appJScode}
        ${includeSave? 'console.hideIfUI()':''}
        ${window.additionalJSCode}
        ${databaseCode}
        ${assetsCode}
        ${additionalCode}
        ${js}
        ${codeMainCall}
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
      ${body}
    </body>
</html>`;
    return code;
  }
  
  getMainClazz(){
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      if(c.hasStaticMainMethod()){
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
        c.generateSrcAndTree(c.src,c.isFirstClazz && options.isEasyMode()||c.isUIClazz());
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
  toSaveString(excludeAssets){
    var t=[];
    for(var i=0;i<this.clazzes.length;i++){
      var c=this.clazzes[i];
      if(c instanceof UIClazz){
        t.push(c.getSaveObject())
      }else{
        t.push(c.src);
      }
    }
    let db=database.toCSVString();
    return start+JSON.stringify({
      clazzesSourceCode: t,
      database: db,
      css: this.css,
      assets: !excludeAssets? this.assets: this.assets.length>0,
      name: this.name,
      description: this.description,
      theme_color: this.theme_color,
      background_color: this.background_color,
      icon: this.icon,
      urls: this.urls
    })+stop;
  }
  async fromSaveString(appcode){
    console.log("from save string");
    this.assets=[];
    let pos=appcode.indexOf(start);
    let saveString;
    if(pos<0){
      saveString=appcode;
    }else{
      var pos2=appcode.indexOf(stop,pos);
      if(pos2<0) return null;
      saveString=appcode.substring(pos+start.length,pos2);
    }
    try{
      console.log("parse");
      var o=JSON.parse(saveString);
      console.log(o);
      if(o.database){
        database.fromCSVString(o.database);
      }
      if(o.css){
        this.css=o.css;
      }
      if(o.assets){
        if(o.assets.splice){
          this.assets=o.assets;
        }else if(o.assets===true){
          let pos=appcode.indexOf("/****** ASSETS START ******/");
          if(pos>=0){
            let pos2=appcode.indexOf("/****** ASSETS END ******/",pos+12);
            if(pos2>=0){
              let assetsCode=appcode.substring(pos+28,pos2);
              pos=assetsCode.indexOf("(");
              while(pos>=0){
                let sep=assetsCode.charAt(pos+1);
                let pos2=assetsCode.indexOf(sep,pos+2);
                if(pos2<0) break;
                let pos3=assetsCode.indexOf(")",pos2);
                if(pos3<0) break;
                let data=assetsCode.substring(pos+2,pos2);
                let name=assetsCode.substring(pos2+3,pos3-1);
                let mime=getMimeFromDataURL(data);
                this.assets.push({
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
    }catch(e){
      return;
    }
    this.deleteClazzes();
    for(var i=0;i<o.clazzesSourceCode.length;i++){
      var src=o.clazzesSourceCode[i];
      if(!src) continue;
      if(src.components){
        var c=new UIClazz(null,this);
        c.restoreFromSaveObject(src);
      }else{
        var c=new Clazz(null,this);
        c.src=src;
      }
      this.clazzes.push(c);
    }
    if(this.clazzes.length>0){
      this.clazzes[0].setAsFirstClazz();
    }
  }
}