<template>
  <div style="width: 100%;overflow: hidden;" :style="{position: $root.printMode? '':'fixed', height: $root.printMode? '':'100%'}">
    <StartScreen 
      v-if="screen==='start'"
      :is-easy="isEasy"
      @open-project="openProject"
    />
    <Editor
      v-show="screen==='editor'"
      :paused="paused"
      :current="current"
      :is-easy="isEasy"
      ref="editor"
    />
    
  </div>
</template>

<script>
import StartScreen from "./components/StartScreen.vue";
import Editor from "./components/Editor.vue";
import { nextTick } from '@vue/runtime-core';
import { options } from "./classes/Options";

export default{
  data(){
    return {
      screen: 'start',
      version: 255,
      paused: false,
      printMode: false,
      current: {line: -1, name: null},
      isEasy: options.isEasyMode()
    };
  },
  methods: {
    resetCurrent(){
      this.current={line: -1, name: this.current.name};
    },
    showScreen: function(name){
      this.screen=name;
    },
    openProject: function(project){
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
    Editor
  }
}


</script>

<style>
#app {
  font-family: sans-serif;
}

</style>
