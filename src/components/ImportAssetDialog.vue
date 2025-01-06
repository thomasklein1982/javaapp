<template>
  <Dialog header="Asset importieren" v-model:visible="show" :modal="true">
    <div>
      <Tabs v-model:value="selectedTab">
        <TabList>
          <Tab :value="i" v-for="(c,i) in categories">
            {{c.title}}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel :value="i" v-for="(c,i) in categories">
            <div style="float: right; width: 3cm; min-height: 3cm; background-color: #222; border: 1pt solid orange; position: sticky; top: 0.5rem;">
              <img :src="fullAssetUrl" style="width: 3cm">
            </div>
            <img @click="asset=p" v-for="(p,j) in c.assets" :src="'https://thomaskl.uber.space/Webapps/Assets/'+p">
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
    <template #footer>
      <div style="font-size: small" v-html="message"></div>
      <Button @click="show=false" icon="pi pi-times" label="Abbrechen"/>
      <Button @click="confirm()" :disabled="!asset" icon="pi pi-check" label="Importieren"/>
    </template>
  </Dialog>
</template>
  
<script>
import Asset from "./Asset.vue";
import { TabList, Tabs,Tab, TabPanels, TabPanel } from "primevue";
import * as AssetsModule from '../consts/assets.json';
import { urlToDataURL } from "../functions/urlToDataURL";
import { mimes } from "../consts/mimes";
  
let Assets={};
let selectedTab=null;
for(let a in AssetsModule.default){
  if(selectedTab===null) selectedTab=a;
  Assets[a]=AssetsModule[a];
}

  export default{
    props: {
    },
    emits: ["confirm"],
    data(){
      return {
        selectedTab: selectedTab,
        categories: Assets,
        show: false,
        asset: null,
        name: "",
        message: null,
        timer: null
      };
    },
    computed: {
      fullAssetUrl(){
        if(!this.asset) return null;
        return 'https://thomaskl.uber.space/Webapps/Assets/'+this.asset;
      }
    },
    methods: {
      setVisible(v){
        this.name="";
        this.asset=null;
        this.show=v;
      },
      async confirm(){
        //this.show=false;
        if(this.timer) clearTimeout(this.timer);
        let pos=this.asset.lastIndexOf("/");
        let filename=this.asset.substring(pos+1);
        let s=filename.split(".");
        let name=s[0];
        let ext=s[1];
        let mime=mimes[ext];
        let code=await urlToDataURL(this.fullAssetUrl);
        if(code===null){
          this.message="Fehler beim Importieren";
        }else{
          this.$emit("confirm",{name, file: {name: filename, mime, code}});
          this.asset=null;
          this.message="Asset <em>"+name+"</em> importiert";
        }
        this.timer=setTimeout(()=>{
          this.message=null;
        },2000);
      }
    },
    components: {
      Asset, Tabs, TabPanel, Tab, TabList, TabPanels
    }
  }
  </script>