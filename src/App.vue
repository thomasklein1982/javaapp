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
      @help="$refs.dialogHelp.setVisible(true)"
      @open-project-dialog="openProjectDialog"
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
      exerciseCheckerCode: ""
    };
  },
  mounted(){
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
  },
  methods: {
    sendExerciseData(){
      if(this.exerciseMode && window.parent){
        let project=this.getProject().toJSON();
        window.parent.postMessage({type: "send-exercise-data",data: {project}},"*");
      }
    },
    handleExerciseTest(data){
      console.log("handle exercise test");
      if(this.exerciseMode && window.parent){
        data.project=this.getProject().toJSON();
        window.parent.postMessage({type: "submit-exercise",data: data},"*");
      }
    },
    setupExercise(data){
      if(data.project.constraints){
        let constraints=data.project.constraints;
        if(constraints.loops){
          constraints.ForStatement=true;
          constraints.WhileStatement=true;
          constraints.DoStatement=true;
          delete constraints.loops;
        }
        console.log("constraints",constraints);
        for(let a in constraints){
          delete CompileFunctions.functions[a];
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
      console.log("open project",project);
      this.$refs.editor.openProject(project);
      this.showScreen("editor");
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
