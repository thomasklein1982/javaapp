<template>  
  <div v-if="project" style="width: 100%;overflow: hidden" :style="{height: $root.printMode? '':'100%', display: 'flex', flexDirection: 'column'}">
    <PrintPreview
      :project="project"
      ref="printPreview"
    />
    <template v-if="!$root.printMode">
      <EditorMenubar
        :right-closed="rightClosed"
        :is-easy="isEasy"
        :allow-trash="activeTab>0"
        :current-clazz="currentClazz"
        :caret-position="settings.showCaretPosition? caretPosition: -1"
        @download="downloadProject"
        @upload="uploadProject"
        @new="$refs.dialogNewApp.setVisible(true)"
        @prettify="prettifyCode"
        @rename="renameSelection"
        @compile="compileProject()"
        @toggle-comment="toggleComment()"
        @undo="currentEditor?.undo()"
        @redo="currentEditor?.redo()"
        @search="currentEditor?.openSearchPanel()"
        @lint="currentEditor?.toggleLintPanel()"
        @toggleright="toggleRight()"
        @resources="$refs.dialogResources.setVisible(true)"
        @database="$refs.dialogDatabase.setVisible(true)"
        @assets="$refs.dialogAssets.setVisible(true)"
        @details="$refs.dialogProjectDetails.setVisible(true)"
        @css="$refs.dialogCSS.setVisible(true)"
        @settings="$refs.dialogSettings.setVisible(true)"
        @print="$refs.printPreview.open()"
        @trash="trashCurrentClazz()"
        @play="resume()"
        @fullscreen="playInFullscreen()"
      />
      <LinksDialog
        ref="dialogResources"
      />
      <ProjectDetailsDialog
        ref="dialogProjectDetails"
        :project="project"
      />
      <SettingsDialog
        ref="dialogSettings"
        :font-size="fontSize"
        @changefontsize="changeFontSize"
        :settings="settings"
      />
      <NewAppDialog @newapp="createNewApp" ref="dialogNewApp"/>
      <AssetsDialog :project="project" ref="dialogAssets"/>
      <DatabaseDialog :database="database" ref="dialogDatabase"/>
      <CSSDialog :project="project" ref="dialogCSS"/>
      <Splitter :gutter-size="splitterSize" ref="splitter" @resizeend="handleResize" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
        <SplitterPanel :size="sizeCode" style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">        
          <TabView v-model:activeIndex="activeTab" :scrollable="true" class="editor-tabs" >
            <TabPanel v-for="(c,i) in project.clazzes" :key="'tab-'+i">
              <template #header>
                <span v-if="c.isInterface" class="pi pi-info-circle" style="font-size: small; margin-right: 0.2rem"/>{{i!==activeTab && c?.name?.length>10? c?.name?.substring(0,10)+"...":c?.name}} <span v-if="c.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span>
              </template>
              <UIEditor 
                v-if="isUIClazz(c)" 
                :clazz="c"
                :settings="settings"
                @select="updateSelectedUIComponent"
                @recompile="compileProjectAndUpdateUIPreview()"
                @isolatedupdate="compileUIClazzAndUpdatePreview()"
                ref="uiEditor"
              >
              </UIEditor>
              <CodeMirror
                v-else
                :clazz="c"
                :tab-index="i"
                :project="project"
                :settings="settings"
                :font-size="fontSize"
                :current="paused && i===activeTab ? current : null"
                @caretupdate="updateCaretPosition"
                ref="editor"
              />
            </TabPanel>
            <TabPanel>
              <template #header>
                &thinsp;<span class="pi pi-fw pi-plus"/>&thinsp;
              </template>
              <NewClazzWizard :project="project" @confirm="addNewClazz"/>
            </TabPanel>
          </TabView>
          
        </SplitterPanel>
        <SplitterPanel :size="100-sizeCode" style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">  
          <Splitter :gutter-size="splitterSize" layout="vertical" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
            <SplitterPanel style="overflow: hidden;">
              <UIPreview ref="uipreview" v-show="!running && isCurrentClazzUIClazz" :ui-clazz="currentClazz"/>
              <AppPreview v-show="running || !isCurrentClazzUIClazz" :paused="paused" :breakpoints="breakpoints" :project="project" ref="preview"/>
            </SplitterPanel>
            <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
              <UIComponentEditor 
                v-if="showUIEditor && selectedUIComponent" 
                :component="selectedUIComponent"
                :project="project"
                :maximized="false"
                :settings="settings"
                @recompile="compileProjectAndUpdateUIPreview()"
                @isolatedupdate="compileUIClazzAndUpdatePreview()"
              />
              <Outline
                v-else
                @click="outlineClick"
                :style="{flex: 1}" 
                ref="outline"
                :project="project"
              />
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
      <span style="position: fixed; bottom: 0.5rem; right: 0.5rem; z-index: 101">
        <span class="p-buttonset" v-if="running || !isCurrentClazzUIClazz">
          <Button class="p-button-lg" v-if="!running || paused" @click="resume()" icon="pi pi-play" />
          <Button class="p-button-lg" v-if="paused" @click="step()" icon="pi pi-arrow-right" />
          <Button class="p-button-lg" v-if="running" @click="stop()" icon="pi pi-times" />
        </span>
      </span>
    </template>
  </div>
