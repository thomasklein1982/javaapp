<template>
  <div style="text-align: center; position: absolute; left: 0; top: 0; background-color: #1f2d40; color: white; z-index: 2; width: 100%; height: 100%; overflow-y: auto">
    <h1 style="margin-bottom: 0">Willkommen bei</h1>
    <span style="position: relative"><img alt="logo" src="/Logo-white.png" style="width: 3cm"><span v-if="isEasy" style="font-size: 120%; color: yellow; writing-mode: vertical-lr;">Easy!</span></span>
    
    <p>Version {{$root.version}}</p>
    <p>Mit JavaApp kannst du Web-Apps mit Java programmieren, die auf allen Geräten laufen.</p>
    
    <p>Wähle eine der folgenden Möglichkeiten:</p>
    <div style="text-align: center">
      <Button :disabled="lastProject===null" style="margin: 0.5rem;" icon="pi pi-replay" @click="restoreApp()" label="Letzte App wiederherstellen"/>
      <Button style="margin: 0.5rem;" icon="pi pi-file" @click="$refs.dialogNewApp.setVisible(true)" label="Neue App erstellen"/>
      <Button style="margin: 0.5rem;" icon="pi pi-upload" @click="clickUploadApp()" label="App hochladen"/>
    </div>

    <InlineMessage style="max-width: 60%; margin-top: 0.8rem" severity="info">
      <template v-if="isEasy">
        JavaApp ist im "Easy"-Modus. Das bedeutet, dass einige Dinge vereinfacht wurden.
        <span style="display: block; text-align: center">
          <Button severity="secondary" @click="changeMode(false)" label="In den normalen Modus wechseln"/>
        </span>
      </template>
      <template v-else>
        JavaApp ist im normalen Modus. Damit schreibst du ganz normalen Java-Code.
        <span style="display: block; text-align: center">
          <Button severity="secondary" @click="changeMode(true)" label="In den Easy-Modus wechseln"/>
        </span>
      </template>
    </InlineMessage>
    <NewAppDialog @newapp="createNewApp" ref="dialogNewApp"/>
  </div>
</template>

<script>
import {Project} from "../classes/Project.js";
import { loadLocally } from "../functions/helper.js";
import { STORAGE_PROJECT } from "../consts/strings.js";
import { uploadProject } from "../functions/uploadProject.js";
import NewAppDialog from "./NewAppDialog.vue";
import InlineMessage from "primevue/inlinemessage";
import {options} from "../classes/Options.js";

export default {
  props: {
    isEasy: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      lastProject: null,
    }
  },
  mounted(){
    loadLocally(STORAGE_PROJECT).then((p)=>{
      this.lastProject=p;
    });
  },
  methods: {
    async changeMode(easy){
      if(easy){
        await options.changeToEasy();
      }else{
        await options.changeToNormal();
      }
      location.reload();
    },
    async restoreApp(){
      var p=new Project();
      await p.fromSaveString(this.lastProject);
      this.$emit('open-project',p);
    },
    async createNewApp(name,code){
      var p=new Project(name,code);
      await p.initialize();
      this.$emit('open-project',p);
    },
    async clickUploadApp(){
      let p=await uploadProject();
      if(!p) return;
      this.$emit('open-project',p);
    }
  },
  components: {
    NewAppDialog,
    InlineMessage
  }
}
</script>

<style scoped>

</style>