<template>
  <div v-if="project" style="width: 100%;overflow:hidden" :style="{height: $root.printMode? '':'100%', display: 'flex', flexDirection: 'column'}">
    <PrintPreview
      :project="project"
      ref="printPreview"
    />
    <template v-if="!$root.printMode">
      <EditorMenubar
        v-if="showMenubar"
        :right-closed="rightClosed"
        :project="project"
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
        @logging="$refs.dialogLogging.setVisible(true)"
        @storage="$refs.dialogStorage.setVisible(true)"
        @tryit="$refs.tryItDialog.setVisible(true)"
        @extensions="$refs.dialogExtensions.setVisible(true)"
        @showfiles="openFileDrawer()"
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
      <LoggingDialog ref="dialogLogging" :data="loggedData"/>
      <NewAppDialog @newapp="createNewApp" ref="dialogNewApp"/>
      <AssetsDialog :project="project" ref="dialogAssets" @open-image-editor="asset=>$refs.imageEditor.open(asset)"/>
      <DatabaseDialog v-if="project" :database="project.database" ref="dialogDatabase"/>
      <CSSDialog :project="project" ref="dialogCSS"/>
      <ExtensionManagerDialog :project="project" ref="dialogExtensions"/>
      <TerminalDialog :project="project" ref="dialogTerminal" @run="stopAndPlay"/>
      <StorageDialog :project="project" ref="dialogStorage"/>
      <SourceFileSettingsDialog ref="dialogSourceFileSettings" :project="project"/>
      <TryItDialog ref="tryItDialog"/>
      <div style="display: flex; flex: 1; height: 1%"><!--TODO: Ist das so richtig??-->
        <div id="actionButtons" style="overflow: auto">
          <div><Button title="Dateimanager" :label="showActionButtonLabels?'Dateimanager':''" icon="pi pi-copy" @click="openFileDrawer()" text size="large"/></div>
          <div v-if="!webMode">
            <Button v-if="!running||paused" title="Ausführen (F2)" :label="showActionButtonLabels?'Ausführen (F2)':''" :disabled="!showRunButton" @click="resume()" icon="pi pi-play" size="large" text />
            <Button v-else title="Anhalten (F2)" :label="showActionButtonLabels?'Anhalten (F2)':''" :disabled="!showRunButton" @click="stop()" icon="pi pi-times" size="large" text />
          </div>
          <div><Button title="Formatieren" :label="showActionButtonLabels?'Code Formatieren':''" :disabled="!((!running || paused))" @click="prettifyCode()" icon="pi pi-align-left" size="large" text /></div>
          <div><Button title="Kommentar umschalten" @click="toggleComment()" size="large" text>
            <span class="p-button-icon p-button-icon-left" data-pc-section="icon">//</span><span v-if="showActionButtonLabels" class="p-button-label" data-pc-section="label">Kommentar umschalten</span>
          </Button></div>
          <div><Button title="Suchen/Ersetzen" :label="showActionButtonLabels?'Suchen/Ersetzen':''" @click="currentEditor?.toggleSearchPanel()" icon="pi pi-search" size="large" text /></div>
          <div><Button title="Fehler anzeigen" :label="showActionButtonLabels?'Fehler anzeigen':''" @click="currentEditor?.toggleLintPanel()" icon="pi pi-exclamation-circle" size="large" text /></div>
          <div><Button title="Kompilieren" v-if="!webMode" :label="showActionButtonLabels?'Kompilieren':''" @click="compileProject()" icon="pi pi-forward" size="large" text /></div>
          <div><Button title="Labels umschalten" :label="showActionButtonLabels?'Labels ausblenden':''" @click="showActionButtonLabels=!showActionButtonLabels" icon="pi pi-question" size="large" text /></div>
        </div>
        <Splitter :gutter-size="splitterSize" ref="splitter" @resizeend="handleResize" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
          <SplitterPanel :size="sizeCode" style="overflow: hidden; height: 100%" :style="{display: 'flex', flexDirection: 'column'}">
            <Tabs v-model:value="activeTab" :scrollable="true" class="editor-tabs" >
              <TabList>
                <template v-for="(c,i) in project.clazzes">
                  <Tab :value="i" v-if="i>0 || !webMode" v-show="c.isEditorShown && !c.isHidden">
                    <span v-if="c.isInterface" class="pi pi-info-circle" style="font-size: small; margin-right: 0.2rem"/><span v-if="c.isHidden">(</span>{{i!==activeTab && c?.name?.length>20? c?.name?.substring(0,17)+"...":c?.name}}{{ c.fileType!==undefined? "."+c.fileType:"" }} <span v-if="c.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span><Button v-if="activeTab===i" @click="hideEditor(i)" style="height: auto; padding:0" icon="pi pi-times-circle" rounded text severity="secondary" size="small"/><span v-if="c.isHidden">)</span>
                  </Tab>
                </template>
              </TabList>
              <TabPanels>
                <template v-for="(c,i) in project.clazzes" :key="'tab-'+i">
                  <TabPanel :value="i" v-if="i>0 || !$root.webMode">
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
                        ref="editor"
                      >
                      </UIEditor>
                      <div v-else :style="{position: 'relative', flex: 1, display: 'flex', 'flex-direction': 'column', 'overflow': 'auto'}">
                        <template v-if="isSourceFile(c)">
                          <CodeMirrorEditor
                            :language="c.fileType"
                            v-model="c.src"
                            :name="c.name"
                            :file="c"
                            :settings="settings"
                            :font-size="fontSize"
                            ref="editor"
                            @content-changed="updateUIPreview()"
                          />
                        </template>
                        <template v-else-if="isPeggyParser(c)">
                          <CodeMirrorEditor
                            :clazz="c"
                            v-model="c.src"
                            :tab-index="i"
                            :disabled="paused"
                            :project="project"
                            :settings="settings"
                            :font-size="fontSize"
                            :current="i===activeTab ? current : null"
                            @caretupdate="updateCaretPosition"
                            ref="editor"
                          />
                        </template>
                        <template v-else-if="isJava(c)">
                          <CodeMirror
                            :clazz="c"
                            :tab-index="i"
                            :disabled="paused"
                            :project="project"
                            :settings="settings"
                            :font-size="fontSize"
                            @recompilepreview="compileProjectAndUpdateUIPreview()"
                            @showCommandCountDialog="showCommandCountDialog()"
                            :current="i===activeTab ? current : null"
                            @caretupdate="updateCaretPosition"
                            ref="editor"
                          />
                        </template>
                        <div style="position: absolute; right: 0.2rem; top: 0.2rem;">
                          <template v-if="isSourceFile(c)">
                            <Button @click="compileProjectAndUpdateUIPreview()" icon="pi pi-refresh"/>
                            <Button icon="pi pi-cog" @click="$refs.dialogSourceFileSettings.open(c)" />
                          </template>
                        </div>
                      </div>
                      
                    </template>
                  </TabPanel>
                </template>
              </TabPanels>
            </Tabs>
          </SplitterPanel>
          <SplitterPanel :size="100-sizeCode" style="overflow: hidden; height: 100%" :style="{display: rightClosed? 'none': 'flex', flexDirection: 'column'}">
            <Splitter :gutter-size="splitterSize" layout="vertical" :style="{flex: 1}" style="overflow: hidden;width: 100%;">
              <SplitterPanel style="overflow: hidden;">
                <UIPreview 
                  ref="uipreview" 
                  v-show="!running && (isCurrentClazzUIClazz ||isCurrentClazzHtml)" 
                  :ui-clazz="currentClazz"
                  :selected-component="selectedUIComponent"
                  :project="project"
                />
                <div v-if="!running && currentClazz?.isPeggyParser" style="white-space: pre-wrap; width: 100%; height: 100%; overflow: auto;">
                  {{ peggy.message }}
                </div>
                <AppPreview 
                  v-show="showAppPreviewWhenNotRunning || running || isJava(currentClazz)" 
                  :paused="paused" 
                  :breakpoints="breakpoints" 
                  :project="project" 
                  ref="preview"
                />
              </SplitterPanel>
              <SplitterPanel v-if="!$root.webMode" style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
                <template v-if="currentClazz.isPeggyParser &&!running">
                  <CodeMirrorEditor
                    v-model="peggy.testString"
                  />
                  <Button @click="testPeggyString()" label="Parsen"/>
                </template>
                <template v-else>
                  <Insights 
                    v-if="running"
                    ref="insights"
                    :project="project"
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
                    @send-console-prompt="sendConsolePrompt"
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
                </template>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
      </div>
      
      <span v-if="!webMode" style="position: fixed; bottom: 0.5rem; right: 0.5rem; z-index: 101">
        <span  v-if="!running">
          <Button style="margin-right: 0.2rem" v-if="project.exerciseData?.seed && (!running || paused)" label="Neuer Testfall" @click="createNewDemoCase()" icon="pi pi-refresh" />
          <Button style="margin-right: 0.2rem" v-if="$root.exerciseCheckerCode && (!running || paused)" label="Ausführen" @click="resume()" icon="pi pi-play" />
          <Button style="margin-right: 0.2rem" v-if="$root.exerciseCheckerCode && (!running || paused)" label="Prüfen" @click="runExerciseChecker()" icon="pi pi-list-check" />
          
        </span>
      </span>
    </template>
    <FileDrawer 
      ref="fileDrawer" 
      :project="project"
      @open-file="setActiveTab"
      @hide="updateActiveTab"
      @add-file="showNewClazzDialog=true"
    />
    <Dialog header="Neue Datei" v-model:visible="showNewClazzDialog">
      <NewClazzWizard :project="project" @confirm="addNewClazz"/>
    </Dialog>
    <Dialog :header="dialog.header" v-model:visible="dialog.show">{{ dialog.content }}</Dialog>
    <Dialog header="Was sind Befehle?" v-model:visible="showCommandHelpDialog">
      Bei manchen Aufgaben darfst du nur eine gewisse Anzahl von <em>Befehlen</em> verwenden. Was aber ist ein Befehl?
      <p>Mit <em>Befehl</em> ist hier der Aufruf einer Methode gemeint.</p>
      <p>Zum Beispiel ist <code class="code">System.out.println( "Hallo" );</code> ein Befehl, weil die Methode <code class="code">println</code> des Objekts <code class="code">System.out</code> aufgerufen wird.</p>
      <p>Im Gegensatz dazu ist <code class="code">int x = 5;</code> <em>kein</em> Befehl.</p>
    </Dialog>
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
import { Menu, Tab, TabList, TabPanel, TabPanels, Tabs } from "primevue";
import SourceFileSettingsDialog from "./SourceFileSettingsDialog.vue";
import LoggingDialog from "./LoggingDialog.vue";
import StorageDialog from "./StorageDialog.vue";
import ExtensionManagerDialog from "./ExtensionManagerDialog.vue";
import { mimes } from "../consts/mimes.js";
import FileDrawer from "./FileDrawer.vue";
import { random, RandomClazz } from "../functions/random.js";
import { PeggyParser } from "../classes/PeggyParser.js";

export default {
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
    OpenProjectDialog,
    Tabs,
    TabList,
    TabPanels,
    TabPanel,
    Tab,
    SourceFileSettingsDialog,
    LoggingDialog,
    StorageDialog,
    ExtensionManagerDialog,
    FileDrawer,
    Menu
  },
  props: {
    current: Object,
    paused: Boolean,
    difficulty: Number,
    loggedData: Object
  },
  data(){
    return {
      peggy: {
        message: "",
        testString: "",
      },
      useBlockEditor: false,
      showActionButtonLabels: false,
      activeTab: this.$root.webMode? 1: 0,
      currentEditor: null,
      showNewClazzDialog: false,
      webMode: this.$root.webMode,
      running: false,
      caretPosition: 0,
      project: null,
      showAppPreviewWhenNotRunning: false,
      fontSize: 20,
      settings: {
        optimizeCompiler: false,
        autoUpdateUI: true,
        showCaretPosition: false
      },
      breakpoints: [],
      sizeCode: 60,
      rightClosed: false,
      showMenubar: true,
      showRunButton: true,
      closeRightAfterStopping: false,
      selectedUIComponent: null,
      dialog: {
        header: "",
        content: ""
      },
      showCommandHelpDialog: false
    };
  },
  watch: {
    activeTab(nv,ov){
      this.handleTabChange(nv);
      
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
    // currentEditor(){
    //   let index=this.activeTab-(this.webMode? 1:0);
    //   return this.$refs.editor[index];
    // },
    splitterSize(){
      if(this.rightClosed) return 0;
      return 8;
    },
    currentClazz(){
      if(!this.project) return null;
      if(this.project.clazzes.length===0 || this.activeTab>=this.project.clazzes.length){
        return null;
      }
      let c=this.project.clazzes[this.activeTab];
      c.isEditorShown=true;
      return c;
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
      if(!this.project || this.running) return;
      saveLocally(STORAGE_PROJECT,this.project.toSaveString());
    },1000);
  },
  methods: {
    testPeggyString(){
      let c=this.checkPeggyGrammar();
      if(c===null) return;
      let funcName=this.currentClazz.getParseFunctionName();
      let pos=c.indexOf("function "+funcName);
      c=c.substring(pos);
      let f=new Function("return "+c+";");
      f=f();
      this.peggy.message="Grammatik ist in Ordnung\n";
      try{
        let res=f(this.peggy.testString);
        console.log(res);
        window.testString=this.peggy.testString;
        function rep(key,value){
          console.log(this,key,value);
          if(Array.isArray(value)) return value;
          if(value.name!==undefined) return {
            i: "L"+value.line+": "+value.name+" ["+value.start+":"+value.end+"]",
            t: window.testString.substring(value.start,value.end),
            c: value.children
          };
          return value;
        }
        this.peggy.message+=JSON.stringify(res,rep, "  ");
      }catch(e){
        this.peggy.message+="Fehler beim Parsen des Test-Strings:\n"+JSON.stringify(e,null," ");
      }
    },
    checkPeggyGrammar(){
      try{
        let c=this.currentClazz.getParseFunctionCode();
        this.peggy.message="Keine Fehler";
        return c;
      }catch(e){
        this.peggy.message=e;
        return null;
      }
    },
    handleTabChange(nv){
      this.$root.emitEvent("tab-change",{index: nv});
      let c=this.project.clazzes[nv];
      let index=nv-(this.webMode? 1:0);
      this.currentEditor=this.$refs.editor[index];
      if(c) c.isEditorShown=true;
      if(this.$refs.editor && nv<this.$refs.editor.length){
        let ed=this.$refs.editor[nv];
        if(!ed.updateLinter) return;
        ed.updateLinter();
      }
      this.selectedUIComponent=null;
    },
    triggerInsightsUpdateScope(){
      if(!this.$refs.insights) return;
      this.$refs.insights.updateScope();
    },
    openDialog(header,content){
      this.dialog.header=header;
      this.dialog.content=content;
      this.dialog.show=true;
    },
    showCommandCountDialog(){
      this.showCommandHelpDialog=true;
    },
    hideEditor(index){
      let c=this.project.clazzes[index];
      c.isEditorShown=false;
      if(index===this.activeTab){
        setTimeout(()=>{
          this.updateActiveTab(index);
        },10);
      }
    },
    setActiveTab(index){
      this.activeTab=index;
      this.$forceUpdate();
    },
    setActiveTabToFirstVisibleFile(){
      let start=this.webMode? 1:0;
      for(let i=start;i<this.project.clazzes.length;i++){
        let c=this.project.clazzes[i];
        if(c.isEditorShown) {
          this.activeTab=i;
          this.handleTabChange(this.activeTab);
          return;
        }
      }
      this.activeTab=start;
      let c=this.project.clazzes[this.activeTab];
      if(c) c.isEditorShown=true;
      this.handleTabChange(this.activeTab);
    },
    updateActiveTab(startTab){
      if(startTab===undefined) return;
      for(let i=startTab;i<this.project.clazzes.length;i++){
        let c=this.project.clazzes[i];
        if(c.isEditorShown) {
          this.activeTab=i;
          return;
        }
      }
      this.setActiveTabToFirstVisibleFile();
    },
    downloadCurrentClazz(){
      let c=this.currentClazz;
      if(!c) return;
      download(c.src,c.getFileName(),mimes[c.getFileExtension()]);
    },
    removeCurrentClazz(){
      let a=confirm("Willst du die Datei "+this.currentClazz.name+" wirklich löschen?");
      if(!a) return;
      this.project.removeClazz(this.currentClazz);
    },
    setCurrentClazz(name){
      if(!this.project) return;
      for(let i=0;i<this.project.clazzes.length;i++){
        let c=this.project.clazzes[i];
        if(c.name===name){
          this.activeTab=i;
          return;
        }
      }
    },
    async sendConsolePrompt(prompt,currentClazz,mainClazz){
      this.$refs.preview.sendMessage({type: "console-prompt", prompt: prompt, useMainClazz: currentClazz===mainClazz});
    },
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
      this.$refs.uipreview.reload();
    },
    clearUIPreview(){
      this.$refs.uipreview.clear();
    },
    compileProject(){
      this.project.compile().then(()=>{
        this.$root.log("editor.compileProject");
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
      //let cm=this.$refs.editor[this.activeTab];
      this.currentEditor?.toggleComment();
    },
    openFileDrawer(){
      this.$refs.fileDrawer.open(this.activeTab);
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
    setRightVisible(v){
      if(this.rightClosed!==v) return;
      this.toggleRight();
    },
    setMenubarVisible(v){
      this.showMenubar=v;
    },
    setRunButtonVisible(v){
      this.showRunButton=v;
    },
    setSplitterSizes(left){
      return;
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
    setSourceFileError(error){
      let i=this.project.getClazzIndexByName(error.file);
      if(i>=0){
        for(let j=0;j<this.$refs.editor.length;j++){
          let editor=this.$refs.editor[j];
          if(editor.name===error.file){
            editor.setRuntimeError(error);
          }
        }
      }
    },
    setRuntimeError(error){
      let editor=this.getEditorByName(error.name);
      if(!editor) editor=this.currentEditor;
      
      if(this.running){
        let i=this.project.getClazzIndexByName(error.name);
        if(i<0) i=0;
        if(this.project.clazzes[i].isHidden){
          editor.setRuntimeError(error);
          return;
        }
        if(i>=0) this.activeTab=i;
        nextTick(()=>{
          this.currentEditor.setRuntimeError(error);
        });
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
      await p.compile(true);
      //info-trainer-exercises: showAppPreviewWhenNotRunning (bee)
      let mainClazz=p.getClazzByName("Main");
      if(p.exerciseData){
        if(p.exerciseData.showAppPreviewWhenNotRunning){
          this.showAppPreviewWhenNotRunning=true;
          this.stop();
        }
      }
      setTimeout(()=>{
        let sfedits=this.$refs.editor;
        if(sfedits){
          for(let i=0;i<sfedits.length;i++){
            let ed=sfedits[i];
            if(ed.file){
              ed.setCode(ed.file.src);
            }
          }
        }
        this.compileProjectAndUpdateUIPreview();
        this.setActiveTabToFirstVisibleFile();
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
      if(import.meta.env.MODE==="web"){
        try{
          await this.openProject(p);
        }catch(e){
          console.log(e);
          this.openProjectDialog(p,true);
        }
      }else{
        this.openProjectDialog(p,true);
      }
    },
    prettifyCode(){
      if(this.currentEditor && this.currentEditor.prettifyCode){
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
    createNewDemoCase(){
      if(this.project.exerciseData.seedChange){
        this.project.exerciseData.seed+=this.project.exerciseData.seedChange;
      }else{
        this.project.exerciseData.seed=random(1000,100000);
      }
      if(this.showAppPreviewWhenNotRunning){
        this.$refs.preview.reload(true,null,"window.$showPreviewOnly=true;");
      }
    },
    runExerciseChecker(){
      this.stop();
      this.$root.resetCurrent(-1);
      this.clearRuntimeErrors();
      for(let i=0;i<this.project.clazzes.length;i++){
        let c=this.project.clazzes[i];
        if(c.hasTooManyStatements()){
          alert("Zu viele Befehle (Methodenaufrufe)");
          this.$root.handleExerciseTest({resArray: []});
          return;
        }
      }
      this.running=true;
      this.$refs.preview.reload(false,null,`window.isChecking=true;window.$exerciseChecker=async ()=>{${this.$root.exerciseCheckerCode}};`);
    },
    stopAndPlay(infos){
      this.stop();
      this.resume(infos.args);
    },
    toggleRun(){
      if(this.running){
        this.stop();
      }else{
        this.resume();
      }
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
      if(this.showAppPreviewWhenNotRunning){
        this.$refs.preview.reload(true,null,"window.$showPreviewOnly=true;");
      }
    },
    addNewClazz(clazzData){
      let c;
      if(clazzData.type==='interface'){
        c=new Clazz(clazzData.name,this.project,true);
      }else if(clazzData.type==='uiclass'){
        c=new UIClazz(clazzData.name,this.project);
      }else if(clazzData.type==='class'){
        c=new Clazz(clazzData.name,this.project,false);
      }else if(clazzData.type==='html'||clazzData.type==="css"||clazzData.type==="js"||clazzData.type==="txt"){
        c=new SourceFile(clazzData.name,clazzData.type,this.project);
      }else if(clazzData.type==='peg'){
        c=new PeggyParser(clazzData.name,this.project);
      }else{
        alert("Dieses Feature ist noch in Entwicklung");
        return;
      }
      this.project.addClazz(c);
      this.$root.emitEvent("new-class",{name: c.name});
      this.showNewClazzDialog=false;
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
    isPeggyParser(c){
      return (c instanceof PeggyParser);
    },
    isJava(c){
      return (c instanceof Clazz);
    }
  }
}
</script>

<style scoped>
.editor-tabs .p-tab{
  padding: 0.5rem;
}
#actionButtons{
  background-color: rgb(36, 36, 52);
}
.code{
  border: 1pt solid orange;
  font-family: monospace monospace;
  background-color: white;
  color: darkblue;
}
</style>