<template>
  <div class="umlclazz">
    <div v-if="clazz.isInterface" style="text-align: center">&laquo;interface&raquo;</div>
    <div @click="click()" class="clazzname">
      <span :style="clazz.isInterface?'font-style: italic':''">{{clazz.name}}</span><template v-if="clazz.typeParameters">&lt;<span v-for="(t,i) in clazz.typeParameters">{{(i>0? ',':'')+ t.name }}</span>&gt;</template>
    </div>
    <div class="attributes">
      <UmlMember :member="a" v-for="(a,i) in attributes" :key="'attr'+i"></UmlMember>
    </div>
    <div class="methods">
      <template v-for="(m,i) in methods" :key="'ms'+i">
        <UmlMember :member="m"></UmlMember>
      </template>
    </div>
  </div>
</template>

<script>
import UmlMember from "./UmlMember.vue";
import { nextTick } from "vue";

export default {
  props: {
    clazz: Object
  },
  computed: {
    attributes(){
      let attributes=[];
      for(let a in this.clazz.attributes){
        let at=this.clazz.attributes[a];
        if(!at) continue;
        attributes.push(at);
      }
      attributes=attributes.sort(function(a,b){
        if(a.name.toLowerCase()<=b.name.toLowerCase()){
          return -1;
        }else{
          return 1;
        }
      });
      return attributes;
    },
    methods(){
      let methods=[];
      console.log("get methods");
      for(let a in this.clazz.methods){
        let m=this.clazz.methods[a];
        if(!m) continue;
        methods.push(m);
      }
      methods=methods.sort(function(a,b){
        if(a.isConstructor()){
          return -1;
        }else if(b.isConstructor()){
          return 1;
        }else{
          if(!a.name || !b.name){
            return 1;
          } 
          if(a.name.toLowerCase()<=b.name.toLowerCase()){
            return -1;
          }else{
            return 1;
          }
        }
      });
      return methods;
    }
  },
  methods: {
    click(){
      let editor=this.$root.$refs.editor;
      let index=editor.getEditorIndexByClazzName(this.clazz.name);
      //let index=editor.project.getClazzIndexByName(this.clazz.name);
      if(index<0) return;
      editor.activeTab=index;
      console.log(editor);
      let cm=editor.$refs.editor[index];
      if(!cm) return;
      cm.setSelection(this.clazz.node.from,this.clazz.node.to);
      nextTick(()=>{
          cm.focus()
        }
      );
    }
  },
  components: {
    UmlMember
  }
}
</script>

<style scoped>
  .umlclazz{
    border: 1pt solid white;
    border-radius: 0.1rem;
    margin-top: 0.3rem;
  }
  .clazzname{
    border-bottom: 1pt solid white;
    text-align: center;
    font-weight: bold;
    cursor: pointer;
  }
  .attributes{
    border-bottom: 1pt solid white;
  }
  .attributes,.methods{
    min-height: 1rem;
  }
</style>