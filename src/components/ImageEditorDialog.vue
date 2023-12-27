<template>
  <Dialog :closable="false" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <ImageEditor 
      ref="editor"
    />
    <template #header>
      <div class="flex-container" style="width: 100%">
        <div class="flex" style="font-size: 120%; font-weight: bold">{{ asset? asset.name:"Bild-Editor" }}</div>
        <Button rounded outlined severity="danger" icon="pi pi-times" @click="close()" style="margin-right: 0.2rem"/>
        <Button rounded outlined icon="pi pi-check" @click="save()"/>
      </div>
    </template>
  </Dialog>
</template>
  
<script>
  import { nextTick } from 'vue';
import ImageEditor from './ImageEditor.vue';
  
  export default {
    props: {
      project: Object
    },
    data(){
      return {
        show: false,
        asset: null,
        assetEdited: null
      };
    },
    methods: {
      open(asset){
        this.show=true;
        this.asset=asset;
        this.assetEdited={
          name: asset.name,
          data: asset.file.code
        };
        nextTick(()=>{
          this.$refs.editor.setAsset(this.assetEdited);
        });
      },
      close(){
        this.show=false;
      },
      save(){
        this.$refs.editor.saveChanges();
        this.asset.file.code=this.assetEdited.data;
        this.show=false;
      }
    },
    components: {
      ImageEditor
    }
  }
  </script>