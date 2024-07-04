<template>
  <div style="width: 100%;overflow: hidden;" :style="{position: $root.printMode? '':'fixed', height: $root.printMode? '':'100%'}">
    <StartScreen 
      v-if="screen==='start'"
      :difficulty="difficulty"
      @open-project="openProject"
    />
    <Editor
      v-show="screen==='editor'"
      :paused="paused"
      :current="current"
      :difficulty="difficulty"
      ref="editor"
      @help="$refs.dialogHelp.setVisible(true)"
    />
    <DocumentationDialog
      ref="dialogHelp"
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

export default{
  data(){
    return {
      screen: 'start',
      version: 343,
      paused: false,
      printMode: false,
      current: {line: -1, step: 0, name: null, $scope: {local: null, main: null, that: null}},
      difficulty: options.difficulty(),
      tryItMode: location.hash.indexOf("tryit")>=0,
      tryItName: null,
    };
  },
  mounted(){
    let hash=location.hash;
    console.log(hash);
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
        // const reader = res.body.getReader();
        // reader.read().then((obj)=>{
        //   const utf8Decoder = new TextDecoder("utf-8");
        //   let code = obj.value ? utf8Decoder.decode(obj.value) : "";
        //   console.log(code);
        //   let p=new Project();
        //   p.fromSaveString(code).then(()=>{
        //     this.openProject(p);
        //   });
        // }).catch((err)=>{
        //   console.log(err);
        // });
      }).catch((err)=>{
        alert(err);
      });
    }
  },
  methods: {
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
    DocumentationDialog
  }
}


</script>

<style>
#app {
  font-family: sans-serif;
}

</style>
