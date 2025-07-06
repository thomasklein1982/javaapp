<template>
  <Dialog header="Packet Manager" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <p>Ein <em>JavaApp-Paket</em> (kurz: JAP) ist eine Menge von Klassen und/oder Interfaces, das in bestehende Projekte importiert werden kann (über diesen Paket-Manager). Die enthaltenenen Interfaces und Klassen werden vor dem*der Programmierer*in versteckt. Durch Pakete kann man also die Funktionalitäten von JavaApp erweitern.</p>
    <h1>Verwendete JAPs</h1>
    <div v-for="(p,i) in project.packages" class="package-line">
      <div>{{ p.name }}</div>
      <div>
        <Button icon="pi pi-trash" @click="project.removePackageAtIndex(i)"/>
      </div>
    </div>
    <Button icon="pi pi-upload" @click="uploadPackage()"/>
    <h1>JAP erzeugen</h1>
    <!-- <h2>Name des Pakets</h2>
    <InputText fluid v-model="packageName"/> -->
    <!-- <h2>Klassen und Interfaces</h2> -->
    <Listbox fluid v-model="selectedUnits" multiple :options="units" option-label="name"/>
    <p v-if="selectedUnits.length===0">Nichts ausgewählt.</p>
    <p v-else>Ausgewählt: {{ selectedUnits.map((c)=>c.name).join(", ") }}</p>
    <Button :disabled="selectedUnits.length===0" label="Paket herunterladen" icon="pi pi-download" @click="downloadPackage()"/>

  </Dialog>
</template>
  
<script>
import { Listbox } from 'primevue';
import { Clazz } from '../classes/Clazz';
import { UIClazz } from '../classes/UIClazz';
import { SourceFile } from '../classes/SourceFile';
import { download, upload } from '../functions/helper';
import { Package } from '../classes/Package';

  
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
      downloadPackage(){
        let p=new Package("Paket",this.selectedUnits);
        download(JSON.stringify(p.toJSON()),p.name+".jap");
      },
      async uploadPackage(){
        let file=await upload({accept: ".jap"});
        let data=JSON.parse(file.code);
        let p=new Package(file.fileName);
        p.fromJSON(data);
        this.project.addPackage(p);
      }
    },
    components: {
      Listbox
    }
  }
  </script>