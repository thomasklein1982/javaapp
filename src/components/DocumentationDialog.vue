<template>
  <Dialog header="JavaApp-Dokumentation" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <div :style="{display: 'flex'}" style="height: 100%">
      
        <div :style="{display: showSidebar? 'block':'none'}" style="height: 100%;  overflow-y: auto; overflow-x: hidden;" class="documentation-menu">
          <Menu ref="menu" :model="menuItems"/>
        </div>
      <div style="height: 100%; overflow:hidden; position: relative" :style="{flex: 1}">
        <div ref="content" style="padding: 0.5rem; height: 100%;  overflow: auto;">
          <template v-if="isCurrentComponentApi">
            <ApiDescription :doku="currentComponent"/>
          </template>
          <component v-else :is="currentComponent"/>
        </div>
        <div @click="showSidebar=!showSidebar" :class="showSidebar? 'pi pi-angle-double-left':'pi pi-angle-double-right'" :style="{opacity: 0.7}" style="text-align: center; cursor: pointer; display: grid; align-items: center; background-color: rgb(255, 213, 79); border-bottom-right-radius:100%; border-top-right-radius:100%; position: absolute; top: calc(50% - 1rem); left: 0;width: 1.5rem; height: 2rem;"></div>
      </div>
    </div>
  </Dialog>
</template>
  
<script>
  import sidebar from "primevue/sidebar";
  import Menu from "primevue/menu";
  import help from "./help/help-components";
import { Java } from "../language/java";
import { PrimitiveType } from "../classes/PrimitiveType";
import ApiDescription from "./ApiDescription.vue";

  let components={
    sidebar, Menu, ApiDescription
  };
  for(let cat in help){
    for(let a in help[cat].components){
      components[cat+"_"+a]=help[cat].components[a].comp;
    }
  }

  export default {
    props: {
      project: Object
    },
    components: components,
    computed: {
      menuItems(){
        let menuItems=[];
        for(let cat in help){
          let category={label: help[cat].label};
          let items=[];
          if(cat==="api"){
            for(let a in Java.datatypes){
              let clazz=Java.datatypes[a];
              if(clazz instanceof PrimitiveType) continue;
              let item={
                label: a,
                command: (e)=>{
                  this.changeSite(clazz);
                }
              };
              items.push(item);
            }
          }else{
            for(let a in help[cat].components){
              let c=help[cat].components[a];
              let name=cat+"_"+a;
              let item={
                label: c.label,
                command: (e)=>{
                  this.changeSite(name);
                }
              }
              items.push(item);
            }
          }
          category.items=items;
          menuItems.push(category);
        }
        return menuItems;
      },
      isCurrentComponentApi(){
        return this.currentComponent.substring===undefined;
      }
    },
    data(){
      return {
        show: false,
        currentComponent: "about_whatis",
        showSidebar: true,
      };
    },
    mounted(){
      window.addEventListener("popstate",(event) => {
        if(event.state.page){
          let page;
          if(event.state.isApi){
            page=Java.datatypes[event.state.page];
          }else{
            page=event.state.page;
          }
          this.changeSite(page,event.state.scrollTop,true);
        }
      });
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      changeSite(name,scrollTop,dontPush){
        let isApi=name.substring===undefined;
        
        if(!dontPush){
          history.pushState({
            page: isApi? name.name : name,
            isApi,
            scrollTop: this.$refs.content.scrollTop
          },"");
        }else{

        }
        this.currentComponent=name;
        if(!scrollTop) scrollTop=0;
        this.$refs.content.scrollTop=scrollTop;
      }
    }
  }
  </script>