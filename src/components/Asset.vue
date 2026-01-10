<template>
  <ConfirmPopup v-if="editable"/>
  <Card class="asset" style="width: auto; display: inline-block" >
    <template #title>{{ name }} 
      <Button v-if="editable" size="small" @click="$emit('edit')" icon="pi pi-pencil"/> 
      <Button @click="trash($event)" size="small" icon="pi pi-trash" style="padding-left: 0.2rem; padding-right: 0.2rem"/>
      <Button @click="download" size="small" icon="pi pi-download" style="padding-left: 0.2rem; padding-right: 0.2rem"/>
    </template>
    <template #content>
      <template v-if="file.mime.indexOf('image')>=0">
        <img width="100" style="max-height: 200px; max-width: 200px" :src="file.code"/>
      </template>
      <template v-else-if="file.mime.indexOf('audio')>=0">
        <audio controls :src="file.code"/>
      </template>
      <template v-else>
        <span style="border: 1pt white solid; padding: 0.2rem; border-radius: 0.1rem;">Datei {{ file.fileName }}</span>
      </template>
      {{ fileSize }}
      <div v-if="isImage && showImageEditorButton">
        <Button @click="click()" label="Im Bild-Editor öffnen"/>
      </div>
    </template>
  </Card>
  
</template>

<script>
import Card from "primevue/card";
import { download } from "../functions/helper";

export default {
  props: {
    asset: Object,
    editable: {
      type: Boolean,
      default: false
    },
    showImageEditorButton: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    name(){
      return this.asset.name;
    },
    file(){
      return this.asset.file;
    },
    fileSize(){
      if(!this.file) return "";
      let size=this.file.code.length;
      let unit="B";
      if(size>1000000){
        size/=1000000;
        unit="MB";
      }else if(size>1000){
        size/=1000;
        unit="KB";
      }
      if(unit!=="B"){
        size=size.toFixed(1);
      }
      return size+" "+unit;
    },
    isImage(){
      return this.file.mime.indexOf('image')>=0;
    }
  },
  data(){
    return {

    };
  },
  methods: {
    download(){
      let data=this.asset.file.code;
      var mime = data.split(',')[0].split(':')[1].split(';')[0];
      download(data,this.asset.name,mime);
    },
    trash(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Willst du dieses Asset wirklich löschen?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.$emit("delete");
        },
        reject: () => {
            
        }
      });
    },
    click(){
      if(!this.editable && this.isImage){
        this.$emit("open-image-editor",this.asset);
      }
    }
  },
  emits: ["edit","open-image-editor","delete"],
  components: {
    Card
  }
};
</script>