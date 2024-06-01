<template>
  <Dialog header="Asset bearbeiten" v-model:visible="show" :modal="true">
    <div style="margin: 0.4rem; text-align: center">
      <Button
        label="Neue Datei auswählen"
        icon="pi pi-upload"
        @click="uploadFile()"
      />
    </div>
    <Asset :asset="editedAsset" show-image-editor-button style="margin: 0.8rem; text-align: center" @open-image-editor="asset=>$emit('open-image-editor',asset)"/>
    <div style="margin: 0.4rem; text-align: center">
      <label for="name">Name: </label>
      <InputText type="search" id="name" v-model.trim="editedAsset.name" />
    </div>
    <template #footer>
      <ConfirmPopup/>
      <Button @click="trash($event)" icon="pi pi-trash" style="padding-left: 0.2rem; padding-right: 0.2rem"/>
      <Button @click="download" icon="pi pi-download" style="padding-left: 0.2rem; padding-right: 0.2rem"/>
      <Button @click="show=false" icon="pi pi-times" label="Abbrechen"/>
      <Button @click="confirm()" :disabled="!editedAsset.name" icon="pi pi-check" label="OK"/>
    </template>
  </Dialog>
</template>
  
<script>
  import FileUpload from "primevue/fileupload";
import { upload,download } from "../functions/helper";
import Asset from "./Asset.vue";

  export default{
    emits: ["open-image-editor"],
    props: {
      asset: Object
    },
    data(){
      return {
        show: false,
        editedAsset: {
          file: null,
          name: ""
        }
      };
    },
    computed: {
      
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      open(asset){
        this.editedAsset.file=asset.file;
        this.editedAsset.name=asset.name;
        this.setVisible(true);
      },
      async uploadFile(){
        let file=await upload({dataURL: true});
        this.editedAsset.file=file;
      },
      confirm(){
        this.show=false;
        this.$emit("confirm",this.editedAsset);
      },
      download(){
        let data=this.editedAsset.file.code;
        var mime = data.split(',')[0].split(':')[1].split(';')[0];
        download(data,this.editedAsset.name,mime);
      },
      trash(event) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Willst du dieses Asset wirklich löschen?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$emit("delete");
            this.setVisible(false);
          },
          reject: () => {
              
          }
        });
      },
    },
    components: {
      Asset
    }
  }
  </script>