<template>
  <Dialog header="Asset bearbeiten" v-model:visible="show" :modal="true">
    <div style="margin: 0.4rem; text-align: center">
      <Button
        label="Neue Datei auswählen"
        icon="pi pi-upload"
        @click="uploadFile()"
      />
    </div>
    <Asset :asset="editedAsset" style="margin: 0.8rem; text-align: center"/>
    <div style="margin: 0.4rem; text-align: center">
      <label for="name">Name: </label>
      <InputText id="name" v-model="editedAsset.name" />
    </div>
    <template #footer>
      <ConfirmPopup/>
      <Button @click="trash($event)" icon="pi pi-trash"/>
      <Button @click="show=false" icon="pi pi-times" label="Abbrechen"/>
      <Button @click="confirm()" :disabled="!editedAsset.name" icon="pi pi-check" label="OK"/>
    </template>
  </Dialog>
</template>
  
<script>
  import FileUpload from "primevue/fileupload";
import { upload } from "../functions/helper";
import Asset from "./Asset.vue";
  
  export default{
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