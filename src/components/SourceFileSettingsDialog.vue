<template>
  <Dialog :header="header" v-model:visible="show" :maximizable="true" :modal="true">
    <template v-if="sourceFile!=null">
      <div :style="{display: 'flex', 'place-items':'baseline'}">
        <IftaLabel :style="{flex: 1}">
          <InputText id="filename" v-model="data.name" fluid/>
          <label for="filename">Name der Datei</label>
        </IftaLabel>
        <div>
          .{{ sourceFile.fileType }}
        </div>
      </div>
      <small v-if="nameError" class="p-error">{{nameError}}</small>
      <template v-if="sourceFile.fileType==='html'">
        <p :style="{display: 'flex', 'place-items': 'center'}"><ToggleSwitch id="use-global-css" v-model="data.useGlobalCSS"/> <label for="use-global-css" style="margin-left: 0.4rem;">Projekt-CSS-Sheet verwenden</label></p>
      </template>
    </template>
    <template #footer>
      <Button icon="pi pi-times" severity="secondary" label="Abbrechen" @click="confirm()"/>
      <Button icon="pi pi-check" label="OK" @click="confirm()"/>
    </template>
  </Dialog>
</template>

<script>
export default {
  components: {

  },
  props: {
    project: Object
  },
  data(){
    return {
      show: false,
      sourceFile: null,
      data: {
        name: null,
        useGlobalCSS: false
      }
    };
  },
  mounted(){
    
  },
  computed: {
    header(){
      return this.sourceFile? this.sourceFile.name:"";
    },
    nameError(){
      let name=this.data.name;
      if(name===this.sourceFile.name) return false;
      if(name.length===0){
        return "Der Name muss aus mindestens einem Zeichen bestehen.";
      }
      if(!/^[A-Za-z]/.test(name)){
        return "Der Name muss mit einem Buchstaben beginnen."
      }
      if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)){
        return "Der Name darf nur aus Buchstaben, Ziffern und dem Unterstrich bestehen.";
      }
      if(name==='App'){
        return "Der Name 'App' ist reserviert. Wähle einen anderen Namen.";
      }
      let c=this.project.getClazzByName(name);
      if(c){
        if(c.isNative()){
          return "Es gibt bereits eine eingebaute Klasse mit diesem Namen.";
        }else{
          return "Es gibt bereits eine Klasse mit diesem Namen.";
        }
      }
      return false;
    }
  },
  methods: {
    confirm(){
      this.sourceFile.name=this.data.name;
      this.sourceFile.useGlobalCSS=this.data.useGlobalCSS;
      this.show=false;
    },
    open(sf){
      this.sourceFile=sf;
      this.data.name=sf.name;
      this.data.useGlobalCSS=sf.useGlobalCSS;
      this.show=true;
    }
    
  }
}
</script>