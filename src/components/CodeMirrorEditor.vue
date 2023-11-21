<template>
  <div id="root">
    <div id="editor" ref="editor"></div>
  </div>
  
</template>

<script>
import { EditorView, basicSetup } from "codemirror";
import { css, cssCompletionSource } from "@codemirror/lang-css";
import {html,htmlCompletionSource} from "@codemirror/lang-html";
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


export default {
  props: {
    language: String,
    modelValue: String
  },
  emits: ["update:modelValue","change"],
  computed: {
    languagePlugins(){
      if(this.language==="html"){
        return {
          language: html({autoCloseTags: true}).language,
          completionSource: htmlCompletionSource
        };
      }else if(this.language==="css"){
        return {
          language: css().language,
          completionSource: cssCompletionSource
        };
      }
    }
  },
  data(){
    return {
      editor: null
    };
  },
  mounted(){
    let changed=true;
    let timer;
    let editorTheme=new Compartment();
    let extensions=[
      basicSetup,
      EditorView.lineWrapping,
      lintGutter(),
      editorTheme.of(oneDark),
      indentUnit.of("  "),
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((v) => {
        this.$emit('update:modelValue', this.getCode());
        //this.project.css=this.getCode();
      }),
    ];
    if(this.languagePlugins){
      extensions.push(this.languagePlugins.language);
      extensions.push(autocompletion({override: [this.languagePlugins.completionSource]}));
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