<template>
  <Dialog header="Asset hochladen" v-model:visible="show" :modal="true">
    <div style="margin: 0.4rem; text-align: center">
      <Button
        label="Datei auswählen"
        icon="pi pi-upload"
        @click="uploadFile()"
      />
    </div>
    <template v-if="asset">
      <Asset :asset="asset" style="margin: 0.8rem; text-align: center"/>
      <div style="margin: 0.4rem; text-align: center">
        <label for="name">Name: </label>
        <InputText id="name" v-model="name" />
      </div>
    </template>
    <template #footer>
      <Button @click="show=false" icon="pi pi-times" label="Abbrechen"/>
      <Button @click="confirm()" :disabled="!name || !asset" icon="pi pi-check" label="Hochladen"/>
    </template>
  </Dialog>
</template>
  
<script>
  import FileUpload from "primevue/fileupload";
import { upload } from "../functions/helper";
import Asset from "./Asset.vue";
  
  export default{
    props: {
    },
    data(){
      return {
        show: false,
        asset: null,
        name: ""
      };
    },
    computed: {
      
    },
    methods: {
      setVisible(v){
        this.name="";
        this.asset=null;
        this.show=v;
      },
      async uploadFile(){
        let file=await upload({dataURL: true});
        let name=file.fileName;
        let pos=name.indexOf(".");
        if(pos>=0){
          name=name.substring(0,pos);
        }
        this.name=name;
        this.asset={
          name: this.name,
          file
        };
      },
      confirm(){
        this.show=false;
        this.asset.name=this.name;
        this.$emit("confirm",this.asset);
      }
    },
    components: {
      Asset
    }
  }
  </script>