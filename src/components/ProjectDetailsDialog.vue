<template>
  <Dialog header="Projekt-Details" modal v-model:visible="show">
    <p>Hier kannst du Details zum Projekt festlegen und ein Manifest und einen Service-Worker herunterladen. <Button @click="showHelp=true" icon="pi pi-question" outlined style="float: right"/></p>
    <div class="p-float-label">
      <InputText style="width: 100%" help="Der Name des Projekts." v-model="name"/>
      <label>Name</label>
    </div>
    <div class="p-float-label">
      <TextArea style="width: 100%" v-model="description"/>
      <label>Beschreibung</label>
    </div>
    <div>
      <span class="nowrap">Theme-Color: <ColorPicker v-model="theme_color"/></span> <span class="nowrap">Background-Color: <ColorPicker v-model="background_color"/></span>
    </div>
    <div>
      Icon: 
      <template v-if="iconOptions.length>0">
        <Dropdown :options="iconOptions" v-model="icon"/>
        <img style="float: right;" :src="iconData" width="100" height="100"/>
      </template>
      <template v-else>Du hast keine Bilder als Assets hochgeladen, die als Icon verwendet werden könnten.</template>
    </div>
    <div>
      <div class="p-float-label">
        <Chips id="chips" v-model="urls" separator=" " />
        <label for="chips">URLs, die gecached werden sollen</label>
      </div>
    </div>
    <Dialog header="Hilfe" modal v-model:visible="showHelp">
      <h2>Wozu dienen Manifest und Service-Worker?</h2>
      <p>Wenn du deine App herunterlädst, erhältst du eine HTML-Datei, also im Prinzip eine Website. Diese kannst du online stellen (z. B. auf GitHub Pages oder Glitch).</p>
      <p>Wenn du zusätzlich das Manifest und den Service-Worker herunterlädst und <em>in den gleichen Ordner höchlädst wie die HTML-Datei</em>, dann bringt das folgende Vorteile:
        <ul>
          <li>Deine App funktioniert auch offline!</li>
          <li>Deine App kann installiert werden, sofern die Besucher einen Browser verwenden, der dies unterstützt.</li>
        </ul>
      </p>
      <h2>Neue Version online stellen</h2>
      <p>Wenn du später eine neue Version deiner App online stellen willst, muss du zusätzlich den Service-Worker neu herunterladen und dann sowohl deine App als auch <code>sw.js</code> neu hochladen. Ansonsten wird deine App nicht aktualisiert.</p>
    </Dialog>
    <template #footer>
      <Button @click="downloadServiceWorker()" icon="pi pi-download" label="Service-Worker"/>
      <Button @click="downloadManifest()" icon="pi pi-download" label="Manifest"/>
      <Button :disabled="!nameOK" @click="clickOK()" label="OK"/>
      <Button @click="setVisible(false)" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
</template>

<script>
import ColorPicker from "primevue/colorpicker";
import Chips from "primevue/chips";
import { download } from "../functions/helper";

export default {
  components: {
    ColorPicker, Chips
  },
  props: {
    project: Object
  },
  computed: {
    iconData(){
      for (let i = 0; i < this.project.assets.length; i++) {
        let a = this.project.assets[i];
        if(a.name===this.icon){
          return a.file.code;
        }
      }
    },
    iconOptions(){
      let array=[];
      for (let i = 0; i < this.project.assets.length; i++) {
        let a = this.project.assets[i];
        array.push(a.name);
      }
      return array;
    },
    nameOK(){
      let name=this.name.trim();
      if(name.length===0) return false;
      return true;
    }
  },
  data(){
    return {
      show: false,
      name: this.project.name,
      description: this.project.description,
      theme_color: this.project.theme_color,
      background_color: this.project.background_color,
      icon: this.project.icon,
      urls: this.project.urls,
      showHelp: false
    }
  },
  methods: {
    downloadServiceWorker(){
      let t=`/*Thanks to Lyza Gardner https://www.smashingmagazine.com/2016/02/making-a-service-worker/*/
var config={
  cacheName: '${this.name+"-"+Date.now()}',
  filesToCache: ${JSON.stringify(this.urls)}
}


self.addEventListener('install', event => {
  function onInstall (event,config) {
    return caches.open(config.cacheName)
      .then(cache => cache.addAll(config.filesToCache)
    );
  }

  event.waitUntil(onInstall(event,config).then( () => self.skipWaiting() ));
});

self.addEventListener('activate', event => {
  function onActivate (event, opts) {
    return caches.keys()
      .then(cacheKeys => {
        var oldCacheKeys = cacheKeys.filter(key => key.indexOf(opts.cacheName) !== 0);
        var deletePromises = oldCacheKeys.map(oldKey => caches.delete(oldKey));
        return Promise.all(deletePromises);
      });
  }

  event.waitUntil(
    onActivate(event, config)
      .then( () => self.clients.claim() )
  );
});

self.addEventListener('fetch', event => {
  
  function shouldHandleFetch (event, config) {
    var request = event.request;
    var url = new URL(request.url);
    console.log("should handle fetch",url.href);
    for(let i=0;i<config.filesToCache.length;i++){
      let file=config.filesToCache[i];
      let fileURL=new URL(file,getPathWithoutFile(location.href));
      console.log("fileURL",file,fileURL.toString());
      if(fileURL.href===url.href) return true;
    }
    return false;
  }

  function onFetch (event,config) {
    console.log("handle fetch");
    var request = event.request;
    
    event.respondWith(
      fetchFromCache(event)
        .catch(() => fetch(request))
        .then(response => addToCache(config.cacheName, request, response))
        .catch(()=>{console.log("cache and network miss",request)})
    );
  }

  if (shouldHandleFetch(event,config)) {
    onFetch(event,config);
  }
  
});

function getPathWithoutFile(path){
  let pos=path.lastIndexOf("/");
  if(pos<0) return path;
  return path.substring(0,pos+1);
}

function addToCache (cacheKey, request, response) {
  if (response.ok) {
    var copy = response.clone();
    caches.open(cacheKey).then( cache => {
      cache.put(request, copy);
    });
    return response;
  }
}

function fetchFromCache (event) {
  return caches.match(event.request).then(response => {
    if (!response) {
      // A synchronous error that will kick off the catch handler
      throw Error(event.request.url+' not found in cache');
    }
    return response;
  });
}`;
      download(t,"sw.js");
    },
    downloadManifest(){
      let t=`{
  "name": "${this.name}",
  "short_name": "${this.name}",
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#${this.theme_color}",
  "background_color": "#${this.background_color}",
  "description": "${this.description}",
  "icons": [
    {
      "src": "${this.iconData}",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}`;
      download(t,"manifest.webmanifest");
    },
    setVisible(v){
      this.name=this.project.name;
      this.description=this.project.description? this.project.description: "";
      this.theme_color=this.project.theme_color? this.project.theme_color: "";
      this.background_color=this.project.theme_color? this.project.background_color: "";
      this.icon=this.project.icon? this.project.icon:null;
      this.urls=this.project.urls? this.project.urls:[];
      this.show=v;
    },
    clickOK(){
      this.project.name=this.name.trim();
      this.project.description=this.description.trim();
      this.project.theme_color=this.theme_color;
      this.project.background_color=this.background_color;
      this.project.icon=this.icon;
      this.project.urls=this.urls;
      this.setVisible(false);
    }
  }
}
</script>

<style scoped>
  .field *{
    display: block;
  }
</style>