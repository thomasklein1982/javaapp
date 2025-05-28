export default class Storage{
    constructor(name,db){
      this.name=name;
      this.db=db;
    }
    static async getStorageNames(){
      if(!window.indexedDB) return null;
      let bases=await indexedDB.databases();
      let array=[];
      for(let i=0;i<bases.length;i++){
        array.push(bases[i].name);
      }
      return array;
    }
    static deleteStorage(name){
      if(!window.indexedDB) return;
      indexedDB.deleteDatabase(name);
    }
    static async create(name){
      if(!window.indexedDB) return null;
      let openRequest= window.indexedDB.open(name, 1);
      // Register two event handlers to act on the database being opened successfully, or not
      let p=new Promise((fulfill,reject)=>{
        
        openRequest.onerror = (event) => {
          fulfill(null);
        };

        openRequest.onsuccess = (ev) => {
          let db = ev.target.result;
          fulfill(db);
        };

        // This event handles the event whereby a new version of the database needs to be created
        // Either one has not been created before, or a new version number has been submitted via the
        // window.indexedDB.open line above
        //it is only implemented in recent browsers
        openRequest.onupgradeneeded = (event) => {
          let db = event.target.result;
          db.onerror = (event) => {
            fulfill(null);
          };
          let storeName=db.objectStoreNames[0];
          let objectStore=db.createObjectStore(storeName, { keyPath: null });
        }; 
      });
      let db=await p;
      if(!db) throw "Datenbank konnte nicht geladen werden";
      return new Storage(name,db);
    }
    async hasKey(key){
      let keys=await this.getKeys();
      if(keys.indexOf(key)>=0) return true;
      return false;
    }
    async getKeysAndValues(){
      let data=[];
      let promises=[];
      let keys=await this.getKeys();
      for(let i=0;i<keys.length;i++){
        let k=keys[i];
        let p=this.load(k);
        promises.push(p);
      }
      let values=await Promise.all(promises);
      for(let i=0;i<values.length;i++){
        let v=JSON.stringify(values[i],null,2);
        if(v.length>300) v=v.substring(0,300)+"...";
        data.push({
          key: keys[i],
          value: v
        });
      }
      return data;
    }
    async getKeys(){
      let keys;
      if(!window.indexedDB){
        keys=[];
        for (let i = 0; i < localStorage.length; i++) {
          keys.push(localStorage.key(i));
        }
      }else{
        let storeName=this.db.objectStoreNames[0];
        const transaction = this.db.transaction([storeName]);
        let p=new Promise((fulfill,reject)=>{
          const objectStore = transaction.objectStore(storeName);
          let request=objectStore.getAllKeys();
          request.onsuccess=(ev)=>{
            fulfill(ev.target.result);
          };
          request.onerror=(ev)=>{
            throw "Die Keys konnten nicht abgerufen werden.";
          };
        });
        keys=await p;
      }
      return keys;
    }
    async load(key){
      let item=await this.getItem(key);
      return item;
    }
    async save(key, value){
      return await this.setItem(key,value);
    }
    async getItem(key){
      if(!window.indexedDB) return localStorage.getItem(key);
      let storeName=this.db.objectStoreNames[0];
      const transaction = this.db.transaction([storeName]);
      let p=new Promise((fulfill,reject)=>{
        const objectStore = transaction.objectStore(storeName);
        let request=objectStore.get(key,"key");
        request.onsuccess=(ev)=>{
          fulfill(ev.target.result);
        };
      });
      let q=await p;
      return q;
    }
    remove(key){
      if(!window.indexedDB){
        localStorage.removeItem(key);
      }else{
        let storeName=this.db.objectStoreNames[0];
        const transaction = this.db.transaction([storeName],'readwrite');
        const objectStore = transaction.objectStore(storeName);
        objectStore.delete(key);
      }
    }
    removeAll(){
      if(!window.indexedDB){
        localStorage.clear();
      }else{
        let storeName=this.db.objectStoreNames[0];
        const transaction = this.db.transaction([storeName],'readwrite');
        const objectStore = transaction.objectStore(storeName);
        objectStore.clear();
      }
    }
    async setItem(key,item){
      if(!window.indexedDB) {
        try{
          localStorage.setItem(key,item);
          return true;
        }catch(e){
          return false;
        }
      }
      let storeName=this.db.objectStoreNames[0];
      const transaction = this.db.transaction([storeName], 'readwrite');
      let p=new Promise((fulfill,reject)=>{
      
        // Report on the success of the transaction completing, when everything is done
        transaction.oncomplete = () => {
          fulfill();
        };

        // Handler for any unexpected error
        transaction.onerror = (ev) => {
          throw "Datenbank-Fehler set item";
        };

        // Call an object store that's already been added to the database
        let storeName=this.db.objectStoreNames[0];
        const objectStore = transaction.objectStore(storeName);

        // Make a request to add our newItem object to the object store
        const objectStoreRequest = objectStore.put(item,key);
        objectStoreRequest.onsuccess = (event) => {
          fulfill(true);
        };
        objectStoreRequest.onerror = (event) => {
          fulfill(false);
        };
      });
      //await p;
    }
  }