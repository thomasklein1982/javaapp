<template>
  <Drawer v-model:visible="show" header="Dateien" @hide="$emit('close',activeTabInEditor)">
    <div>
      <Button @click="clickAddNewFile()" icon="pi pi-plus" label="Neu"/>
      <Button label="Hochladen" icon="pi pi-upload" @click="uploadFile()"/>
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
          <div class="flex-container" style="align-items: center" :style="{backgroundColor: element===selectedFile? '#333':''}"><div class="handle pi pi-equals"></div><div class="flex file-name" @click="clickFile(element,index)">{{ element.name }}.{{ element.getFileExtension() }} <span v-if="element.errors.length===0" style="font-size: small; color: lime" class="pi pi-check-circle"/><span v-else style="font-size: small; color: red" class="pi pi-exclamation-circle"></span></div><div><Button severity="secondary" icon="pi pi-download" @click="downloadClazz(element)"/><Button :disabled="element.isFirstClazz" severity="secondary" icon="pi pi-trash" @click="removeClazz(index,element)"/></div></div>
        </template>
      </Sortable>
    </div>
  </Drawer>
</template>

<script>
import { Drawer, ToggleButton } from 'primevue';
import {Sortable} from "sortablejs-vue3";
import { download, upload } from '../functions/helper';
import { mimes } from '../consts/mimes';
import { SourceFile } from '../classes/SourceFile';
import { Clazz } from '../classes/Clazz';
import { UIClazz } from '../classes/UIClazz';

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
    async uploadFile(){
      let files=await upload({ multi: true});
      console.log(files);
      let errors=[];
      for(let i=0;i<files.length;i++){
        let f=files[i];
        let name=f.fileName;
        let code=f.code;
        let p=name.lastIndexOf(".");
        let ext=name.substring(p+1);
        name=name.substring(0,p);
        name=name.replace(/\W/g,"");
        if(ext!=="html" && ext!=="css" && ext!=="js" && ext!=="java" && ext!=="ui" && ext!=="txt"){
          errors.push(f);
          continue;
        }
        console.log("import ",f,name);
        let j=1;
        let baseName=name;
        while(!this.project.isFileNameOK(name,ext)){
          name=baseName+="_"+j;
          j++;
        }
        let c;
        if(ext==='java'){
          c=new Clazz(name,this.project,false);
          c.src=code;
        }else if(ext==='ui'){
          c=new UIClazz(name,this.project);
          try{
            let o=JSON.parse(code);
            o.name=name;
            c.restoreFromSaveObject(o);
          }catch(e){

          }
        }else{
          c=new SourceFile(name,ext,this.project);
          c.src=code;
        }
        this.project.addClazz(c);
        this.files.push(c);
        this.$root.emitEvent("new-class",{name})
      }
      if(errors.length>0)
        alert(errors.length+" Dateien konnten nicht geladen werden:\n- "+errors.map((v)=>v.fileName).join("\n- "));
    },
    open(activeTabInEditor){
      this.selectedFile=null;
      this.activeTabInEditor=activeTabInEditor;
      this.firstFile=this.project.clazzes[0];
      this.updateFilesFromProject();
      this.show=true;
    },
    updateFilesFromProject(){
      this.files=[];
      let start=this.$root.webMode? 1: 0;
      for(let i=start;i<this.project.clazzes.length;i++){
        let c=this.project.clazzes[i];
        if(c.isHidden) continue;
        this.files.push(c);
      }
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
      let index2=this.project.getClazzIndexByName(clazz.name);
      this.project.clazzes.splice(index2,1);
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
.handle{
  margin-right: 0.3rem;
  font-size: small;
}
</style>