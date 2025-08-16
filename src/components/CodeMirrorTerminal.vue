<template>
  <div id="root">
    <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px'}"></div>
    <Message v-if="runtimeError" closable severity="error" @close="runtimeError=null">Z{{runtimeError.line}}: {{runtimeError.error}}</Message>
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
import {gutter, GutterMarker} from "@codemirror/view"
import {Decoration,ViewPlugin} from "@codemirror/view"
import { oneDark } from '@codemirror/theme-one-dark';
import { nextTick } from '@vue/runtime-core';
import {createAutocompletion } from '../functions/cm/autocompletion';
import { parseJava } from '../functions/parseJava';
import { Method } from "../classes/Method";
import { Modifiers } from "../classes/Modifiers";

const languageConf=new Compartment();

const javaProgram=new LanguageSupport(javaLanguage.configure({top: "Program"}));

export default {
  props: {
    modelValue: String,
    clazz: Object,
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
      method: new Method(null),
    };
  },
  mounted(){
    this.method.modifiers=new Modifiers();
    let changed=false;
    let timer=null;
    let editorTheme=new Compartment();
    let extensions=[
      basicSetup,
      EditorView.lineWrapping,
      lintGutter(),
      editorTheme.of(oneDark),
      indentUnit.of("  "),
      languageConf.of(javaProgram),
      autocompletion({override: [createAutocompletion(this.method)]}),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((v) => {
        if(!v.docChanged) return;
        let code="{"+v.state.doc.toString()+";}";
        console.log(code);
        let ast=parseJava(code,true);
        if(!ast || !ast.topNode || !ast.topNode.firstChild) return;
        let node=ast.topNode.firstChild;
        console.log(node);
        this.method.bodyNode=node;
        this.method.clazz=this.clazz;
        this.$emit('update:modelValue', this.getCode());
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
    flex: 10;
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