<template>
  <span style="font-weight: bold">
    <template v-if="type">
      <Link v-if="link" :href="link">{{ baseTypeName }}</Link><span v-else >{{ baseTypeName }}</span>{{ arrayBrackets }}
    </template>
    <span v-else>void</span>
  </span>
</template>

<script>
import { PrimitiveType } from "../classes/PrimitiveType.js";
import {Java} from "../language/java.js";
import Link from "./Link.vue";

export default{
  components: {
    Link
  },
  props: {
    type: Object,
  },
  computed: {
    baseType(){
      if(!this.type) return null;
      let bt=this.type.baseType;
      if(!bt){
        bt=this.type;
      }
      return bt;
    },
    baseTypeName(){
      if(!this.type) return null;
      let bt=this.baseType;
      if(!bt){
        return null;
      }
      return bt.name;
    },
    arrayBrackets(){
      if(!this.type) return;
      let d=this.type.dimension;
      let t="";
      for(let i=0;i<d;i++){
        t+="[]";
      }
      return t;
    },
    link(){
      if(!this.type) return null;
      let name=this.baseTypeName;
      let bt=this.baseType;
      if(!bt){
        console.log("error");
        return null;
      }
      if(!Java.datatypes[name]) return null;
      //name=name.toLowerCase();
      if(bt instanceof PrimitiveType){
        return "datatypes/"+name;
      }else{
        return "api/"+name;
      }
    }
  },
  data(){
    return {
      
    }
  }
}

</script>