<template>
  <Dialog header="Extensions" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <p>Ein <em>JavaApp-Extension-Paket</em> (kurz: JEP) ist eine Menge von Klassen und/oder Interfaces. Diese Klassen und Interfaces werden der Klassenbibliothek von JavaApp hinzugefügt. Durch solche JEPs können also die Funktionalitäten von JavaApp erweitert werden.</p>
    <h1>Verwendete JEPs</h1>
    <div v-for="(e,i) in $root.extensions" class="flex-container">
      <div>{{ e.name }}</div>
      <div>
        <Button icon="pi pi-trash" @click="$root.removeExtensionAtIndex(i)"/>
      </div>
    </div>
    <Button icon="pi pi-upload" @click="uploadJEP()"/>
    <h1>JEP erzeugen</h1>
    <!-- <h2>Name des Pakets</h2>
    <InputText fluid v-model="packageName"/> -->
    <!-- <h2>Klassen und Interfaces</h2> -->
    <Listbox fluid v-model="selectedUnits" multiple :options="units" option-label="name"/>
    <p v-if="selectedUnits.length===0">Nichts ausgewählt.</p>
    <p v-else>Ausgewählt: {{ selectedUnits.map((c)=>c.name).join(", ") }}</p>
    <Button :disabled="selectedUnits.length===0" label="JEP herunterladen" icon="pi pi-download" @click="downloadJEP()"/>

  </Dialog>
</template>
  
<script>
import { Listbox } from 'primevue';
import { Clazz } from '../classes/Clazz';
import { UIClazz } from '../classes/UIClazz';
import { SourceFile } from '../classes/SourceFile';
import { download, upload } from '../functions/helper';
import Extension from '../classes/Extension';

  
  export default {
    props: {
      project: Object
    },
    computed: {
      units(){
        let clazzes=this.project.clazzes;
        let units=[];
        for(let i=0;i<clazzes.length;i++){
          let c=clazzes[i];
          if(c instanceof UIClazz || c instanceof SourceFile || c.isMainClazz() || !c.hasClazzDeclaration) continue;
          units.push(c);
        }
        return units;
      }
    },
    data(){
      return {
        show: false,
        selectedUnits: []
      };
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      downloadJEP(){
        let p=new Extension("Paket",this.selectedUnits);
        download(JSON.stringify(p.toJSON()),p.name+".jep");
      },
      async uploadJEP(){
        let file=await upload({accept: ".jep"});
        let data=JSON.parse(file.code);
        let p=new Extension(file.fileName);
        p.fromJSON(data);
        this.$root.addExtension(p);
      }
    },
    components: {
      Listbox
    }
  }
  </script>