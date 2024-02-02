<template>
  <div style="height: 100%; width: 100%; overflow: auto" :style="{display: 'flex', 'flex-direction': 'column'}">
    <div>
      <Button :disabled="!paused" @click="$emit('resume')" icon="pi pi-play" />
      <Button :disabled="!paused" @click="$emit('step-above')" icon="pi pi-arrow-right" />
      <Button :disabled="!paused" @click="$emit('step')" icon="pi pi-arrow-down-right" />
      <Button @click="$emit('stop')" icon="pi pi-times" />
    </div>
    <div style="overflow: auto; flex: 1;">
      <Accordion class="accordion-packed" multiple :activeIndex="accordion">
        <AccordionTab header="Global Scope">
          Attribute der Hauptklasse
        </AccordionTab>
        <AccordionTab header="Local Scope">
          <div  style="font-family: monospace">
            <template v-for="(v,i) in scope">
              <VariableWatcher  
                :variable="v" 
                :template="template"
                @update-scope="this.updateScope()"
              />
            </template>
          </div>
        </AccordionTab>  
      </Accordion>
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
      this.template={};
      this.updateScope();
    }
  },
  data(){
    return {
      template: {},
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