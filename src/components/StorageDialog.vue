<template>
  <Dialog header="Speichernutzung" v-model:visible="show" :modal="true" maximizable>
    <p>Hier kannst du die gespeicherten Daten von JavaApp sehen und verwalten.</p>
    <h1>LocalStorage</h1>
    <h1>IndexedDB</h1>
    <div v-for="(db,i) in indexedDB">
      <h3>{{ db.storage.name }} <Button text icon="pi pi-trash" @click="deleteStore(db.storage)"/></h3>
      <table class="storage-table">
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th></th>
        </tr>
        <tr v-for="(kv,j) in db.keysValues">
          <td>{{ kv.key }}</td>
          <td style="white-space: pre">{{ kv.value }}</td>
          <td><Button text icon="pi pi-trash" @click="deleteKey(db.storage,kv.key)"/></td>
        </tr>
      </table>
      <div style="margin-top: 0.2rem;">
        <InputText v-model.trim="key" placeholder="Key"/>
        <InputText v-model.trim="value" placeholder="Value"/>
        <Button @click="addKey(db.storage,key,value)" icon="pi pi-save"/>
      </div>

    </div>
    <template #footer>
      <Button @click="updateStorage()" icon="pi pi-refresh" label="Daten aktualisieren"/>
    </template>
  </Dialog>
</template>
  
<script>
  import Storage from '../classes/Storage';

  export default {
    props: {
      project: Object
    },
    data(){
      return {
        show: false,
        localStorage: [],
        indexedDB: {},
        key: "",
        value: ""
      };
    },
    methods: {
      async deleteStore(store){
        Storage.deleteStorage(store.name);
        this.updateStorage();
      },
      async deleteKey(store, key){
        await store.remove(key);
        this.updateSingleStorage(store);
      },
      async addKey(store,key,value){
        this.key="";
        this.value="";
        await store.save(key,value);
        this.updateSingleStorage(store);
      },
      setVisible(v){
        this.show=v;
      },
      async updateSingleStorage(store){
        let kv=await store.getKeysAndValues();
        this.indexedDB[store.name].keysValues=kv;
      },
      async updateStorage(){
        this.localStorage=[];
        this.indexedDB={};
        let dbNames=await Storage.getStorageNames();
        for(let i=0;i<dbNames.length;i++){
          try{
            let store=await Storage.create(dbNames[i]);
            let kv=await store.getKeysAndValues();
            this.indexedDB[store.name]={
              storage: store,
              keysValues: kv
            };
          }catch(e){
            console.error(e);
          }
        }
      }
    },
    components: {
      
    }
  }
  </script>

<style scoped>
  .storage-table{
    font-family: monospace, monospace;
    border-collapse: collapse;
  }
  .storage-table td, .storage-table th{
    border: 1pt solid white;
    padding: 0.2rem;
  }
</style>