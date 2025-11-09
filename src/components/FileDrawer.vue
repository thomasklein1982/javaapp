<template>
  <Drawer v-model:visible="show" header="Dateien" @hide="$emit('close',activeTabInEditor)">
    <div>
      <Button @click="clickAddNewFile()" icon="pi pi-plus" label="Neue Datei"/>
      <Sortable
        :list="files"
        item-key="id"
        :options="{
          handle: '.handle',
          'ghost-class': 'drag-ghost',
          sort: true
        }"
        @update="update"
        :style="{display: 'flex', 'flex-direction': 'column', 'align-items': 'stretch'}"
        style="overflow: auto"
      >
        <template #item="{element,index}">
          <div class="flex-container" style="align-items: center" :style="{backgroundColor: element===selectedFile? '#333':''}"><div class="flex handle file-name" @click="clickFile(element,index)">{{ element }} <span v-if="element.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span></div><div><Button severity="secondary" icon="pi pi-download" @click="downloadClazz(element)"/><Button severity="secondary" icon="pi pi-trash" @click="removeClazz(index,element)"/></div></div>
        </template>
      </Sortable>
    </div>
  </Drawer>
</template>

<script>
import { Drawer, ToggleButton } from 'primevue';
import {Sortable} from "sortablejs-vue3";
import { download } from '../functions/helper';
import { mimes } from '../consts/mimes';

export default{
  components: {
    Drawer, Sortable, ToggleButton
  },
  props: {
    project: Object
  },
  computed: {
    
  },
  data(){
    return {
      show: false,
      files: [],
      firstFile: {},
      activeTabInEditor: 0,
      selectedFile: null
    }
  },
  methods: {
    open(activeTabInEditor){
      this.selectedFile=null;
      this.activeTabInEditor=activeTabInEditor;
      this.firstFile=this.project.clazzes[0];
      this.files=[];
      let start=this.$root.webMode? 1: 0;
      for(let i=start;i<this.project.clazzes.length;i++){
        this.files.push(this.project.clazzes[i]);
      }
      this.show=true;
    },
    close(){
      this.show=false;
    },
    downloadClazz(clazz){
      let c=clazz;
      if(!c) return;
      download(c.src,c.getFileName(),mimes[c.getFileExtension()]);
    },
    toggle(){
      this.show=!this.show;
    },
    clickAddNewFile(){
      this.$emit('add-file');
      this.close();
    },
    update(event){
      console.log(event);
      let i=event.oldIndex;
      let j=event.newIndex;
      if(this.$root.webMode){
        i++;
        j++;
      }
      let c=this.project.clazzes[i];
      this.project.clazzes[i]=this.project.clazzes[j];
      this.project.clazzes[j]=c;
    },
    removeClazz(index, clazz){
      let a=confirm("Möchtest du die Datei '"+clazz.name+"' wirklich löschen?");
      if(!a) return;
      this.files.splice(index,1);
      if(this.$root.webMode) index++;
      this.project.clazzes.splice(index,1);
      if(this.activeTabInEditor>=index) this.activeTabInEditor--;
      this.project.compile();
    },
    clickFile(clazz,index){
      if(this.selectedFile!==clazz){
        this.selectedFile=clazz;
      }else{
        if(this.$root.webMode) index++;
        this.$emit("openFile",index);
        this.show=false;
      }
    }
  }
}
</script>

<style lang="css" scoped>
.handle{
  cursor: grab;
  -moz-user-select: none;
  user-select: none;
}
.stripes>div:nth-child(odd){
  background-color: #333;
}
.file-name{
  font-family: monospace, monospace;
}
</style>