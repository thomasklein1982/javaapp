<template>
  <div style="width: 100%;overflow: hidden;" :style="{position: $root.printMode? '':'fixed', height: $root.printMode? '':'100%'}">
    <StartScreen 
      v-if="screen==='start'"
      :difficulty="difficulty"
      @open-project="openProject"
      @uploaded-project="openProjectDialogWithoutImporting"
    />
    <Editor
      v-show="screen==='editor'"
      :paused="paused"
      :current="current"
      :difficulty="difficulty"
      ref="editor"
      @help="showHelp()"
      @open-project-dialog="openProjectDialog"
      :logged-data="loggedData"
    />
    <DocumentationDialog
      ref="dialogHelp"
    />
    <OpenProjectDialog 
      ref="dialogOpenProject"
      @open-project="openProject"
      @import-project="importProject"
    />
  </div>
</template>

<script>
import StartScreen from "./components/StartScreen.vue";
import Editor from "./components/Editor.vue";
import DocumentationDialog from "./components/DocumentationDialog.vue";
import { nextTick } from '@vue/runtime-core';
import { options } from "./classes/Options";
import {Project} from "./classes/Project";
import OpenProjectDialog from "./components/OpenProjectDialog.vue";

import {version} from "../package.json";
import { CompileFunctions } from "./language/CompileFunctions";
import { Java } from "./language/java";
import { getTimestamp } from "./functions/getTimestamp";
import { loadLocally, saveLocally } from "./functions/helper";
import Extension from "./classes/Extension";

const STORAGE_KEY_DATA="JAVA-APP-DATA";

