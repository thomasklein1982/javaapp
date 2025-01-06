<template>
  <Dialog header="Asset-Manager" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <NewAssetDialog 
      ref="newAssetDialog"
      @confirm="addAsset"
    />
    <ImportAssetDialog 
      ref="importAssetDialog"
      @confirm="addAsset"
    />
    <EditAssetDialog 
      ref="editAssetDialog"
      @confirm="updateAsset"
      @delete="deleteAsset"
      @open-image-editor="asset=>$emit('open-image-editor',asset)"
    />
    Assets sind statische Ressourcen wie Bilder oder Sounds. Dieses Projekt verwendet <strong style="white-space: nowrap;">{{ assets.length }} Asset{{assets.length!==1? 's':''}}</strong> mit einer Gesamtgröße von <span style="white-space: nowrap; font-weight: bold" :style="{color: farbeGroesse}">{{ gesamtGroesseString }}</span>.
    <Paginator v-model:rows="rows" v-model:first="first" :totalRecords="assets.length" :rowsPerPageOptions="[10, 20, 30]">
      <template #end>
        <Button type="button" icon="pi pi-sort" />
      </template>
    </Paginator>
    <template v-for="i in maxAssets">
      <Asset :asset="assets[first+i-1]" editable @edit="editAssetAt(first+i-1)">
      </Asset>
    </template>
    
    <template #footer>
      <Button @click="$refs.importAssetDialog.setVisible(true)" icon="pi pi-plus" label="Importieren"/>
      <Button @click="$refs.newAssetDialog.setVisible(true)" icon="pi pi-plus" label="Hochladen"/>
    </template>
  </Dialog>
</template>
  
<script>
  import NewAssetDialog from './NewAssetDialog.vue';
  import Paginator from "primevue/paginator";
  import Asset from './Asset.vue';
  import EditAssetDialog from './EditAssetDialog.vue';
  import ImportAssetDialog from './ImportAssetDialog.vue';

  export default{
    props: {
      project: Object
    },
    data(){
      return {
        show: false,
        first: 0,
        rows: 10,
        editAssetIndex: -1
      };
    },
    computed: {
      assets(){
        return this.project.assets;
      },
      farbeGroesse(){
        let s=this.gesamtGroesse;
        if(s<1000000){
          return "lime";
        }else if(s<5000000){
          return "yellow";
        }else{
          return "red";
        }
      },
      gesamtGroesse(){
        let size=0;
        for(let i=0;i<this.assets.length;i++){
          let a=this.assets[i];
          size+=a.file.code.length;
        }
        return size;
      },
      gesamtGroesseString(){
        let size=this.gesamtGroesse;
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
      maxAssets(){
        let max=this.assets.length-this.first;
        if(max>this.rows){
          return this.rows;
        }else{
          return Math.max(0,max);
        }
      }
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      addAsset(asset){
        this.project.addAsset(asset);
      },
      editAssetAt(index){
        this.editAssetIndex=index;
        this.$refs.editAssetDialog.open(this.assets[this.editAssetIndex]);
      },
      updateAsset(asset){
        let a=this.assets[this.editAssetIndex];
        a.file=asset.file;
        a.name=asset.name;
      },
      deleteAsset(){
        this.project.deleteAssetAt(this.editAssetIndex);
      }
    },
    components: {
      NewAssetDialog,
      Paginator,
      Asset,
      EditAssetDialog,
      ImportAssetDialog
    }
  }
  </script>