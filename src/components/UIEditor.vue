<template>
  <div class="ui-editor-component-list" :style="{flex: 1, display: 'flex', 'flex-direction': 'row', overflow: 'hidden'}">
    <UIEditorCode ref="uiEditorCode" :ui-clazz="clazz"/>
    <Sortable
      :list="allComponents"
      item-key="id"
      :options="{
        group: {
          name: 'components',
          pull: 'clone',
          put: false
        },
        handle: '.handle',
        'ghost-class': 'drag-ghost',
        sort: false
      }"
      @drop="handleDrop"
      @add="handleAdd"
      @clone="cloneItem"
      :style="{display: 'flex', 'flex-direction': 'column', 'align-items': 'stretch'}"
      style="overflow: auto"
    >
      <template #item="{element}">
        <UIComponent :component="element"/>
      </template>
    </Sortable>
    <div class="ui-clazz" :style="{flex: 1}" style="overflow: auto">
      <UIComponent :auto-update="settings.autoUpdateUI" :component="clazz" is-editable @clickcomponent="clickComponent" :selected-component="selectedComponent" @recompile="emitRecompile" @isolatedupdate="emitIsolatedUpdate" @deselect-component="deselectComponent()" @duplicate-self="duplicateUIClazz()" @remove-self="removeUIClazz()"/>
      <div style="text-align: right">
        <Button @click="showCodeDialog()" icon="pi pi-file-edit"/>
      </div>
    </div>
  </div>
</template>

<script>
  import UIComponent from "./UIComponent.vue";
  //import draggable from "vuedraggable/dist/vuedraggable.common";
  //import draggable from "vuedraggable";
  import {Sortable} from "sortablejs-vue3";
  import UIEditorCode from "./UIEditorCode.vue";
  import { UIClazz } from "../classes/UIClazz";

  export default{
    props: {
      clazz: {
        type: Object
      },
      settings: Object
    },
    computed: {
      allComponents(){
        let components=[];
        components=components.concat(this.componentList);
        let project=this.clazz.project;
        for(let i=0;i<project.clazzes.length;i++){
          let c=project.clazzes[i];
          if(c.isUIClazz()){
            components.push(c.getComponentObject());
          }
        }
        return components;
      }
    },
    data: function(){
      return {
        componentList: [
          {type: "JPanel", components: [], template: "1", onAction: false, actionCommand: ""}, 
          {type: "JLabel", value: "JLabel", valueType: "html", onAction: false, actionCommand: "", align: "center"},
          {type: "JButton", value: "JButton", valueType: "html", onAction: true, actionCommand: "", disabled: false},
          {type: "JTextField", inputType: "text", value: "", placeholder: "JTextField", valueType: "inline-text", onAction: false, actionCommand: "", disabled: false},
          {type: "JTextArea", value: "", placeholder: "JTextArea", valueType: "text", disabled: false}, 
          {type: "JCheckBox", value: true, label: "JCheckBox", valueType: "Boolean", onAction: true, actionCommand: "", disabled: false}, 
          {type: "JComboBox", value: "Ja", options: '["Ja","Nein","Vielleicht"]',valueType: "text", onAction: false, actionCommand: "", disabled: false}, 
          {type: "DataTable"}, 
          {type: "JImage", value: "https://thomaskl.uber.space/Webapps/Assets/graphics/overworld/house-front.png", valueType: "text", onAction: false, actionCommand: "", imageZoom: 1, imageTranslationX: "0%", imageTranslationY: "0%"}, 
          {type: "Canvas", components: [], minX: 0, maxX: 100, minY: 0, maxY: 100, onAction: false, actionCommand: "", onMouseUp: true, onMouseDown: true, onMouseMove: true, sizePolicy: "fit"}, 
          {type: "For", controlComponent: {min: 1, max: 10, variable: "i"}}, 
          {type: "If", controlComponent: {condition: "true"}}, 
          //{type: "ElseIf", controlComponent: {condition: "true"}}, 
          //{type: "Else", controlComponent: {}}
        ],
        selectedComponent: null
      };
    },
    methods: {
      showCodeDialog(){
        this.$refs.uiEditorCode.open(this.clazz);
      },
      emitRecompile(force){
        if(this.settings.autoUpdateUI || force)
          this.$emit('recompile');
      },
      emitIsolatedUpdate(force){
        if(this.settings.autoUpdateUI || force)
          this.$emit('isolatedupdate');
      },
      handleDrop(ev){
        console.log("dropped",ev);
      },
      handleAdd(ev){
        console.log("add",ev);
      },
      duplicateUIClazz(){
        let data=JSON.parse(JSON.stringify(this.clazz.getSaveObject()));
        let clazz=new UIClazz(this.clazz.name,this.clazz.project);
        clazz.restoreFromSaveObject(data);
        let suffix=1;
        let name=this.clazz.name;
        while(this.clazz.project.getClazzByName(name+"_"+suffix)){
          suffix++;
        }
        clazz.name=name+"_"+suffix;
        this.clazz.project.clazzes.push(clazz);
        //this.emitRecompile();
      },
      removeUIClazz(){
        this.clazz.project.removeClazz(this.clazz);
      },
      cloneItem(event){
        let item=this.allComponents[event.oldIndex];
        let copy=JSON.parse(JSON.stringify(item));
        if(copy.controlComponent){
          copy.components=[];
        }else{
          copy.x=50;
          copy.y=50;
          copy.width=100;
          copy.height=100;
          copy.cssClass=copy.type.toLowerCase();
          copy.cssCode="";
          copy.invisible=false;
        }
        event.clone.componentData=copy;
        return copy;
      },
      clickComponent(c){
        if(this.selectedComponent===c){
          this.selectedComponent=null;
        }else{
          this.selectedComponent=c;
        }
        this.$emit("select",this.selectedComponent);
      },
      reset(){
        this.selectedComponent=null;
      },
      deselectComponent(noEvent){
        this.selectedComponent=null;
        if(noEvent) return;
        this.$emit("select",this.selectedComponent);
      }
    },
    components: {
      UIComponent, Sortable, UIEditorCode
    },
    emits: ['select','recompile','isolatedupdate']
  }
</script>

<style>
  .drag-ghost{
    opacity: 0;
  }
</style>