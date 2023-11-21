<template>
  <Dialog header="Relation importieren" v-model:visible="dialogs.importRelation.show" :modal="true">
    <p>In die folgende TextArea kannst du Daten einfügen, die du z. B. aus Excel kopiert hast.</p>
    <div class="field">
      <TextArea rows="5" cols="30" autofocus v-model="dialogs.importRelation.text" />
    </div>
    <div v-if="importedRelation" class="field">
      <p>Erkannt: Relation ({{importedRelation.getAttributeNames()}}) mit {{importedRelation.records.length}} Datensätzen</p>
      ACHTUNG: Durch Klick auf 'OK' wird die alte Relation gelöscht und durch die neuen Daten ersetzt.
    </div>
    <template #footer>
      <Button :disabled="!importedRelation" @click="confirmImportRelation()" label="OK"/>
      <Button @click="dialogs.importRelation.show=false" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
  <Dialog header="Neues Attribut" :style="{width: '50vw'}" v-model:visible="dialogs.newAttribute.show" :modal="true">
    <DatabaseNameInput help="Der Name des neuen Attributs." v-model="dialogs.newAttribute.name" label="Name"/>
    <div class="field">
      <label for="datatype">Datentyp</label>
      <Dropdown id="datatype" optionLabel="name" v-model="dialogs.newAttribute.type" :options="datatypes" />
      <div>{{ dialogs.newAttribute.type.comment }}</div>
    </div>
    <template #footer>
      <Button :disabled="!dialogs.newAttribute.name.ok" @click="confirmNewAttribute(dialogs.newAttribute.name.name,dialogs.newAttribute.type)" label="OK"/>
      <Button @click="dialogs.newAttribute.show=false" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
  <Dialog header="Attribut bearbeiten" :style="{width: '50vw'}" v-model:visible="dialogs.editAttribute.show">
    <DatabaseNameInput help="Der Name des Attributs." v-model="dialogs.editAttribute.name" label="Name"/>
    <div class="field">
      <label for="datatype">Datentyp</label>
      <Dropdown id="datatype" optionLabel="name" v-model="dialogs.editAttribute.type" :options="datatypes" />
      <div>{{ dialogs.editAttribute.type.comment }}</div>
    </div>
    <template #footer>
      <Button :disabled="!dialogs.editAttribute.name.ok" @click="confirmEditAttribute(dialogs.editAttribute.name.name,dialogs.editAttribute.type)" label="OK"/>
      <Button @click="dialogs.editAttribute.show=false" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
  <Dialog @hide="applyChanges()" :header="'Relation '+relation.name+' bearbeiten'" v-model:visible="show">
    <DatabaseNameInput help="Der Name der Relation." v-model="name" label="Name" :additional-error="errorMessage"/>
    <table class="database-table">
      <ConfirmPopup/>
      <tr>
        <th v-for="(a,i) in relation.attributes">
          <SplitButton :label="a.name" :icon="a.type.icon" :model="getAttributeItems(a)"/>
        </th>
        <th><Button @click="dialogs.newAttribute.show=true" icon="pi pi-plus"/></th>
      </tr>
      <tr v-for="(r,j) in relation.records">
        <td v-for="(a,i) in relation.attributes">
          <span v-if="j===currentRecord">
            <InputText v-model="r[i]"/>
          </span>
          <span v-else>{{r[i]}}</span>
        </td>
        <td><Button v-if="showTrash" class="p-button-outlined" @click="trashRecord(j)" icon="pi pi-trash"/><Button v-else-if="j===currentRecord" class="p-button-outlined" @click="stopEditRecord()" icon="pi pi-times"/><Button v-else class="p-button-outlined" @click="editRecord(j)" icon="pi pi-pencil"/></td>
      </tr>
    </table>
    <Button @click="relation.appendNewRecord()" label="Neuer Datensatz"/>
    <ToggleButton v-model="showTrash" onLabel="Löschen freigegeben" offLabel="Löschen nicht freigegeben"/>
    <Button @click="dialogs.importRelation.show=true" label="Importieren"/>
  </Dialog>
</template>

<script>
  import {Database} from "../classes/Database";
  import {Table} from "../classes/Table";
  import SplitButton from 'primevue/splitbutton';
  import DatabaseNameInput from "./DatabaseNameInput.vue";

  export default {
    props: {
      relation: Object
    },
    computed: {
      importedRelation(){
        console.log("update");
        return this.parseRelationFromText(this.dialogs.importRelation.text);
      },
      errorMessage(){
        if(this.name.name!==this.relation.name){
          let t=this.relation.database.getTableByName(this.name.name);
          if(t){
            return "Es gibt bereits eine Relation mit diesem Namen.";
          }
        }
        return "";
      },
      datatypes(){
        return [
          Database.String, Database.Numeric, Database.Date, Database.Time
        ]
      }
    },
    data(){
      return {
        dialogs: {
          newAttribute: {
            show: false,
            name: {
              name: "",
              ok: true
            },
            type: Database.String,
            isPrimaryKey: false
          },
          editAttribute: {
            show: false,
            name: {
              name: "",
              ok: true
            },
            type: Database.String,
            isPrimaryKey: false
          },
          importRelation: {
            show: false,
            text: ''
          }
        },
        currentRecord: null,
        currentAttribute: null,
        showTrash: false,
        show: false,
        name: {
          name: this.relation.name,
          ok: true
        },
      }
    },
    methods: {
      parseRelationFromText(text){
        var relation=new Table(this.relation.database,this.name.name);
        var ok=relation.fromCSVString("import\n"+text,"\t");
        if(ok){
          return relation;
        }else{
          return null;
        }
      },
      editRecord(index){
        this.currentRecord=index;
      },
      trashRecord(index){
        this.relation.records.splice(index,1);
      },
      stopEditRecord(){
        this.currentRecord=null;
      },
      getAttributeItems(a){
        return [
          {
            label: 'Bearbeiten',
            icon: 'pi pi-pencil',
            command: (event) => {
              this.dialogs.editAttribute.name.name=a.name;
              this.dialogs.editAttribute.type=a.type;
              this.currentAttribute=a;
              this.dialogs.editAttribute.show=true;
            }
          },
          {
            label: 'Entfernen',
            icon: 'pi pi-trash',
            command: (event) => {
              var ans=confirm("Willst du das Attribut '"+a.name+"' wirklich löschen?\nAlle zugehörigen Daten werden gelöscht!");
              if(ans){
                this.relation.removeAttribute(a);
              }
            }
          }
        ]
      },
      setVisible(v){
        if(v===false){
          this.applyChanges();
        }
        this.show=v;
      },
      applyChanges(){
        if(!this.errorMessage){
          this.relation.name=this.name.name;
        }
      },
      confirmNewAttribute(name,datatype){
        this.relation.addAttribute(name,datatype);
        this.dialogs.newAttribute.show=false;
      },
      confirmEditAttribute(name,datatype){
        this.currentAttribute.name=name;
        this.currentAttribute.type=datatype;
        this.dialogs.editAttribute.show=false;
      },
      confirmImportRelation(){
        this.relation.fromTable(this.importedRelation);
        this.dialogs.importRelation.show=false;
      }
    },
    components: {
      SplitButton, DatabaseNameInput
    }
  }
</script>

<style scoped>
  .field *{
    margin-right: 0.5rem
  }
</style>