</template>

<script>
import { Project } from "../classes/Project.js";
import { Clazz } from "../classes/Clazz.js";
import { UIClazz } from "../classes/UIClazz.js";
import EditorMenubar from "./EditorMenubar.vue";
import CodeMirror from "./CodeMirror.vue";
import BlockEditor from "./BlockEditor.vue";
import ProjectExplorer from './ProjectExplorer.vue';
import AppPreview from './AppPreview.vue';
import UIEditor from './UIEditor.vue';
import UIComponentEditor from "./UIComponentEditor.vue";
import NewClazzWizard from './NewClazzWizard.vue';
import Outline from './Outline.vue';
import { download, saveLocally, upload } from '../functions/helper.js';
import { STORAGE_PROJECT } from '../consts/strings.js';
import { uploadProject } from "../functions/uploadProject.js";
import LinksDialog from "./LinksDialog.vue";
import ProjectDetailsDialog from "./ProjectDetailsDialog.vue";
import NewAppDialog from "./NewAppDialog.vue";
import DatabaseDialog from "./DatabaseDialog.vue";
import CSSDialog from "./CSSDialog.vue";
import AssetsDialog from "./AssetsDialog.vue";
import {database} from "../classes/Database.js";
import UIPreview from "./UIPreview.vue";
import SettingsDialog from "./SettingsDialog.vue";
import { nextTick } from "vue";
import PrintPreview from "./PrintPreview.vue";


