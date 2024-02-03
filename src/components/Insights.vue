<template>
  <div style="height: 100%; width: 100%; overflow: auto" :style="{display: 'flex', 'flex-direction': 'column'}">
    <div>
      <Button :disabled="!paused" @click="$emit('resume')" icon="pi pi-play" />
      <Button :disabled="!paused" @click="$emit('step-above')" icon="pi pi-arrow-right" />
      <Button :disabled="!paused" @click="$emit('step')" icon="pi pi-arrow-down-right" />
      <Button @click="$emit('stop')" icon="pi pi-times" />
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
  </div>
</template>

<script>
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import VariableWatcher from './VariableWatcher.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default{
  components: {Accordion,AccordionTab, VariableWatcher, Column, DataTable},
  emits: ["update-scope","resume","step","stop","step-above"],
  props: {
    line: Number,
    clazzName: String,
    scope: Object,
    paused: Boolean
  },
  watch: {
    line(nv,ov){
      this.updateScope();
    },
    clazzName(nv,ov){
      this.template.local={};
      this.template.that={};
      this.updateScope();
    }
  },
  data(){
    return {
      template: {
        local: {},
        that: {},
        main: {main: {}}
      },
      accordion: [0],
      expandedRows: []
    };
  },
  computed: {

  },
  methods: {
    updateScope(){
      this.$emit("update-scope",this.template);
    }
  }
}
</script>