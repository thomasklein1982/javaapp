<template>
  <div id="root">
    <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px'}"></div>
    <Message v-if="displayedRuntimeError" severity="error" @close="dismissRuntimeError()">Z{{displayedRuntimeError.line}}: {{displayedRuntimeError.message}}</Message>
  </div>
  
</template>

<script>
import {basicSetup} from "codemirror";
import { EditorView } from "@codemirror/view";
import { java, javaLanguage } from "@codemirror/lang-java";
import {LanguageSupport} from "@codemirror/language";
import { lintGutter, linter, openLintPanel, closeLintPanel } from "@codemirror/lint";
import {keymap} from "@codemirror/view";
import {indentWithTab,undo,redo,toggleComment} from "@codemirror/commands";
import { indentUnit } from "@codemirror/language";
import {openSearchPanel,closeSearchPanel} from '@codemirror/search';
import {autocompletion} from "@codemirror/autocomplete";
import {Compartment,StateField, StateEffect, EditorSelection,RangeSet,EditorState} from "@codemirror/state"
import {gutter, GutterMarker} from "@codemirror/view"
import {Decoration,ViewPlugin} from "@codemirror/view"
import {getClazzFromState} from '../functions/cm/getClazzFromState';
import { oneDark } from '@codemirror/theme-one-dark';

import {Type} from '../classes/Type'
import { nextTick } from '@vue/runtime-core';
// import {markerrors, errorPlugin } from '../functions/cm/markerror';
import {createAutocompletion } from '../functions/cm/autocompletion';
import { options } from "../classes/Options";

const breakpointEffect = StateEffect.define({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
})

const breakpointState = StateField.define({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on){
          set = set.update({add: [breakpointMarker.range(e.value.pos)]})

        }else{
          set = set.update({filter: from => from != e.value.pos})
        }
        let clazz=getClazzFromState(transaction.startState);
        app.updateBreakpoints(set,transaction.startState.doc,clazz);
      }
    }
    return set
  }
})

function toggleBreakpoint(view, line) {
  let pos=line.from;
  line=view.state.doc.lineAt(pos)
  let breakpoints = view.state.field(breakpointState);
  let hasBreakpoint = false;
  breakpoints.between(pos, pos, () => {hasBreakpoint = true});
  view.dispatch({
    effects: breakpointEffect.of({pos, on: !hasBreakpoint})
  });
  
}

const breakpointMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("⬤") }
}

const breakpointGutter = [
  breakpointState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    domEventHandlers: {
      mousedown(view, line) {
        toggleBreakpoint(view, line)
        return true
      }
    }
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      color: "red",
      paddingLeft: "5px",
      cursor: "default"
    },
    ".cm-currentLine": {backgroundColor: "#121212", color: "white"}
  })
]

const errorEffect = StateEffect.define({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
})

const errorState = StateField.define({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(errorEffect)) {
        if (e.value.on){
          set = set.update({add: [errorMarker.range(e.value.pos)]})

        }else{
          set = set.update({filter: from => from != e.value.pos})
        }
        // let clazz=getClazzFromState(transaction.startState);
        // app.updateBreakpoints(set,transaction.startState.doc,clazz);
      }
    }
    return set
  }
})

const errorMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("!") }
}

const errorGutter = [
  errorState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(errorState),
    initialSpacer: () => errorMarker
  }),
  EditorView.baseTheme({
    ".cm-error-gutter .cm-gutterElement": {
      color: "red",
      paddingLeft: "5px",
      cursor: "default"
    },
    ".cm-currentLine": {backgroundColor: "#121212", color: "white"}
  })
]

const additionalCompletions=[];

