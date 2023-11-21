<template>
  <div id="root">
    <ConfirmPopup/>
    <Toast/>
    <transition name="fade">
      <Button @click="show=true" v-show="!show" style="z-index: 2; position: absolute; left: 0; top: 50%" icon="pi pi-chevron-right" id=""></Button>
    </transition>
    <transition name="fade">
      <Panel class="panel-full" id="panel" v-show="show">
        <template #header>
          Projekt-Explorer
        </template>
        <template #icons>
          <Button class="p-button-rounded p-button-text" icon="pi pi-times" @click="show=false"/>
        </template>
        <Tree 
          :value="treeNodes"
          selectionMode="single"
          :selectionKeys="selectedKey"
          @node-select="nodeSelected"
          class="project-explorer"
        >
          <template #cmds>
            <Button @click="$refs.dialogNewClazz.open()" icon="pi pi-plus" class="p-button-rounded"></Button>
          </template>
          <template #clazz="data">
            <div :style="{display: 'flex', minHeight: '2.4rem', alignItems: 'center'}">
              <div :style="{flex: 1}">
                {{data.node.label.length>16? data.node.label.substring(0,13)+"...":data.node.label}} 
                <template v-if="data.node.data.errors">
                  <Badge v-if="data.node.data.errors.length>0" severity="danger" :value="data.node.data.errors.length"/>
                </template>
              </div>
              <Button v-if="data.node.data===currentClazz && currentClazz!==project.clazzes[0]" @click="clickRemoveClazz($event,data.node.data)" icon="pi pi-trash"/>
            </div>
          </template>
        </Tree>

      </Panel>
    </transition>
    <NewClazz ref="dialogNewClazz" :clazzes="project.clazzes" @ok="addClazz"></NewClazz>
  </div>
</template>

<script>
import { nextTick } from '@vue/runtime-core';
import NewClazz from './dialogs/NewClazz.vue';

export default {
  props: {
    project: Object,
    currentClazz: Object
  },
  watch: {
    currentClazz(nv,ov){
      let index=this.project.clazzes.indexOf(nv);
      let r={};
      r['clazzes-'+index]=true;
      this.selectedKey=r;
    }
  },
  computed: {
    /**selectedKey(){
      let index=this.project.clazzes.indexOf(this.currentClazz);
      let r={};
      r['clazzes-'+index]=true;
      return r;        
    },*/
    treeNodes(){
      return [
        {
          key: 'clazzes',
          selectable: false,
          label: 'Klassen',
          type: 'clazzes-root',
          children: ((project)=>{
            var list=[];
            list.push({
              key: 'cmds',
              type: 'cmds',
              selectable: false
            });
            for(var i=0;i<project.clazzes.length;i++){
              let c=project.clazzes[i];
              list.push({
                key: 'clazzes-'+i,
                label: c.name,
                data: c,
                type: "clazz"
              });
            }
            return list;
          })(this.project)
        },
        {
          key: 'ressources',
          label: 'Ressourcen',
          selectable: false,
          children: [
              
          ]
        }
      ];
    }
  },
  data(){
    return {
      show: true,
      selectedKey: {'clazzes-0': true}
    };
  },
  methods: {
    nodeSelected(node){
      console.log("tree node selected");
      if(node.type==='clazz'){
        this.$emit("clazz-selected",node.data);
      }
      
    },
    addClazz(name){
      this.$emit('add-clazz',name);
    },
    clickRemoveClazz(event,clazz){
      this.$confirm.require({
          target: event.currentTarget,
          message: 'Wollen Sie die Klasse '+clazz.name+' wirklich löschen?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$emit('delete-clazz',clazz);
            this.$toast.add({severity:'info', summary:'Klasse gelöscht', detail:'Die Klasse "'+clazz.name+'" wurde gelöscht.', life: 3000});
          },
          reject: () => {

          }
      });
    }
  },
  components: {
    NewClazz
  }
}
</script>

<style scoped>
  #root{
    display: flex;
    flex-direction: column;
  }
  #panel{
    flex: 1;
  }
  .p-tree{
    border: none;
  }
  .p-tree{
    padding: 0;
  }

  
</style>

<style>
  .project-explorer .p-treenode-leaf .p-treenode-content>button{
    display: none;
  }
  .project-explorer .p-treenode-leaf .p-treenode-content>.p-treenode-label{
    flex: 1;
  }
</style>