export default{
  data(){
    return {
      screen: 'start',
      version: version,
      paused: false,
      printMode: false,
      current: {line: -1, step: 0, name: null, $scope: {local: null, main: null, that: null}},
      difficulty: options.difficulty(),
      tryItMode: location.hash.indexOf("tryit")>=0,
      tryItName: null,
      exerciseMode: options.exerciseMode,
      exerciseCheckerCode: "",
      loggedData: [],
      loggingEnabled: true,
      extensions: [],
      extensionsCode: ""
    };
  },
  async mounted(){
    await this.loadData();
    let hash=location.hash;
    if(hash.indexOf("help")>=0){
      this.$refs.dialogHelp.setVisible(true);
    }
    if(hash.indexOf("tryit:")>=0){
      let text=hash.substring(7);
      let url=text.split(";")[0];
      if(!url) return;
      this.tryItName=url;
      let realUrl="https://thomaskl.uber.space/Sonstiges/java-app/examples/";
      realUrl+=url;
      fetch(realUrl).then((res)=>{
        res.text().then((code)=>{
          //alert(code);
          let p=new Project();
          p.fromSaveString(code);
          this.openProject(p);
        });
      }).catch((err)=>{
        alert(err);
      });
    }
    setInterval(()=>{
      this.sendExerciseData();
    },1000);
    this.emitEvent("ready");
  },
  methods: {
    showHelp(){
      this.$refs.dialogHelp.setVisible(true);
    },
    log(data,force){
      if(!force && !this.loggingEnabled) return;
      this.loggedData.splice(0,0,{
        time: getTimestamp(new Date()),
        data: data
      });
    },
    clearLog(){
      this.loggedData=[];
    },
    setLoggingEnabled(s){
      this.$root.log("logging enabled="+s,true);
      this.loggingEnabled=s;
    },
    sendExerciseData(){
      if(this.exerciseMode && window.parent){
        let project=this.getProject().toJSON();
        window.parent.postMessage({type: "send-exercise-data",data: {project}},"*");
      }
    },
    sendClassNames(){
      if(window.parent){
        let p=this.getProject();
        let names=[];
        if(p){
          for(let i=0;i<p.clazzes.length;i++){
            names.push(p.clazzes[i].name);
          }
        }
        window.parent.postMessage({type: "give-classnames-answer",data: names, id: window["javaappID"]},"*");
      }
    },
    getExtensionByName(name){
      for(let i=0;i<this.extensions.length;i++){
        let e=this.extensions[i];
        if(e.name===name){
          return e;
        }
      }
      return null;
    },
    removeExtension(ext){
      let index=this.extensions.indexOf(ext);
      if(index<0) return;
      this.removeExtensionAtIndex(index);
    },
    removeExtensionAtIndex(index){
      let ext=this.extensions[index];
      this.extensions.splice(index,1);
      this.saveData();
      ext.removeFromJava(Java);
      this.updateExtensions();
    },
    addExtension(e){
      this.extensions.push(e);
      this.saveData();
      this.updateExtensions();
    },
    updateExtensions(){
      this.extensionsCode="";
      for(let i=0;i<this.extensions.length;i++){
        let ext=this.extensions[i];
        this.extensionsCode+="\n"+ext.compile(Java);
      }
    },
    saveData(){
      let data={
        extensions: this.extensions
      };
      saveLocally(STORAGE_KEY_DATA,data);
    },
    async loadData(){
      let data=await loadLocally(STORAGE_KEY_DATA);
      if(!data) return;
      //console.log("loaded data",data);
      this.extensions=[];
      for(let i=0;i<data.extensions.length;i++){
        let e=data.extensions[i];
        let ext=new Extension(e.name,e.clazzes);
        ext.fromJSON(e);
        this.extensions.push(ext);
      }
      this.updateExtensions();
    },
    setVisibleSidebar(v){
      this.$refs.editor.setRightVisible(v);
    },
    setVisibleMenubar(v){
      this.$refs.editor.setMenubarVisible(v);
    },
    setVisibleRunButton(v){
      this.$refs.editor.setRunButtonVisible(v);
    },
    sendProject(){
      if(window.parent){
        let p=this.getProject();
        let data=p.toJSON();
        window.parent.postMessage({type: "give-project-answer",data: data, id: window["javaappID"]},"*");
      }
    },
    emitEvent(type, data){
      if(window.parent){
        window.parent.postMessage({event: true, type: type, data: data, id: window["javaappID"]},"*");
      }
    },
    sendFullAppCode(){
      if(window.parent){
        let p=this.getProject();
        let data=null;
        if(p){
          data=p.getFullAppCode("$App.hideConsoleIfUIPresentAfterSetup=true;",true);
        }
        window.parent.postMessage({type: "give-full-app-code-answer",data: data, id: window["javaappID"]},"*");
      }
    },
    sendToParentWindow(type, data){
      if(window.parent){
        window.parent.postMessage({type: type, data: data, id: window["javaappID"]},"*");
      }
    },
    switchToEmptyProject(){
      let p=new Project();
      this.openProject(p);
    },
    addClazz(clazzData){
      this.$refs.editor.addNewClazz(clazzData);
    },
    removeClazz(name){
      let p=this.getProject();
      if(!p) return;
      let c=p.getClazzByName(name);
      p.removeClazz(c);
    },
    handleExerciseTest(data){
      console.log("handle exercise test");
      if(this.exerciseMode && window.parent){
        data.project=this.getProject().toJSON();
        window.parent.postMessage({type: "submit-exercise",data: data},"*");
      }
    },
    setupExercise(data){
      console.log("setup exercise",data);
      if(data.project.constraints){
        let constraints=data.project.constraints;
        if(!constraints.java) constraints.java={};
        if(!constraints.clazzes) constraints.clazzes={};
        if(constraints.java.loops){
          constraints.java.ForStatement=true;
          constraints.java.WhileStatement=true;
          constraints.java.DoStatement=true;
          delete constraints.java.loops;
        }
        if(constraints.java.arrays){
          constraints.java.ArrayCreationExpression=true;
          constraints.clazzes.ArrayList=true;
          delete constraints.java.arrays;
        }
        console.log("constraints",constraints);
        for(let a in constraints.java){
          delete CompileFunctions.functions[a];
        }
        for(let a in constraints.clazzes){
          delete Java.datatypes[a];
          delete Java.clazzes[a];
        }
      }
      let p=new Project();
      p.fromJSON(data.project);
      if(data.project.clazzes && data.project.clazzes[0] && data.project.clazzes[0].name){
        options.exerciseMainClassName=data.project.clazzes[0].name;
      }
      this.openProject(p);
      this.exerciseCheckerCode=data.checker;
    },
    openProjectFromJSON(data){
      let p=new Project();
      p.fromJSON(data);
      this.openProject(p);
    },
    openProjectFromFullAppCode(code){
      let p=new Project();
      let ok=true;
      try{
        ok=p.fromSaveString(code);
      }catch(e){
        ok=false;
      }
      if(ok){
        this.openProject(p); 
      }
      if(window.parent){
        window.parent.postMessage({type: "open-project-from-full-app-code-answer",data: ok},"*");
      }
    },
    resetCurrent(line,name){
      if(!line) line=this.current.line;
      if(!name) name=this.current.name;
      let step=(this.current.step+1)%2;
      this.current={line, name, step, $scope: this.current.$scope};
    },
    showScreen: function(name){
      this.screen=name;
    },
    openProject: function(project){
      //Object.seal(project);
      this.$refs.editor.openProject(project);
      this.showScreen("editor");
      setTimeout(()=>{
        this.setLoggingEnabled(false);
      },1000);
      this.emitEvent("project-open");
    },
    importProject: function(project){
      this.$refs.editor.importToProject(project);
    },
    openProjectDialog(p){
      this.$refs.dialogOpenProject.open(p,true);
    },
    openProjectDialogWithoutImporting(p){
      this.$refs.dialogOpenProject.open(p,false);
    },
    getProject(){
      return this.$refs.editor.getProject();
    },
    getJavaScriptCode(){
      return this.$refs.editor.getProject().getJavaScriptCode();
    },
    updateBreakpoints(breakpointSet,document,clazz){
      var n=breakpointSet.size;
      var iter=breakpointSet.iter(0);
      let bp=[];
      for(let i=0;i<n;i++){
        let pos=iter.from;
        let line=document.lineAt(pos);
        bp.push({
          n: line.number,
          f: clazz.name
        });
        iter.next();
      }
      console.log("update breakpoints",bp);
      this.$refs.editor.setBreakpoints(bp);
    }
  },
  components: {
    StartScreen,
    Editor,
    DocumentationDialog,
    OpenProjectDialog
  }
}


</script>

<style>
#app {
  font-family: sans-serif;
}

</style>
