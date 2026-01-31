<template>
  <div id="root">
    <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px'}"></div>
    <Message v-if="runtimeError" closable severity="error" @close="runtimeError=null">Z{{runtimeError.line}}: {{runtimeError.error}}</Message>
  </div>
  
</template>

<script>
import { EditorView, basicSetup } from "codemirror";
import { css, cssCompletionSource } from "@codemirror/lang-css";
import {html} from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { sql } from "@codemirror/lang-sql";
import { lintGutter, openLintPanel, closeLintPanel } from "@codemirror/lint";
import {keymap} from "@codemirror/view";
import {indentWithTab,redo,toggleComment,undo} from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import {openSearchPanel,closeSearchPanel} from '@codemirror/search';
import {Compartment,EditorState} from '@codemirror/state';
import {autocompletion} from "@codemirror/autocomplete";
import { oneDark } from '@codemirror/theme-one-dark';
// import prettier from "prettier";
//import esTreePlugin from "prettier/plugins/estree";
//import acorn from "prettier/plugins/acorn";
//import {Parser as acorn} from "acorn";
// import htmlPlugin from "prettier/plugins/html";
// import cssPlugin from "prettier/plugins/postcss";


export default {
  props: {
    file: Object,
    language: String,
    modelValue: String,
    settings: Object,
    fontSize: {
      type: Number,
      default: 20
    },
    name: {
      type: String,
      default: null
    }
  },
  emits: ["update:modelValue","change","content-changed"],
  computed: {
    languagePlugins(){
      if(this.language==="html"){
        return {
          language: html(),//{autoCloseTags: true}),//.language,
          completionSource: null//htmlCompletionSource
        };
      }else if(this.language==="css"){
        return {
          language: css().language,
          completionSource: cssCompletionSource
        };
      }else if(this.language==="javascript"||this.language==="js"){
        return {
          language: javascript(),
          completionSource: null
        }
      }else if(this.language==="sql"){
        console.log("sql",sql)
        return {
          language: sql(),
          completionSource: null
        }
      }
    }
  },
  data(){
    return {
      editor: null,
      errorID: 0,
      runtimeError: null
    };
  },
  mounted(){
    let changed=false;
    let timer=null;
    let editorTheme=new Compartment();
    let extensions=[
      basicSetup,
      EditorView.lineWrapping,
      lintGutter(),
      editorTheme.of(oneDark),
      indentUnit.of("  "),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((v) => {
        if(timer!==null) clearTimeout(timer);
        timer=setTimeout(()=>{
          if(changed){
            this.$emit('content-changed');
          }
          changed=false;
        },2000);
        if(!v.docChanged) return;
        changed=true;
        this.$emit('update:modelValue', this.getCode());
      }),
    ];
    if(this.languagePlugins){
      extensions.push(this.languagePlugins.language);
      if(this.languagePlugins.completionSource){
        extensions.push(autocompletion({override: [this.languagePlugins.completionSource]}));
      }
    }
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
    setCode(){
      //wird nicht gebraucht wegen v-model
    },
    // setCode2(code){
    //   var old=this.editor.state.doc.toString();
    //   this.editor.dispatch({
    //     changes: {from: 0, to: old.length, insert: code}
    //   });
    // },
    updateLinter(){

    },
    async prettifyCode(){
      let code=this.getCode();
      let size=code.length;
      let options={tabWidth: 2};
      if(this.language==="html"){
        options.parser="html";
        //options.plugins=[htmlPlugin];
      }else if(this.language==="css"){
        options.parser="css";
        //options.plugins=[cssPlugin];
      }else if(this.language==="js"){
        options.parser="acorn";
        //options.plugins=[acorn];
      }
      // code=await prettier.format(code, options);
      // this.editor.dispatch({
      //   changes: {from: 0, to: size, insert: code}
      // });
    },
    clearRuntimeErrors(){
      this.runtimeError=null;
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
      undo(this.editor);
      //undo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    redo(){
      redo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    focus(){
      this.editor.focus();
    },
    toggleComment(){
      toggleComment(this.editor);
    },
    openSearchPanel(){
      
      openSearchPanel(this.editor);
      this.isSearchPanelOpen=true;
    },
    closeSearchPanel(){
      closeSearchPanel(this.editor);
      this.isSearchPanelOpen=false;
    },
    toggleSearchPanel(){
      if(this.isSearchPanelOpen){
        this.closeSearchPanel();
      }else{
        this.openSearchPanel();
      }
    },
    openLintPanel(){
      openLintPanel(this.editor);
      this.isLintPanelOpen=true;
    },
    closeLintPanel(){
      closeLintPanel(this.editor);
      this.isLintPanelOpen=false;
    },
    toggleLintPanel(){
      if(this.isLintPanelOpen){
        this.closeLintPanel();
      }else{
        this.openLintPanel();
      }
    },
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