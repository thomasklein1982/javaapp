<template>
  <Dialog header="Assets" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <NewAssetDialog 
      ref="newAssetDialog"
      @confirm="addAsset"
    />
    <EditAssetDialog 
      ref="editAssetDialog"
      @confirm="updateAsset"
      @delete="deleteAsset"
    />
    Assets sind statische Ressourcen wie Bilder oder Sounds. Dieses Projekt verwendet {{ assets.length }} Asset{{assets.length!==1? 's':''}} mit einer Gesamtgröße von {{ gesamtGroesse }}.
    <Paginator v-model:rows="rows" v-model:first="first" :totalRecords="assets.length" :rowsPerPageOptions="[10, 20, 30]">
    </Paginator>
    <template v-for="i in maxAssets">
      <Asset :asset="assets[first+i-1]" editable @edit="editAssetAt(first+i-1)">
      </Asset>
    </template>
    
    <template #footer>
      <Button @click="$refs.newAssetDialog.setVisible(true)" icon="pi pi-plus" label="Asset hochladen"/>
    </template>
  </Dialog>
</template>
  
<script>
  import NewAssetDialog from './NewAssetDialog.vue';
  import Paginator from "primevue/paginator";
  import Asset from './Asset.vue';
  import EditAssetDialog from './EditAssetDialog.vue';

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
      gesamtGroesse(){
        let size=0;
        for(let i=0;i<this.assets.length;i++){
          let a=this.assets[i];
          size+=a.file.code.length;
        }
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
          return max;
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
      EditAssetDialog
    }
  }
  </script>