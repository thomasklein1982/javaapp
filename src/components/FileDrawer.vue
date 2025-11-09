<template>
  <Drawer v-model:visible="show" header="Dateien" @hide="$emit('close',activeTabInEditor)">
    <div>
      <div v-if="!$root.webMode" class="flex-container"><div class="flex file-name">{{ firstFile.name }} <span v-if="firstFile.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span></div><div><ToggleButton v-model="firstFile.isEditorShown" on-icon="pi pi-eye" off-icon="pi pi-eye-slash" on-label=" " off-label=" " @click="visibilityChange(firstFile,0)"/><Button severity="secondary" disabled icon="pi pi-trash"/></div></div>

      <Sortable
       class="stripes"
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
          <div class="flex-container" style="align-items: center"><div class="flex handle file-name">{{ element }} <span v-if="element.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span></div><div><ToggleButton v-model="element.isEditorShown" on-icon="pi pi-eye" off-icon="pi pi-eye-slash" on-label=" " off-label=" " @click="visibilityChange(element,index+1)"/><Button severity="secondary" icon="pi pi-trash" @click="removeClazz(index,element)"/></div></div>
        </template>
      </Sortable>
    </div>
  </Drawer>
</template>

<script>
import { Drawer, ToggleButton } from 'primevue';
import {Sortable} from "sortablejs-vue3";

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
      removedActiveTab: false
    }
  },
  methods: {
    open(activeTabInEditor){
      this.removedActiveTab=false;
      this.activeTabInEditor=activeTabInEditor;
      this.firstFile=this.project.clazzes[0];
      this.files=[];
      for(let i=1;i<this.project.clazzes.length;i++){
        this.files.push(this.project.clazzes[i]);
      }
      this.show=true;
    },
    close(){
      this.show=false;
    },
    toggle(){
      this.show=!this.show;
    },
    update(event){
      console.log(event);
      let c=this.project.clazzes[event.oldIndex];
      this.project.clazzes[event.oldIndex]=this.project.clazzes[event.newIndex];
      this.project.clazzes[event.newIndex]=c;
    },
    removeClazz(index, clazz){
      let a=confirm("Möchtest du die Datei '"+clazz.name+"' wirklich löschen?");
      if(!a) return;
      this.files.splice(index,1);
      this.project.clazzes.splice(index+1,1);
      if(!this.removedActiveTab && this.activeTabInEditor===index) this.removedActiveTab=true;
      if(this.activeTabInEditor>=index+1) this.activeTabInEditor--;
      this.project.compile();
    },
    visibilityChange(clazz,index){
      if(clazz.isEditorShown){
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
}
.stripes>div:nth-child(odd){
  background-color: #333;
}
.file-name{
  font-family: monospace, monospace;
}
</style>