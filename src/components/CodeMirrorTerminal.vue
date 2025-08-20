<template>
  <div id="root" style="overflow-y: visible; overflow-x: visible">
    <Message v-if="runtimeError" closable severity="error" @close="runtimeError=null">{{runtimeError}}</Message>
    <div style="display: flex">
      <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px', 'overflow-y': 'visible', 'overflow-x': 'visible'}"></div>
      <Button text icon="pi pi-angle-up" @click="toggleOldCommands"/>
      <Button text icon="pi pi-send" @click="sendConsolePrompt"/>
      <Popover ref="oldCommands">
        <Button fluid text style="font-family: monospace;" v-for="(h,i) in historyArray" :label="h" @click="insertPrompt(h)"/>
      </Popover>
    </div>
  </div>
  
</template>

<script>
import { EditorView, basicSetup } from "codemirror";
import { javaLanguage } from "@codemirror/lang-java";
import {LanguageSupport} from "@codemirror/language";
import { lintGutter, linter, openLintPanel, closeLintPanel } from "@codemirror/lint";
import {keymap} from "@codemirror/view";
import {indentWithTab,redo,undo} from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import {openSearchPanel,closeSearchPanel} from '@codemirror/search';
import {Compartment,EditorState} from '@codemirror/state';
import {autocompletion} from "@codemirror/autocomplete";
import {placeholder} from "@codemirror/view"
import { oneDark } from '@codemirror/theme-one-dark';
import {createAutocompletion } from '../functions/cm/autocompletion';
import { parseJava } from '../functions/parseJava';
import { Method } from "../classes/Method";
import { Modifiers } from "../classes/Modifiers";
import { Source } from "../classes/Source";
import { loadLocally, saveLocally } from "../functions/helper";
import { nextTick } from "vue";
import { Popover } from "primevue";

const languageConf=new Compartment();

const javaProgram=new LanguageSupport(javaLanguage.configure({top: "Program"}));

const STORAGE_HISTORY="JavaApp-Storage-Terminal-History";

export default {
  components: {
    Popover
  },
  props: {
    modelValue: String,
    clazz: Object,
    project: Object,
    terminalInfos: Object,
    settings: Object,
    fontSize: {
      type: Number,
      default: 20
    }
  },
  emits: ["update:modelValue","change","content-changed"],
  computed: {

  },
  data(){
    return {
      editor: null,
      errorID: 0,
      runtimeError: null,
      error: null,
      method: new Method(null),
      compiledCode: null,
      historyArray: [],
      selectedHistoryPrompt: null
    };
  },
  mounted(){
    this.loadHistory();
    this.method.modifiers=new Modifiers();
    this.method.thisString="$consolePromptThisObject";
    this.method.sysoutStatements=true;
    let editorTheme=new Compartment();
    let extensions=[
      EditorView.lineWrapping,
      placeholder("Anweisung eingeben..."),
      editorTheme.of(oneDark),
      indentUnit.of("  "),
      languageConf.of(javaProgram),
      autocompletion({override: [createAutocompletion(this.method,1)]}),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((v) => {
        if(!v.docChanged) return;
        this.runtimeError=null;
        let input=v.state.doc.toString().trim();
        if(!input.endsWith(";")) input+=";";
        let code="{"+input+"}";
        let ast=parseJava(code,true);
        if(!ast || !ast.topNode || !ast.topNode.firstChild) return;
        let node=ast.topNode.firstChild;
        console.log(node);
        this.method.bodyNode=node;
        this.method.clazz=this.clazz;
        let source=new Source(code,this.method.bodyNode,this.method.clazz);
        let res=this.method.compileBody(source,true);
        this.compiledCode=res.code;
        if(res.errors.length>0){
          this.error=res.errors[0];
        }else{
          this.error=null;
        }
        this.$emit('update:modelValue', input);
      }),
    ];
    this.editor=new EditorView({
      state: EditorState.create({
        doc: this.modelValue,
        extensions
      }),
      parent: this.$refs.editor
    });
    this.editor.component=this;
  },
  methods: {
    insertPrompt(p){
      this.setCode(p);
      this.$refs.oldCommands.hide();
    },
    toggleOldCommands(event) {
      this.$refs.oldCommands.toggle(event);
    },
    sendConsolePrompt(){
      let input=this.modelValue.trim();
      if(input.length===0 || input===";") return;
      let pos=this.historyArray.indexOf(input);
      if(pos<0){
        this.historyArray.push(input);
        if(this.historyArray.length>20){
          this.historyArray.pop();
        }
        this.saveHistory();
      }else if(pos<this.historyArray.length-1){
        this.historyArray.splice(pos,1);
        this.historyArray.push(input);
        this.saveHistory();
      }
      if(this.error){
        this.runtimeError=this.error;
        return;
      }
      this.runtimeError=null;

      this.$emit("send-prompt","$scope=new $Scope();\n"+this.compiledCode);
      this.setCode("");
      this.compiledCode="";
    },
    saveHistory(){
      saveLocally(STORAGE_HISTORY,this.historyArray);
    },
    async loadHistory(){
      let h=await loadLocally(STORAGE_HISTORY);
      if(h && Array.isArray(h)){
        this.historyArray=h;
      }
    },
    setCode(code){
      var old=this.editor.state.doc.toString();
      this.editor.dispatch({
        changes: {from: 0, to: old.length, insert: code}
      });
    },
    setRuntimeError(error){
      this.errorID++;
      if(error){
        this.runtimeError=error;
      }else{
        this.runtimeError=null;
      }
    },
    getCode(){
      return this.editor.state.doc.toString();
    },
    undo(){
      undo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    redo(){
      redo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    focus(){
      this.editor.focus();
    }
  }
}
</script>

<style scoped>
  #root{
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  #editor{
    flex: 1;
    overflow-y:auto;
    display: flex;
    flex-direction: column;
  }
  #errors{
    color: red;
  }
</style>

<style>
  .cm-editor{
    flex: 1;
  }
  #errors{
    font-family: monospace;
  }
  
</style>