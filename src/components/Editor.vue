<template>  
  <div v-if="project" style="width: 100%;overflow: hidden" :style="{height: $root.printMode? '':'100%', display: 'flex', flexDirection: 'column'}">
    <PrintPreview
      :project="project"
      ref="printPreview"
    />
    <template v-if="!$root.printMode">
      <EditorMenubar
        :right-closed="rightClosed"
        :difficulty="difficulty"
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
        @help="$emit('help')"
        @database="$refs.dialogDatabase.setVisible(true)"
        @assets="$refs.dialogAssets.setVisible(true)"
        @details="$refs.dialogProjectDetails.setVisible(true)"
        @css="$refs.dialogCSS.setVisible(true)"
        @settings="$refs.dialogSettings.setVisible(true)"
        @print="$refs.printPreview.open()"
        @trash="trashCurrentClazz()"
        @play="resume()"
        @fullscreen="playInFullscreen()"
        @play-window="playInNewWindow(false)"
        @play-dev="playInNewWindow(true)"
        @terminal="$refs.dialogTerminal.setVisible(true)"
        @tryit="$refs.tryItDialog.setVisible(true)"
      />
      <LinksDialog
        ref="dialogResources"
      />
      <ImageEditorDialog ref="imageEditor"/>
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
      <AssetsDialog :project="project" ref="dialogAssets" @open-image-editor="asset=>$refs.imageEditor.open(asset)"/>
      <DatabaseDialog v-if="project" :database="project.database" ref="dialogDatabase"/>
      <CSSDialog :project="project" ref="dialogCSS"/>
      <TerminalDialog :project="project" ref="dialogTerminal" @run="stopAndPlay"/>
      <TryItDialog ref="tryItDialog"/>
      <Splitter :gutter-size="splitterSize" ref="splitter" @resizeend="handleResize" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
        <SplitterPanel :size="sizeCode" style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">        
          <TabView v-model:activeIndex="activeTab" :scrollable="true" class="editor-tabs" >
            <TabPanel v-for="(c,i) in project.clazzes" :key="'tab-'+i">
              <template #header>
                <span v-if="c.isInterface" class="pi pi-info-circle" style="font-size: small; margin-right: 0.2rem"/><span v-if="c.isHidden">(</span>{{i!==activeTab && c?.name?.length>10? c?.name?.substring(0,10)+"...":c?.name}} <span v-if="c.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span><span v-if="c.isHidden">)</span>
              </template>
              <template v-if="c.isHidden">
                Der Code dieser Klasse ist versteckt.
              </template>
              <template v-else>
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
                <CodeMirrorEditor
                  language="html"
                  v-model="c.src"
                  v-else-if="isSourceFile(c)"
                />
                <CodeMirror
                  v-else-if="isJava(c)"
                  :clazz="c"
                  :tab-index="i"
                  :disabled="paused"
                  :project="project"
                  :settings="settings"
                  :font-size="fontSize"
                  @recompilepreview="compileProjectAndUpdateUIPreview()"
                  :current="paused && i===activeTab ? current : null"
                  @caretupdate="updateCaretPosition"
                  ref="editor"
                />
              </template>
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
              <UIPreview 
                ref="uipreview" 
                v-show="!running && (isCurrentClazzUIClazz ||isCurrentClazzHtml)" 
                :ui-clazz="currentClazz"
                :selected-component="selectedUIComponent"
              />
              <AppPreview v-show="running || isJava(currentClazz)" :paused="paused" :breakpoints="breakpoints" :project="project" ref="preview"/>
            </SplitterPanel>
            <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
              <Insights 
                v-if="running"
                :line="current.line"
                :step="current.step"
                :clazz-name="current.name"
                :scope="current.$scope"
                :paused="paused"
                @update-scope="$refs.preview?.askForScope"
                @resume="resume()"
                @stop="stop()"
                @step="step()"
                @step-above="stepAbove()"
                @remove-breakpoints="removeAllBreakpoints()"
              />
              <UIComponentEditor 
                v-if="!running && showUIEditor && selectedUIComponent" 
                :component="selectedUIComponent"
                :project="project"
                :maximized="false"
                :settings="settings"
                @recompile="compileProjectAndUpdateUIPreview()"
                @isolatedupdate="compileUIClazzAndUpdatePreview()"
              />
              <Outline
                v-else-if="!running"
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
        <span  v-if="!running">
          <Button style="margin-right: 0.2rem" v-if="$root.exerciseCheckerCode && (!running || paused)" label="Prüfen" @click="runExerciseChecker()" icon="pi pi-list-check" />
          <Button v-if="!running || paused" @click="resume()" icon="pi pi-play" />
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
import UIPreview from "./UIPreview.vue";
import SettingsDialog from "./SettingsDialog.vue";
import { nextTick } from "vue";
import PrintPreview from "./PrintPreview.vue";
import ImageEditorDialog from "./ImageEditorDialog.vue";
import Insights from "./Insights.vue";
import TerminalDialog from "./TerminalDialog.vue";
import DocumentationDialog from "./DocumentationDialog.vue";
import TryItDialog from "./TryItDialog.vue";
import OpenProjectDialog from "./OpenProjectDialog.vue";
import { SourceFile } from "../classes/SourceFile.js";
import CodeMirrorEditor from "./CodeMirrorEditor.vue";

export default {
  props: {
    current: Object,
    paused: Boolean,
    difficulty: Number
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
      return this.$refs.editor[this.activeTab];
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
    isCurrentClazzHtml(){
      return this.isSourceFile(this.currentClazz)&&this.currentClazz.fileType==="html";
    },
    showUIEditor(){
      return (this.currentClazz && this.currentClazz instanceof UIClazz);
    }
  },
  mounted(){
    if(location.hash.indexOf("tryit")>=0){
      setTimeout(()=>{
        this.$refs.tryItDialog.setVisible(true);
      },1000);
      return;
    }
    if(this.$root.exerciseMode){
      return;
    }
    let timer=setInterval(()=>{
      if(!this.project) return;
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
  },
  methods: {
    async removeAllBreakpoints(){
      // let tab=this.activeTab;
      for(let i=0;i<this.$refs.editor.length;i++){
        console.log(i);
        let e=this.$refs.editor[i];
        if(e.removeAllBreakpoints){
          e.removeAllBreakpoints();
        }
      }
      // for(let i=0;i<this.project.clazzes.length;i++){
      //   this.activeTab=i;
      //   await nextTick();
      //   if(this.currentEditor){
      //     this.currentEditor.removeAllBreakpoints();
      //   }
      // }
      // this.activeTab=tab;
    },
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
      this.project.compile().then(()=>{
        this.currentEditor?.updateLinter();
      });
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
    openProjectDialog(p,allowImporting){
      this.$emit("open-project-dialog",p);
    },
    async openProject(p){
      //Object.seal(p);
      this.stop();
      this.clearRuntimeErrors();
      //this.database.clear();
      this.project=p;
      p.compile(true);
      setTimeout(()=>{
        this.compileProjectAndUpdateUIPreview();
        this.activeTab=0;
      },100);
      
    },
    importToProject(p){
      this.stop();
      this.clearRuntimeErrors();
      this.project.add(p);
      for(let i=0;i<p.clazzes.length;i++){
        let c=p.clazzes[i];
        let ed=this.getEditorByName(c.name);
        if(!ed) continue;
        console.log("set code",ed,c);
        ed.setCode(c.src);
      }
      this.project.compile();
    },
    getProject(){
      return this.project;
    },
    async createNewApp(name,code){
      let p=new Project(name,code);
      //this.database.clear();
      await p.initialize();
      await this.openProject(p);
      nextTick(()=>{
        this.prettifyCode();
      });
    },
    // playInNewWindow(includeDevTools){
    //   this.project.compile(false,true);
    //   let precode;
    //   if(includeDevTools){
    //     precode="$onAfterSetup=function(){$App.loadEruda();};\n";
    //   }else{
    //     precode="console.hideIfUI();\n";
    //   }
    //   let code=this.project.getFullAppCode(precode);
    //   const blob = URL.createObjectURL(
    //     new Blob([code], { type: "text/html" })
    //   );
    //   window.open(blob);
    //   URL.revokeObjectURL(blob);
    // },
    downloadProject(){
      if(this.project){
        try{
          this.project.compile(false,true);
        }catch(e){
          console.error(e);
        }
        //console.log("download",this.project.getFullAppCode("console.hideIfUI();",true).length);
        download(this.project.getFullAppCode("$App.hideConsoleIfUIPresentAfterSetup=true;",true),this.project.getName()+".html","text/html");
      }
    },
    async uploadProject(){
      //this.database.clear();
      let p=await uploadProject();
      this.openProjectDialog(p,true);
      //await this.openProject(p,this.useBlockEditor);
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
      this.$root.resetCurrent(-1);
      this.clearRuntimeErrors();
      this.running=true;
      this.$refs.preview.runInFullscreen();
    },
    playInNewWindow(includeDevTools){
      this.project.compile(false,true);
      let precode;
      if(includeDevTools){
        precode="$onAfterSetup=function(){$App.loadEruda();};\n";
      }else{
        precode="$App.hideConsoleIfUIPresentAfterSetup=true;\n";
      }
      let code=this.project.getFullAppCode(precode);
      //console.log("play",code.length);
      const blob = URL.createObjectURL(
        new Blob([code], { type: "text/html" })
      );
      window.open(blob);
      URL.revokeObjectURL(blob);
    },
    runExerciseChecker(){
      this.stop();
      this.$root.resetCurrent(-1);
      this.clearRuntimeErrors();
      this.running=true;
      this.$refs.preview.reload(false,null,`window.$exerciseChecker=async ()=>{${this.$root.exerciseCheckerCode}}`);
    },
    stopAndPlay(infos){
      this.stop();
      this.resume(infos.args);
    },
    resume(args){
      if(this.rightClosed){
        this.closeRightAfterStopping=true;
        this.toggleRight();
      }else{
        this.closeRightAfterStopping=false;
      }
      if(this.paused){
        this.$root.resetCurrent(-1);
        this.$root.paused=false;
        this.$refs.preview.resume();
        //this.$refs.controlArea.resume();
      }else{
        this.$root.resetCurrent(-1);
        if(!this.running){
          this.clearRuntimeErrors();
          this.running=true;
          this.$refs.preview.reload(false,args);
        }
      }
    },
    step(){
      //this.$root.resetCurrent();
      this.$refs.preview.step();
    },
    stepAbove(){
      //this.$root.resetCurrent();
      this.$refs.preview.stepAbove();
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
      this.$root.resetCurrent(-1);
    },
    addNewClazz(clazzData){
      let c;
      if(clazzData.type==='interface'){
        c=new Clazz(clazzData.name,this.project,true);
      }else if(clazzData.type==='uiclass'){
        c=new UIClazz(clazzData.name,this.project);
      }else if(clazzData.type==='class'){
        c=new Clazz(clazzData.name,this.project,false);
      }else if(clazzData.type==='html'||clazzData.type==="css"||clazzData.type==="js"){
        c=new SourceFile(clazzData.name,clazzData.type,this.project);
      }else{
        alert("Dieses Feature ist noch in Entwicklung");
        return;
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
    },
    isSourceFile(c){
      return (c instanceof SourceFile);
    },
    isJava(c){
      return (c instanceof Clazz);
    }
  },
  components: {
    EditorMenubar,
    CodeMirror,
    CodeMirrorEditor,
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
    ProjectDetailsDialog,
    ImageEditorDialog,
    Insights,
    TerminalDialog,
    DocumentationDialog,
    TryItDialog,
    OpenProjectDialog
  }
}
</script>

<style scoped>

</style>