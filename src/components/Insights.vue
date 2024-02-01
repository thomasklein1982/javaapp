<template>
  <div style="height: 100%; width: 100%; overflow: auto">
  Insights{{ line }}{{ clazzName }} <Button @click="test++" :label="test"/>
    <Accordion multiple :activeIndex="accordion">
      <AccordionTab header="Global Scope">
        Attribute der Hauptklasse
      </AccordionTab>
      <AccordionTab header="Local Scope">
        <div  style="font-family: monospace" v-show="line>=0">
          <DataTable :value="scope">
            <Column field="n" header="Name"/>
            <Column field="v" header="Wert"/>
          </DataTable>
        </div>
        <template v-show="line<0">
          nicht angehalten
        </template>
      </AccordionTab>  
    </Accordion>
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
  emits: ["update-scope"],
  props: {
    line: Number,
    clazzName: String,
    scope: Object
  },
  watch: {
    line(nv,ov){
      this.updateScope();
    },
    clazzName(nv,ov){
      this.template=null;
      this.updateScope();
    }
  },
  data(){
    return {
      template: null,
      test: 0,
      accordion: [0],
      expandedRows: []
    };
  },
  computed: {

  },
  methods: {
    updateScope(){
      this.$emit("update-scope");
    }
  }
}
</script>