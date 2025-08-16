<template>
  <div style="height: 100%; width: 100%; overflow: auto; font-family: monospace" :style="{display: 'flex', 'flex-direction': 'column'}">
    <div>
      <Button :disabled="!paused" @click="$emit('resume')" icon="pi pi-play" />
      <Button :disabled="!paused" @click="$emit('step-above')" icon="pi pi-arrow-right" />
      <Button :disabled="!paused" @click="$emit('step')" icon="pi pi-arrow-down-right" />
      <Button @click="$emit('stop')" icon="pi pi-times" />
      <Button severity="secondary" text @click="$emit('remove-breakpoints')" style="text-decoration: line-through; padding-left:0.5rem; padding-right:0.5rem;">🛑</Button>
    </div>
    <div style="overflow: auto; flex: 1;">
      <template v-if="scope && scope.main">
        <VariableWatcher
          :variable="scope.main"
          :template="template.main"
          @update-scope="this.updateScope"
        >
          <template #header>
            Watched Object
          </template>
        </VariableWatcher>
      </template>
      <template v-else>
      </template>
      <div style="font-family: monospace" v-if="scope && paused">
        <template v-if="scope && scope.that">
          <VariableWatcher
            :variable="scope.that"
            :template="template.that"
            @update-scope="this.updateScope"
          />
        </template>
        <template v-for="(v,i) in scope.local">
          <VariableWatcher  
            :variable="v" 
            :template="template.local"
            @update-scope="this.updateScope()"
          />
        </template>
      </div>
    </div>
    <div class="console">
      <div style="display: flex">
        <CodeMirrorTerminal
          ref="consoleEditor"
          v-model="terminal.prompt"
          style="flex: 1"
          :project="project"
          :clazz="currentClazz"
        />
        <Button text icon="pi pi-send" @click="sendConsolePrompt"/>
      </div>
    </div>
  </div>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import VariableWatcher from './VariableWatcher.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { Clazz } from '../classes/Clazz';
import CodeMirrorTerminal from './CodeMirrorTerminal.vue';
import { parseJava } from '../functions/parseJava';
import { CompileFunctions } from '../language/CompileFunctions';
import { Scope } from '../classes/Scope';
import { Method } from '../classes/Method';
import { Source } from '../classes/Source';
import { Modifiers } from '../classes/Modifiers';

export default{
  components: {Accordion,AccordionTab, VariableWatcher, Column, DataTable, CodeMirrorTerminal},
  emits: ["update-scope","resume","step","stop","step-above","send-console-prompt"],
  props: {
    line: Number,
    clazzName: String,
    scope: Object,
    paused: Boolean,
    step: Number,
    project: Object
  },
  watch: {
    line(nv,ov){
      //this.updateScope();
    },
    step(){
      this.updateScope();
    },
    clazzName(nv,ov){
      this.template.local={};
      this.template.that={};
      this.updateScope();
    },
  },
  computed: {
    mainClazz(){
      return this.project.getMainClazz();
    },
    currentClazz(){
      if(this.paused){
        this.terminal.clazz=this.project.getClazzByName(this.clazzName);
      }else{
        this.terminal.clazz=this.mainClazz;
      }
      return this.terminal.clazz;
    }
  },
  data(){
    return {
      template: {
        local: {},
        that: {},
        main: {main: {}}
      },
      terminal: {
        prompt: "",
        method: new Method(null),
        clazz: this.mainClazz
      },
      accordion: [0],
      expandedRows: []
    };
  },
  mounted(){
    this.terminal.method.modifiers=new Modifiers();
    this.terminal.clazz=this.currentClazz;
  },
  methods: {
    updateScope(){
      this.$emit("update-scope",this.template);
    },
    sendConsolePrompt(){
      let method=this.$refs.consoleEditor.method;
      let p=this.terminal.prompt.trim();
      if(!p.endsWith(";"))p+=";";
      let code="{"+p+"}";
      this.terminal.prompt="";
      this.$refs.consoleEditor.setCode(this.terminal.prompt);
      let ast=parseJava(code,true);
      if(!ast || !ast.topNode || !ast.topNode.firstChild) return;
      let node=ast.topNode.firstChild;
      console.log(node);
      method.bodyNode=node;
      let source=new Source(code,method.bodyNode,method.clazz);
      let res=method.compileBody(source,true);
      if(res.errors.length>0){
        console.log(res.errors);
      }else{
        this.$emit("send-console-prompt","$scope=new $Scope();\n"+res.code);
      }
    }
  }
}
</script>