export default {
  props: {
    clazz: Object,
    fontSize: {
      type: Number,
      default: 4
    },
    current: Object,
    project: Object,
    settings: Object,
    tabIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    clazz(nv){
      this.setCode(nv.src);
    },
    current(nv,ov){
      if(nv===null && ov!==null){
        this.setCursorToLine(ov.line);
      }else if(nv.line<1){
        this.setCursorToLine(ov.line);
      }else{
        let line=this.getLineByNumber(nv.line);
        try{
          this.setSelection(line.from,line.to+1);
        }catch(e){
          this.setSelection(line.from,line.to);
        }
      // currentLineHighlighter.update()
      }
    }

  },
  data(){
    return {
      runtimeErrors: [],
      displayedRuntimeError: null,
      errorID: 1,
      size: 0,
      triggerRecompilation: true
    };
  },
  mounted(){
    if(this.editor) return;
    if(!this.clazz || this.clazz.src===undefined) return;
    let changed=true;
    let timer;
    this.size=this.clazz.src.length;
    const lint = linter((view) => {
      //console.log("linter start");
      let errors=[];
      for(let i=0;i<this.clazz.errors.length;i++){
        let e=this.clazz.errors[i];
        //console.log(e);
        if(!e.line || e.from===undefined || e.to===undefined){
          errors.push({
            from: 0,
            to: 1,
            severity: "error",
            message: "Es ist ein unerwarteter Fehler an unbekannter Stelle aufgetreten.\nSende mir, falls möglich, bitte dein Programm zu,\ndann kann ich eine passendere Fehlermeldung einbauen.\n"+e.stack
          });
        }else{
          errors.push({
            from: e.from,
            to: e.to,
            severity: "error",
            message: e.message
          });
        }
      }
      //console.log("linter end", errors);
      return errors;
    });
    let editorTheme=new Compartment();
    let language;
    if(this.clazz.isFirstClazz && options.isEasyMode()){
      language=javaLanguage.configure({top: "ClassContent"});
      language=new LanguageSupport(language);
      console.log("easy mode first class parser");
    }else{
      language=java();
    }
    this.editor=new EditorView({
      state: EditorState.create({
        doc: "",
        extensions: [
          basicSetup,
          //highlightActiveLine(),
          breakpointGutter,
          EditorView.lineWrapping,
          lint,
          lintGutter(),
          editorTheme.of(oneDark),
          indentUnit.of("  "),
          language,
          autocompletion({override: [createAutocompletion()]}),
          keymap.of([indentWithTab]),
          EditorView.updateListener.of((v) => {
            this.$emit("caretupdate",v.state.selection.main.head);
            if(!v.docChanged) return;
            if(!v.changedRanges || v.changedRanges.length===0) return;
            this.size=v.state.doc.length;
            this.src=v.state.doc.toString();
            if(this.clazz.hasClazzDeclaration){
              /**stelle fest, ob alle Änderungen in einer Methode stattgefunden haben: */
              let from=v.changedRanges[0].fromA;
              let to=v.changedRanges[0].toA;
              let delta=v.changedRanges[0].toB-v.changedRanges[0].fromB-(to-from);
              let method=this.clazz.getMethodByPosition(from,to);
              if(method){
                //console.log("change in method",method);
                for(let i=1;i<v.changedRanges.length;i++){
                  from=v.changedRanges[i].fromA;
                  to=v.changedRanges[i].toA;
                  if(!(method.containsPosition(from) && method.containsPosition(to))){
                    method=null;
                    break;
                  }
                  delta+=v.changedRanges[i].toB-v.changedRanges[i].fromB-(to-from);
                }
                if(method){
                  /**nur aenderungen innerhalb einer Methode */
                  //console.log("only in method",method,delta);
                  this.update(v,{
                    method,
                    delta,
                    from
                  });
                  this.updateLinter();
                  return;
                }
              }
            }
            //console.log("not only in method");

            let updateImmediately=false;
            if(!changed){
              changed=v.docChanged;
            }
            if(changed){
              if(v.transactions.length===1){
                let t=v.transactions[0];
                if(t.changes && t.changes.inserted.length>0){
                  let lastChange=t.changes.inserted[t.changes.inserted.length-1];
                  if(lastChange.text && lastChange.text.length>0){
                    let inserted=lastChange.text[0];
                    if(inserted==='.'){
                      updateImmediately=true;
                    }
                  }
                }
              }
            }
            if(timer) clearTimeout(timer);
            if(updateImmediately){
              this.update(v);
              this.updateLinter();
              changed=false;
            }else{
              timer = setTimeout(() => {
                if (changed) {
                  this.update(v);
                  this.updateLinter();
                  //lint.value.source(this.editor);
                  changed=false;
                }
              }, 500 );
            }
          }),
        ]
      }),
      parent: this.$refs.editor
    });
    this.editor.component=this;
    this.setCode(this.clazz.src);
    // this.emptyTransaction();
  },
  methods: {
    adaptLayout(){
      this.editor.requestMeasure();
    },
    updateLinter(){
      let lintPlugin=this.editor.plugins[14];
      if(lintPlugin && lintPlugin.value && lintPlugin.value.run){
        lintPlugin.value.run()
      }
    },
    async update(viewUpdate, methodInformation){
      var state=viewUpdate.state;
      /**direkt nach dem laden darf kein update erfolgen, sonst ist der tree (oft) fehlerhaft: */
      if(viewUpdate.changedRanges.length===1){
        let r=viewUpdate.changedRanges[0];
        if(r.fromA===0 && r.fromB===0 && r.toA===0 && r.toB===state.doc.length){
          return;
        }
      }
      var src=state.doc.toString();
      if(methodInformation){
        let t1=new Date();
        await this.clazz.recompileMethod(methodInformation,src,state.tree,this.settings.optimizeCompiler);
        let t2=new Date();
        //console.log("recompiled method '"+methodInformation.method.name+"' in "+(t2-t1)+"ms ("+this.clazz.name+")");
      }else{
        //console.log("recompile whole clazz",this.clazz);
        this.clazz.setSrcAndTree(src,state.tree);
        if(this.triggerRecompilation){
          this.project.compile(false,this.settings.optimizeCompiler);
        }else{
          let t1=new Date();
          await this.clazz.compile(false,this.settings.optimizeCompiler);
          let t2=new Date();
          console.log("update parsing done in "+(t2-t1)+"ms ("+this.clazz.name+")");
        }
        this.focus();
        this.triggerRecompilation=true;
      }
      //this.updateErrors(viewUpdate.view);
    },
    emptyTransaction(){

      this.editor.dispatch({
      });
    },
    // updateErrors: function(view){
    //   markerrors(this.clazz.errors,view);
    //   this.emptyTransaction();
    // },
    setCode(code){
      this.triggerRecompilation=false;
      this.size=code.length;
      var old=this.editor.state.doc.toString();
      this.editor.dispatch({
        changes: {from: 0, to: old.length, insert: code}
      });
    },
    getCode(){
      return this.editor.state.doc.toString();
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
    lineAt(pos){
      return this.state.doc.lineAt(pos);
    },
    prettifyCode(){
      var code=this.getCode();
      code=js_beautify(code,{
        "indent_size": 2,
        "max_preserve_newlines": 2,
        "indent_empty_lines": true,
        "space_in_paren": true,
        "space_in_empty_paren": true
      });
      this.editor.dispatch({
        changes: {from: 0, to: this.size, insert: code}
      });
    },
    slice(from,to){
      return this.editor.viewState.state.doc.slice(from,to).toString();
    },
    reset: function(sourceCode){
      this.clearRuntimeErrors();
      this.$root.sourceCode=sourceCode;
      this.editor.dispatch({
        changes: {from: 0, to: this.size, insert: this.$root.sourceCode}
      });
      this.check();
    },
    undo(){
      //undo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
      let state=this.editor;
      undo(state);
    },
    redo(){
      redo({state: this.editor.viewState.state, dispatch: this.editor.dispatch});
    },
    clearRuntimeErrors(){
      while(this.runtimeErrors.length>0){
        this.runtimeErrors.pop();
      }
      this.displayedRuntimeError=null;
    },
    dismissRuntimeError(){
      this.displayedRuntimeError=null;
      this.runtimeErrors.splice(0,1);
      setTimeout(()=>{
        if(this.runtimeErrors.length>0){
          this.displayedRuntimeError=this.runtimeErrors[0];
        }
      },200);
    },
    setRuntimeError(error){
      //this.runtimeError.pop();
      if(error){
        this.errorID++;
        this.runtimeErrors.push(error);
        if(this.runtimeErrors.length===1){
          this.displayedRuntimeError=error;
        }
      }
    },
    insert(text){
      let pos=this.editor.state.selection.ranges[0].from;
      this.editor.dispatch({
        changes: {from: pos, to: pos, insert: text}
      });
      this.focus();
    },
    setCursor: function(position){
      //editor.focus();
      this.editor.dispatch({
        selection: new EditorSelection([EditorSelection.cursor(position)], 0),
        scrollIntoView: true
      });
    },
    setCursorToLine: function(linenumber){
      if(linenumber<1) return;
      let line=this.getLineByNumber(linenumber);
      this.setCursor(line.from);
    },
    getLineByNumber: function(linenumber){
      return this.editor.state.doc.line(linenumber);
    },
    getSelectedText: function(){

    },
    getSelectedNode: function(){
      let selection=this.editor.viewState.state.selection;
      if(selection.ranges.length!==1) return null;
      let range=selection.ranges[0];
      if(range.from>=range.to) return;
      let tree=this.editor.viewState.state.tree;
      let node=tree.resolveInner(range.from, 0);
      while(node.from<range.from || node.to>range.to){
        if(node.to<=range.from){
          if(node.nextSibling){
            node=node.nextSibling;
          }else{
            return null;
          }
        }else{
          if(node.firstChild){
            node=node.firstChild;
          }else{
            return null;
          }
        }
      }
      return node;
    },
    setCursorToEnd(){
      this.setCursor(this.size-1);
    },
    setSelection(anchor,head){
      this.setCursorToEnd();
      nextTick(()=>{
        this.editor.dispatch({
          selection: {anchor, head},
          scrollIntoView: true
        });
      });
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