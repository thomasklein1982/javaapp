<template>
  <Dialog :header="'Datenbank'+(database.changed? '*':'')" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <DatabaseNewRelationDialog 
      ref="dialogNewRelation"
      @confirm="addRelation"
    />
    <Splitter :style="{flex: 1}" style="overflow: hidden;width: 100%;height: 100%;">
      <SplitterPanel style="overflow: hidden;" :style="{display: 'flex', flexDirection: 'column'}">
        <div style="overflow:auto;" :style="{flex: 1}">
          <template v-if="mode=='ui'">
            <DatabaseRelation 
              :key="i" 
              v-for="(r,i) in relations"
              :relation="r"
              @trash="database.tables.splice(i,1)"
            />
          </template>
          <template v-else>
            <CodeMirrorEditor language="sql" v-model="database.sqlInitCode"/>
          </template>
        </div>
        <div style="text-align: right">
          <Button @click="mode=mode==='ui'? 'code':'ui'" icon="pi pi-arrow-right-arrow-left"/>
          <Button @click="$refs.dialogNewRelation.setVisible(true)" icon="pi pi-plus" label="Neue Relation"/>
        </div>
      </SplitterPanel>
      <SplitterPanel style="overflow: auto;" :style="{display: 'flex', flexDirection: 'column'}">
        <div style="overflow:auto;" :style="{flex: 1}">
          <div v-if="sqlExecution.result||sqlExecution.error">
            Die Anfrage
            <div style="font-family: monospace">
              {{sqlExecution.command}}
            </div>
            ergab:
            <div v-if="sqlExecution.error">
              <div style="color: red; font-weight: bold">Fehler!</div>
              <pre style="margin-top: 0.4rem; margin-bottom: 0.4rem">{{sqlExecution.error}}</pre>
            </div>
            <div v-else>
              <div v-if="sqlExecution.result.length>0">
                <table class="database-table">
                  <tr>
                    <th v-for="(a,j) in sqlExecution.result[0]">{{stripQuotationMarks(j.toUpperCase())}}</th>
                  </tr>
                  <tr v-for="(ds,i) in sqlExecution.result">
                    <td v-for="(a,j) in ds">{{a===undefined? 'NULL' : a}}</td>
                  </tr>
                </table>
              </div>
              <div v-else>
                Die Suchanfrage ergab keine Treffer.
              </div>
            </div>
          </div>
        </div>
        <div style="height: 20ex">
          <CodeMirrorEditor style="height: 100%" language="sql" v-model="sqlcommand"/>
        </div>   
        <div style="text-align: right">
          <Button @click="recreateDatabase()" icon="pi pi-refresh"/> <Button @click="executeSQL()" icon="pi pi-play" label="SQL-Befehl ausführen"/>
        </div>
      </SplitterPanel>
    </Splitter>
    
    
  </Dialog>
  </template>
  
  <script>
  import DatabaseRelation from "./DatabaseRelation.vue";
  import Textarea from 'primevue/textarea';
  import DatabaseNewRelationDialog from "./DatabaseNewRelationDialog.vue";
  import CodeMirrorEditor from "./CodeMirrorEditor.vue";
import { options } from "../classes/Options";
  
  
  export default {
    props: {
      database: Object
    },
    data(){
      return {
        show: false,
        sqlcommand: "",
        mode: options.databaseUiMode? "ui":"code",
        sqlExecution: {
          command: null,
          result: null,
          error: false
        }
      };
    },
    computed: {
      relations(){
        if(this.database){
          return this.database.tables;
        }else{
          return [];
        }
      }
    },
    methods: {
      stripQuotationMarks(t){
        if(t && t.charAt && t.charAt(0)==="'" && t.charAt(t.length-1)==="'"){
          return t.substring(1,t.length-1);
        }else{
          return t;
        }
      },
      setVisible(v){
        this.show=v;
      },
      addRelation(name){
        this.database.addTable(name);
      },
      recreateDatabase(){
        this.sqlExecution.error=false;
        try{
          this.database.createInMemory();
          return true;
        }catch(e){
          console.error(e);
          this.sqlExecution.error=e.message;
          return false;  
        }
      },
      executeSQL(){
        this.sqlExecution.error=null;
        this.sqlExecution.result=null;
        if(this.database.changed){
          let r=this.recreateDatabase();
          if(!r) return;
        }
        if(this.sqlcommand.trim().length===0){
          this.sqlExecution.error="keine Suchanfrage gestellt";
          return;
        }
        this.sqlExecution.command=this.sqlcommand;
        try{
          this.sqlExecution.result=this.database.query(this.sqlcommand);
          this.sqlExecution.error=false;
        }catch(e){
          console.error(e);
          this.sqlExecution.error=e.message;
        }
      }
    },
    components: {
      DatabaseRelation,
      Textarea,
      DatabaseNewRelationDialog,
      CodeMirrorEditor
    }
  }
  </script>