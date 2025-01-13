<template>
  <Dialog ref="dialog" header="Asset importieren" v-model:visible="show" :modal="true" maximizable>
    <div>
      <Tabs scrollable v-model:value="selectedTab">
        <TabList>
          <Tab :value="i" v-for="(c,i) in categories">
            {{c.title}}
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel :value="i" v-for="(c,i) in categories">
            <div style="float: right; position: sticky; top: 0.5rem;">
              <div style="display: grid; place-content: end; margin-bottom: 1rem;"><div style="width: 3cm"><Slider v-model="previewSize"/></div></div>
              <div :style="{'width': ((previewSize+50)*0.04)+'cm', 'height': ((previewSize+50)*0.04)+'cm'}" style="background-color: white; border: 1pt solid orange;">
                <img v-if="asset" style="width: 100%; height: 100%; object-fit: contain" :src="fullAssetUrl">
                <div v-else style="width: 100%; height: 100%; text-align: center; place-content: center; display: grid;">
                  Kein Asset ausgewählt
                </div>
              </div>
            </div>
            <div v-for="(p,j) in c.assets" :style="{'width': ((thumbSize+50)*0.02)+'cm', 'height': ((thumbSize+50)*0.02)+'cm'}" style="display:inline-block">
              <img :title="p" style="width: 100%; height: 100%; object-fit: contain" @click="asset=p" :src="'https://thomaskl.uber.space/Webapps/Assets/'+p">
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
    <template #footer>
      <div style="font-size: small" v-html="message"></div>
        <Slider style="align-self: center; width: 4cm; margin: 0.5rem;" v-model="thumbSize"/>
        <Button @click="confirm()" :disabled="!asset" icon="pi pi-check"/>
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
        thumbSize: 50,
        previewSize: 50,
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
      changePreviewSize(dir){
        this.previewSize+=2*dir;
      },
      setVisible(v){
        this.name="";
        this.asset=null;
        this.show=v;
        this.$refs.dialog.maximized=true;
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