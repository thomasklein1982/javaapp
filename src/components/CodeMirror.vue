<template>
  <div id="root">
    <Toast/>
    <div id="editor" ref="editor" :style="{fontSize: (0.55*fontSize+5)+'px'}"></div>
    <div v-show="disabled" @click="clickDisabled()" style="cursor: not-allowed" :style="disableDivStyle" id="disable-div"></div>
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

import {hoverTooltip} from "@codemirror/view"

// const addMethodMark = StateEffect.define({
//   map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
// })

// const addMethodMarkEnd = StateEffect.define({
//   map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
// })

// const clearMethodMarks = StateEffect.define({
//   map: ({from, to}, change) => ({from: change.mapPos(from), to: change.mapPos(to)})
// })

// const methodMarkField = StateField.define({
//   create() {
//     return Decoration.none
//   },
//   update(underlines, tr) {
//     underlines = underlines.map(tr.changes)
//     for (let e of tr.effects){ 
//       if (e.is(addMethodMark)) {
//         underlines = underlines.update({
//           add: [methodMark.range(e.value.from, e.value.to)]
//         })
//       }else if(e.is(clearMethodMarks)){
//         underlines=Decoration.none;
//       }else if(e.is(addMethodMarkEnd)){
//         underlines = underlines.update({
//           add: [methodMarkEnd.range(e.value.from, e.value.to)]
//         })
//       }
//     }
//     return underlines
//   },
//   provide: f => EditorView.decorations.from(f)
// })

// const methodMark = Decoration.line({class: "cm-method-mark"})
// const methodMarkEnd = Decoration.line({class: "cm-method-mark-end"})

  export const wordHover = hoverTooltip((view, pos, side) => {
    console.log(view);
    let clazz=app.$refs.editor.currentClazz;
    let node = view.viewState.state.tree.resolveInner(pos, side);
    console.log(node,clazz);
    let infos=clazz.nodeInfos[node.index];
    console.log(infos);
    return;
    let {from, to, text} = view.state.doc.lineAt(pos)
    let start = pos, end = pos
    let regexp=/[=+\-*\/%&|]/;
    let c=text[start-from-1];
    console.log(c);
    if(c===" "){
      start++;
      regexp=/[=+\-*\/%&|]/;
      c=text[start-from-1];
    }
    if(!regexp.test(c)){
      regexp=/\w|\./;
    }
    while (start > from && regexp.test(text[start - from - 1])) start--
    while (end < to && regexp.test(text[end - from])) end++
    if (start == pos && side < 0 || end == pos && side > 0){
      return null
    }
    let word=text.slice(start - from, end - from);
    let tip;
    if(word==="new"){
      tip="erzeugt ein neues Objekt";
    }else if(word==="Object"){
      tip="ein Objekt fasst mehrere Variablen zu einer zusammen";
    }else if(word==="=="){
      tip="vergleicht die beiden Objekte";
    }else if(word==="+"){
      tip="addiert die beiden Zahlen oder verkettet die beiden Zeichenketten";
    }else if(word==="="){
      tip="weist der Variablen links den Wert rechts zu";
    }else{
      for(let i=0;i<snippets.inFunction.length;i++){
        let s=snippets.inFunction[i];
        if(s.label===word+"(...)"||s.label===word){
          tip=s.info;
          break;
        }
      }
      for(let i=0;i<snippets.everywhere.length;i++){
        let s=snippets.everywhere[i];
        if(s.label===word+"(...)"||s.label===word){
          tip=s.info;
          break;
        }
      }
    }
    if(tip){
      return {
        pos: start,
        above: true,
        create(view) {
          let dom = document.createElement("div");
          dom.textContent = tip;
          return {dom};
        }
      };
    }else{
      return null;
    }
  });

const breakpointEffect = StateEffect.define({
  map: (val, mapping) => ({pos: mapping.mapPos(val.pos), on: val.on})
})

const breakpointState = StateField.define({
  create() { return RangeSet.empty },
  update(set, transaction) {
    set = set.map(transaction.changes);
    for (let e of transaction.effects) {
      if (e.is(breakpointEffect)) {
        if (e.value.on){
          set = set.update({add: [breakpointMarker.range(e.value.pos)]});
        }else{
          set = set.update({filter: from => from != e.value.pos});
        }
        let clazz=getClazzFromState(transaction.startState);
        clazz.breakpointSet=set;
        app.updateBreakpoints(set,transaction.startState.doc,clazz);
      }
    }
    return set;
  }
})

