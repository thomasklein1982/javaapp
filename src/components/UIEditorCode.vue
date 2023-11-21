<template>
  <Dialog header="Code-Editor für UI-Klassen" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <CodeMirrorEditor v-model="code"/>
    <template #footer>
      <Button label="Abbrechen" icon="pi pi-times" @click="show=false"/>
      <Button label="Übernehmen" icon="pi pi-check" @click="confirm()" />
    </template>
  </Dialog>
</template>

<script>
import CodeMirrorEditor from './CodeMirrorEditor.vue';

export default {
  computed: {
    
  },
  data(){
    return {
      show: false,
      code: "",
      uiClazz: null
    };
  },
  methods: {
    open(uiClazz){
      this.uiClazz=uiClazz;
      let comp=uiClazz.getComponentData();
      this.code=JSON.stringify(comp,null,2);
      this.show=true;
    },
    confirm(){
      try{
        let c=JSON.parse(this.code);
        this.uiClazz.setComponentData(c);
        this.show=false;
      }catch(e){

      }
      
    }
  },
  components: {
    CodeMirrorEditor
  }
}
</script>