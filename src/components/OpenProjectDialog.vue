<template>
  <Dialog :header="titleText" v-model:visible="show" :modal="true">
    <template v-if="project">
      <p style="font-style: italic">
        <template v-if="project.javaappVersion">
          {{ project.date }}, JavaApp-Version {{ project.javaappVersion }}
        </template>
        <template v-else>
          Datum und Java-App-Version unbekannt (vor August 2024 bzw. Version 350)
        </template>
      </p>
      <template v-if="project.description">
        <h2>Beschreibung</h2>
        {{ project.description }}
      </template>

      <SelectButton :disabled="!allowImporting" v-model="mode" optionValue="value" optionLabel="label" :options="[{label: 'Als neues Projekt öffnen', value: 'open'},{label: 'In bestehendes Projekt importieren', value: 'import'}]"/>

      <template v-if="project.clazzes && project.clazzes.length>0">
        <h2>Klassen und Interfaces</h2>
        
        <MultiSelect
          v-model="selection.clazzes"
          :options="project.clazzes"
          :option-label="getClazzName"
          display="chip"
          :fluid="true"
          placeholder="Klassen auswählen"
        >
          <template #option="slotProps">
            <div class="flex-container fullwidth" style="align-items: center"><span class="flex">{{ slotProps.option.name }} <span v-if="mode=='import' && inConflict.clazzes[slotProps.option.name]">(wird überschrieben)</span></span> <Button rounded text size="small" @click.stop="showClazz(slotProps.option)" icon="pi pi-eye"/></div>
          </template>
        </MultiSelect>
        <p class="warning">{{warnings.clazzes}}</p>
      </template>
      <template v-if="project.assets && project.assets.length>0">
        <h2>Assets</h2>
        <MultiSelect
          v-model="selection.assets"
          :options="project.assets"
          :option-label="getAssetName"
          display="chip"
          placeholder="Assets auswählen"
        >
          <template #option="slotProps">
            <div>
              <div>{{ slotProps.option.name }} <span v-if="mode=='import' && inConflict.assets[slotProps.option.name]">(wird überschrieben)</span></div>
            </div>
          </template>
        </MultiSelect>
        <p class="warning">{{warnings.assets}}</p>
      </template>
      <template v-if="project.database && project.database.tables.length>0">
        <h2>Datenbank-Relationen</h2>
        <MultiSelect
          v-model="selection.relations"
          :options="project.database.tables"
          :option-label="getRelationName"
          display="chip"
          placeholder="Relationen auswählen"
        >
          <template #option="slotProps">
            <div>
              <div>{{ slotProps.option.name }} <span v-if="mode=='import' && inConflict.relations[slotProps.option.name]">(wird überschrieben)</span></div>
            </div>
          </template>
        </MultiSelect>
        <p class="warning">{{warnings.relations}}</p>
      </template>
      
    </template>
    <template v-else>
      Sorry, bei der hochgeladenen Datei scheint es sich nicht um ein JavaApp-Projekt zu handeln.
    </template>
    
    <template #footer>
      <Button :disabled="!project" v-if="allowImporting && mode=='import'" @click="importSelection()" icon="pi pi-file-import" label="In bestehendes Projekt importieren"/>
      <Button v-if="mode=='open'" :disabled="!project" @click="openProject()" icon="pi pi-file" label="Als neues Projekt öffnen"/>
    </template>

    <Dialog v-model:visible="contentsDialog.show" maximizable :header="contentsDialog.title">
      <Textarea class="fullwidth" auto-resize v-model="contentsDialog.content"></Textarea>
    </Dialog>
  </Dialog>
</template>
  
