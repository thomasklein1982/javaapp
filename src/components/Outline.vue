<template>
  <div id="root">
    <UmlClazz v-for="(c,i) in clazzes" :key="'clazz'+i" :clazz="c"></UmlClazz>
  </div>
</template>

<script>
import { UIClazz } from "../classes/UIClazz";
import UmlClazz from "./UmlClazz.vue";

export default {
  props: {
    project: Object
  },
  computed: {
    clazzes(){
      return this.project.clazzes.filter(c=>!(c instanceof UIClazz));
    }
  },
  data(){
    return {
      show: true,
      
    };
  },
  methods: {
    
  },
  components: {
    UmlClazz
  }
}
</script>

<style scoped>
  #root{
    display: flex;
    flex-direction: column;
    overflow: auto;
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
</style>>