function toggleBreakpoint(view, line) {
  console.log("toggle bp");
  let pos=line.from;
  // line=view.state.doc.lineAt(pos)
  let breakpoints = view.state.field(breakpointState);
  let hasBreakpoint = false;
  breakpoints.between(pos, pos, () => {hasBreakpoint = true});
  view.dispatch({
    effects: breakpointEffect.of({pos, on: !hasBreakpoint})
  });
  
}

function removeAllBreakpoints(clazz,view){
  console.log("remove all bp");
  if(clazz.breakpointSet){
    while(clazz.breakpointSet.chunk.pop());
    while(clazz.breakpointSet.chunkPos.pop());
    let n=view.viewState.state.doc.length;
    view.dispatch({
      effects: breakpointEffect.of({from:0,to:n, on: false})
    });
  }
}

const breakpointMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("🛑") }
}

const breakpointGutter = [
  breakpointState,
  gutter({
    class: "cm-breakpoint-gutter",
    markers: v => v.state.field(breakpointState),
    initialSpacer: () => breakpointMarker,
    domEventHandlers: {
      mousedown(view, line) {
        toggleBreakpoint(view, line);
        return true;
      }
    }
  }),
  EditorView.baseTheme({
    ".cm-breakpoint-gutter .cm-gutterElement": {
      color: "yellow",
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

const languageConf=new Compartment();

const javaWithClazz=java();
const javaWithoutClazz=new LanguageSupport(javaLanguage.configure({top: "ClassContent"}));

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
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    clazz(nv,ov){
      nv.editor=this;
      if(!ov){
        return;
      }
      if(ov.isUIClazz() && !nv.isUIClazz()){
        if(!(nv.isFirstClazz)){
          console.log("wechsle zu java mit klasse");
          this.setLanguage(javaWithClazz);
        }
      }else if(!ov.isUIClazz() && nv.isUIClazz()){
        console.log("wechsle zu java ohne klasse");
        this.setLanguage(javaWithoutClazz);
      }
      this.setCode(nv.src);
    },
    current(nv,ov){
      if(!this.clazz || !nv) return;
      if(nv.name!==this.clazz.name) return;
      if(nv===null && ov!==null){
        this.setCursorToLine(ov.line);
      }else if(nv.line<1){
        this.setCursorToLine(ov.line);
      }else{
        let line=this.getLineByNumber(nv.line);
        try{
          this.setSelection(line.from,line.to);
        }catch(e){
          this.setSelection(line.from,line.to);
        }
      // currentLineHighlighter.update()
      }
    },
    disabled(nv){
      if(nv){
        let content=document.querySelector(".cm-content");
        let parent=content.parentElement;
        content=content.getBoundingClientRect();
        parent=parent.getBoundingClientRect();
        this.disableDivStyle.left=content.x-parent.x+"px";
        this.disableDivStyle.width=content.width+"px";
      }
    }

  },
  computed: {
    isUIClazz(){
      return this.clazz.isUIClazz();
    }
  },
  data(){
    return {
      runtimeErrors: [],
      displayedRuntimeError: null,
      errorID: 1,
      size: 0,
      triggerRecompilation: true,
      disableDivStyle: {
        left: "0px", width: "100px", top: "0px", height: "100%"
      }
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
    if(this.clazz.isFirstClazz || this.clazz.isUIClazz()){
      console.log("use easy without clazz");
      language=javaWithoutClazz;
    }else{
      language=javaWithClazz;
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
          //wordHover,
          indentUnit.of("  "),
          languageConf.of(language),
          autocompletion({override: [createAutocompletion()]}),
          keymap.of([indentWithTab]),
          //methodMarkField,
          EditorView.updateListener.of((v) => {
            this.$emit("caretupdate",v.state.selection.main.head);
            if(!v.docChanged) return;
            if(!v.changedRanges || v.changedRanges.length===0) return;
            // if(v.transactions.length===1){
            //   let t=v.transactions[0];
            //   if(t.changes && t.changes.inserted.length>0){
            //     let lastChange=t.changes.inserted[t.changes.inserted.length-1];
            //     if(lastChange.text && lastChange.text.length===1){
            //       let inserted=lastChange.text[0];
            //       let key=inserted.codePointAt(0);
            //       if(key>=65 && key<=122 || key>=48 && key<=57){
            //         return;
            //       }
            //     }
            //   }
            // }
            if(v.changedRanges.length===1 && (v.changedRanges[0].toA-v.changedRanges[0].fromA===1)){

            }
            this.size=v.state.doc.length;
            this.src=v.state.doc.toString();
            //if(this.clazz.hasClazzDeclaration){
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
                  }).then(()=>{
                    this.updateLinter();
                  });
                  return;
                }
              }
            //}
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
              this.update(v).then(()=>{
                this.updateLinter();
              });
              changed=false;
            }else{
              timer = setTimeout(() => {
                if (changed) {
                  this.update(v).then(()=>{
                    this.updateLinter();
                  });
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
  },
  methods: {
    removeAllBreakpoints(){
      removeAllBreakpoints(this.clazz,this.editor);
    },
    setLanguage(language){
      this.editor.dispatch({
        effects: languageConf.reconfigure(language)
      });
    },
    setClazzDeclarationMandatory(){
      this.setLanguage(javaWithClazz);
    },
    setClazzDeclarationOptional(){
      let l=new LanguageSupport(javaLanguage.configure({top: "ClassContent"}));
      this.setLanguage(l);
    },
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
      if(!this.triggerRecompilation){
        this.triggerRecompilation=true;
        return;
      }
      var state=viewUpdate.state;
      /**direkt nach dem laden darf kein update erfolgen, sonst ist der tree (oft) fehlerhaft: */
      if(viewUpdate.changedRanges.length===1){
        let r=viewUpdate.changedRanges[0];
        if(r.fromA===0 && r.fromB===0 && r.toA===0 && r.toB===state.doc.length){
          return;
        }
      }
      var src=state.doc.toString();
      if(methodInformation ){
        let t1=new Date();
        await this.clazz.recompileMethod(methodInformation,src,state.tree,this.settings.optimizeCompiler);
        let t2=new Date();
        this.updateMethodMarks();
        //console.log("recompiled method '"+methodInformation.method.name+"' in "+(t2-t1)+"ms ("+this.clazz.name+")");
      }else{
        //console.log("recompile whole clazz",this.clazz);
        this.clazz.setSrcAndTree(src,state.tree);
        this.project.compile(false,this.settings.optimizeCompiler).then(()=>{
          this.focus();
          this.triggerRecompilation=true;
          this.updateMethodMarks();
        });
        // }else{
        //   let t1=new Date();
        //   this.clazz.compile(false,this.settings.optimizeCompiler).then(()=>{
        //     let t2=new Date();
        //     console.log("update parsing done in "+(t2-t1)+"ms ("+this.clazz.name+")");
        //     this.focus();
        //     this.triggerRecompilation=true;
        //   });
        // }
        
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
      setTimeout(()=>{
        this.updateMethodMarks();
      },1000);
    },
    updateMethodMarks(){
      // let effects = [clearMethodMarks.of()];
      // let doc=this.editor.viewState.state.doc;
      // let line,node,m;
      // for(let mn in this.clazz.methods){
      //   m=this.clazz.methods[mn];
      //   if(!m.bodyNode) continue;
      //   node=m.node;
      //   line=doc.lineAt(node.from);
      //   effects.push(addMethodMark.of({from: line.from, to: line.from}));
      //   node=m.bodyNode.lastChild;
      //   line=doc.lineAt(node.from);
      //   effects.push(addMethodMarkEnd.of({from: line.from, to: line.from}));
      // }
      // this.editor.dispatch({effects})
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
        "space_in_empty_paren": true,
        "keep_array_indentation": true
      });
      code=code.replace(/\) - > \{/g,") -> {");
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
    clickDisabled(){
      this.$toast.add({severity:'info', summary:'App pausiert', detail:'So lange die Ausführung pausiert ist, kannst du den Code nicht ändern.', life: 2000});
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
  #disable-div{
    position: absolute;
  }
</style>

<style>
  .cm-editor{
    flex: 1;
  }
  #errors{
    font-family: monospace;
  }
  .cm-method-mark{
    border-top: 1pt solid orange;
    box-shadow: 0px -3px 3px 1px rgba(255,165,0,0.2);
  }
  .cm-method-mark-end{
    border-bottom: 1pt solid orange;
    box-shadow: 0px 3px 3px 1px rgba(255,165,0,0.2);
    
  }
</style>