export default {
  props: {
    current: Object,
    paused: Boolean,
    isEasy: Boolean
  },
  data(){
    return {
      useBlockEditor: false,
      activeTab: 0,
      running: false,
      caretPosition: 0,
      project: null,
      fontSize: 20,
      settings: {
        optimizeCompiler: false,
        autoUpdateUI: true,
        showCaretPosition: false
      },
      breakpoints: [],
      sizeCode: 60,
      rightClosed: false,
      sizeCodeSaved: 60,
      closeRightAfterStopping: false,
      database: database,
      selectedUIComponent: null
    };
  },
  watch: {
    activeTab(nv,ov){
      if(this.$refs.editor && nv<this.$refs.editor.length){
        let ed=this.$refs.editor[nv];
        console.log("update linter");
        ed.updateLinter();
      }
      // if(this.$refs.uiEditor && nv<this.$refs.uiEditor.length){
      //   let ed=this.$refs.uiEditor[nv];
      //   console.log("update ui editor");
      //   ed.deselectComponent(true);
      // }
      this.selectedUIComponent=null;
    },
    sizeCode(nv,ov){
      if(nv!==ov){
        this.setSplitterSizes(nv);
      }
    },
    current(nv,ov){
      if(nv!==null){
        let name=nv.name;
        for(let i=0;i<this.project.clazzes.length;i++){
          let c=this.project.clazzes[i];
          if(c.name===name){
            this.activeTab=i;
            return;
          }
        }
      }
    }

  },
  computed: {
    currentEditor(){
      if(this.isCurrentClazzUIClazz) return null;
      let index=-1;
      for(let i=0;i<=this.activeTab;i++){
        let c=this.project.clazzes[i];
        if(!(c instanceof UIClazz)){
          index++;
        }
      }
      if(index>=0 && this.$refs && this.$refs.editor){
        return this.$refs.editor[index];
      }else{
        return null;
      }
    },
    splitterSize(){
      return 8;
    },
    currentClazz(){
      if(this.project.clazzes.length===0 || this.activeTab>=this.project.clazzes.length){
        return null;
      }
      return this.project.clazzes[this.activeTab];
    },
    isCurrentClazzUIClazz(){
      nextTick(()=>{
        if(this.settings.autoUpdateUI){
          this.updateUIPreview();
        }else{
          this.clearUIPreview();
        }
      });
      return this.isUIClazz(this.currentClazz);
    },
    showUIEditor(){
      return (this.currentClazz && this.currentClazz instanceof UIClazz);
    }
  },
  mounted(){
    let timer=setInterval(()=>{
      if(!this.project) return;
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
  },
  methods: {
    getEditorIndexByClazzName(name){
      if(!this.$refs.editor) return -1;
      let index=this.project.getClazzIndexByName(name);
      return index;
    },
    changeFontSize(newFontsize){
      this.fontSize=newFontsize;
    },
    compileProjectAndUpdateUIPreview(){
      this.compileProject();
      this.updateUIPreview();
    },
    compileUIClazzAndUpdatePreview(){
      this.currentClazz.compile();
      this.updateUIPreview();
    },
    updateUIPreview(){
      console.log("update preview")

      this.$refs.uipreview.reload();
    },
    clearUIPreview(){
      this.$refs.uipreview.clear();
    },
    compileProject(){
      this.project.compile();
      this.currentEditor?.updateLinter();
    },
    updateSelectedUIComponent(c){
      this.selectedUIComponent=c;
    },
    recompileOtherClazzes(index){
      console.log("recompile all but "+index);
      let t1=Date.now();
      for(let i=0;i<this.project.clazzes.length;i++){
        if(i!==index){
          let c=this.project.clazzes[i];
          c.compile(this.project);
        }
      }
      let t2=Date.now();
      console.log("other clazzes recompiled in "+(t2-t1)+"ms");
    },
    renameSelection(){
      let cm=this.$refs.editor[this.activeTab];
      let node=cm.getSelectedNode();
      if(!node || !node.parent) return;
      if(node.name==="VariableDeclarator"){

      }else if(node.name==="Definition"){
        if(node.parent.name==="ClassDeclaration"){
          console.log("kalsse")
        }else if(node.parent.name==="MethodDeclaration"){
          console.log("methode")
        }
      }
    },
    updateCaretPosition(pos){
      this.caretPosition=pos;
    },
    toggleComment(){
      let cm=this.$refs.editor[this.activeTab];
      cm.toggleComment();
    },
    toggleRight(){
      if(!this.rightClosed){
        this.sizeCodeSaved=this.sizeCode;
        this.sizeCode=100;
      }else{
        this.sizeCode=Math.max(10,this.sizeCodeSaved);
      }
      this.rightClosed=!this.rightClosed;
    },
    setSplitterSizes(left){
      let s=this.$refs.splitter;
      s.panelSizes=[left,100-left];
      let children = [...s.$el.children];
      let j=0;
      children.forEach((child, i) => {
        if(child.className.indexOf("p-splitter-panel")>=0){
          child.style.flexBasis = 'calc(' + s.panelSizes[j] + '% - ' + ((s.panels.length - 1) * s.gutterSize) + 'px)';
          j++;
        }
      });
      this.sizeCode=left;
    },
    handleResize(ev){
      this.sizeCode=ev.sizes[0];
      setTimeout(()=>{
        if(this.$refs.editor){
          for(let i=0;i<this.$refs.editor.length;i++){
            this.$refs.editor[i].adaptLayout();
          }
        }
      },2000);
    },
    setRuntimeError(error){
      let i=this.project.getClazzIndexByName(error.name);
      if(i>=0){
        for(let j=0;j<this.$refs.editor.length;j++){
          let editor=this.$refs.editor[j];
          if(editor.clazz.name===error.name){
            editor.setRuntimeError(error);
          }
        }
        if(this.running){
          this.activeTab=i;
        }
      }else{
        
      }
    },
    getEditorByName(name){
      let i=this.project.getClazzIndexByName(name);
      if(i>=0){
        return this.$refs.editor[i];
      }else{
        return null;
      }
    },
    setBreakpoints(breakpoints){
      this.$refs.preview.setBreakpoints(breakpoints);
    },
    openProject(p){
      this.stop();
      this.clearRuntimeErrors();
      this.project=p;
      p.compile(true);
    },
    getProject(){
      return this.project;
    },
    async createNewApp(name,code){
      let p=new Project(name,code);
      this.database.clear();
      await p.initialize();
      this.openProject(p);
      nextTick(()=>{
        this.prettifyCode();
      });
    },
    downloadProject(){
      if(this.project){
        download(this.project.getFullAppCode("",true),this.project.getName(),"text/html");
      }
    },
    async uploadProject(){
      this.database.clear();
      let p=await uploadProject();
      if(!p) return;
      this.openProject(p,this.useBlockEditor);
    },
    prettifyCode(){
      if(this.currentEditor){
        this.currentEditor.prettifyCode();
      }
    },
    clearRuntimeErrors(){
      if(!this.$refs || !this.$refs.editor) return;
      for(let i=0;i<this.$refs.editor.length;i++){
        this.$refs.editor[i].clearRuntimeErrors();
      }
    },
    playInFullscreen(){
      this.$root.resetCurrent();
      this.clearRuntimeErrors();
      this.running=true;
      this.$refs.preview.runInFullscreen();
    },
    resume(){
      if(this.rightClosed){
        this.closeRightAfterStopping=true;
        this.toggleRight();
      }else{
        this.closeRightAfterStopping=false;
      }
      this.$root.resetCurrent();
      
      if(this.paused){
        this.$root.paused=false;
        this.$refs.preview.resume();
        //this.$refs.controlArea.resume();
      }else if(!this.running){
        this.clearRuntimeErrors();
        this.running=true;
        this.$refs.preview.reload();
      }
    },
    step(){
      this.$root.resetCurrent();
      this.$refs.preview.step();
    },
    stop(){
      if(this.closeRightAfterStopping && !this.rightClosed){
        this.toggleRight();
      }
      if(this.$refs && this.$refs.preview){
        this.$refs.preview.stop();
      }
      this.$root.paused=false;
      this.running=false;
      this.$root.resetCurrent();
    },
    addNewClazz(clazzData){
      if(clazzData.type==='interface'){
        var c=new Clazz(clazzData.name,this.project,true);
      }else if(clazzData.ui){
        var c=new UIClazz(clazzData.name,this.project);
      }else{
        var c=new Clazz(clazzData.name,this.project,false);
      }
      this.project.addClazz(c);
    },
    trashCurrentClazz(){
      if(!this.currentClazz || this.activeTab===0){
        return;
      }
      let a=confirm("Willst du die Klasse '"+this.currentClazz.name+"' wirklich löschen?");
      if(a){
        this.project.removeClazz(this.currentClazz);
      }
    },
    outlineClick(){

    },
    isUIClazz(c){
      return (c instanceof UIClazz);
    }
  },
  components: {
    EditorMenubar: EditorMenubar,
    CodeMirror,
    BlockEditor,
    ProjectExplorer,
    Outline,
    AppPreview,
    NewClazzWizard,
    LinksDialog,
    NewAppDialog,
    DatabaseDialog,
    AssetsDialog,
    UIEditor,
    UIComponentEditor,
    UIPreview,
    CSSDialog,
    SettingsDialog,
    PrintPreview,
    ProjectDetailsDialog
  }
}
</script>

<style scoped>

</style>