<script>
import MultiSelect from "primevue/multiselect";
import Textarea from "primevue/textarea";
  
  export default{
    props: {
    },
    data(){
      return {
        show: false,
        allowImporting: true,
        selection: {
          clazzes: [],
          assets: [],
          relations: []
        },
        inConflict: {
          clazzes: {},
          assets: {},
          relations: {}
        },
        project: null,
        mode: "open",
        contentsDialog: {
          show: false,
          title: null,
          content: null
        }
      };
    },
    computed: {
      titleText(){
        if(!this.project) return "Fehlerhafte Datei";
        return "Projekt "+this.project.name;
      },
      currentProject(){
        if(!this.$root.$refs.editor.project) return null;
        return this.$root.$refs.editor.project;
      },
      warnings(){
        let w={
          clazzes: null,
          assets: null,
          relations: null
        }
        if(this.mode=='open') return w;
        w.clazzes=this.createOverwriteWarning(this.inConflict.clazzes,this.selection.clazzes,"Element","Elemente");
        w.assets=this.createOverwriteWarning(this.inConflict.assets,this.selection.assets,"Asset","Assets");
        w.relations=this.createOverwriteWarning(this.inConflict.relations,this.selection.relations,"Relation","Relationen");
        return w;
      }
    },
    methods: {
      showClazz(c){
        this.contentsDialog.title="Inhalt von "+c.name;
        this.contentsDialog.content=c.src;
        this.contentsDialog.show=true;
      },
      createOverwriteWarning(inConflict,selection,singular,plural){
        let count=0;
        for(let i=0;i<selection.length;i++){
          if(inConflict[selection[i].name]) count++;
        }
        if(count===1){
          return "1 "+singular+" wird überschrieben";
        }else if(count>1){
          return count+" "+plural+" werden überschrieben";
        }else{
          return null;
        }
      },
      open(p,allowImporting){
        this.mode="open";
        this.project=p;
        this.show=true;
        this.allowImporting=allowImporting;
        this.selection.clazzes=p.clazzes;
        this.selection.assets=p.assets;
        this.selection.relations=p.database.tables;
        
        //if(!allowImporting) return;
        for(let i=0;i<this.project.clazzes.length;i++){
          let c=this.project.clazzes[i];
          if(!c.name){
            if(i==0){
              c.name="Main";
            }
            let offset=6;
            let p1=c.src.indexOf("class");
            if(p1<0){
              p1=c.src.indexOf("interface");
              offset=10;
            }
            if(p1>=0){
              p1+=offset;
              let name=c.src.substring(p1).trim();
              p1=name.search(/\W/);
              if(p1>=0){
                c.name=name.substring(0,p1).trim();
              }
            }
          }
        }
        this.inConflict={
          clazzes: {},
          assets: {},
          relations: {}
        };
        if(!this.currentProject) return;
        for(let i=0;i<this.project.clazzes.length;i++){
          let c=this.project.clazzes[i];
          if(this.currentProject.getClazzByName(c.name)){
            this.inConflict.clazzes[c.name]=true;
          }
        }
        for(let i=0;i<this.project.assets.length;i++){
          let c=this.project.assets[i];
          if(this.currentProject.getAssetByName(c.name)){
            this.inConflict.assets[c.name]=true;
          }
        }
        for(let i=0;i<this.project.database.tables.length;i++){
          let c=this.project.database.tables[i];
          if(this.currentProject.database.getTableByName(c.name)){
            this.inConflict.relations[c.name]=true;
          }
        }
        // for(let i=0;i<this.project.assets.length;i++){
        //   let a=this.project.assets[i];
          
        // }
      },
      importSelection(){
        this.show=false;
        this.filterBySelection();
        this.$emit("importProject",this.project);
        //this.currentProject.add(this.project);
      },
      filter(allData,selectedData){
        let filtered=[];
        for(let i=0;i<allData.length;i++){
          let d=allData[i];
          if(selectedData.indexOf(d)>=0){
            filtered.push(d);
          }
        }
        return filtered;
      },
      filterBySelection(){
        this.project.clazzes=this.filter(this.project.clazzes,this.selection.clazzes);
        this.project.assets=this.filter(this.project.assets,this.selection.assets);
        this.project.database.tables=this.filter(this.project.database.tables,this.selection.relations);
      },
      openProject(){
        this.show=false;
        this.filterBySelection();
        this.$emit("openProject",this.project);
      },
      getClazzName(clazz){
        let t=clazz.name;
        if(this.mode=='import' && this.inConflict.clazzes[clazz.name]){
          t+=" (!)";
        }
        return t;
      },
      getAssetName(asset){
        let t=asset.name;
        if(this.mode=='import' && this.inConflict.assets[asset.name]){
          t+=" (!)";
        }
        return t;
      },
      getRelationName(relation){
        let t=relation.name;
        if(this.mode=='import' && this.inConflict.relations[relation.name]){
          t+=" (!)";
        }
        return t;
      }
    },
    components: {
      MultiSelect, Textarea
    }
  }
  </script>

<style scoped>
.warning{
  font-size: small;
  color: red;
}

</style>