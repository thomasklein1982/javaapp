<template>
  <div style="margin-bottom: 1rem;">
    
      <div style="background-color: gray; font-family: monospace"><span v-if="isStatic" style="font-weight: bold">static</span> <ApiTypeLink :type="attribute.type"/> {{ attribute.name }}</div>
      <div v-html="attribute.comment"/>
  </div>
</template>

<script>
import {Java} from "../language/java.js";
import ApiTypeLink from "./ApiTypeLink.vue";
import ApiParameterList from "./ApiParameterList.vue";
import Link from "./Link.vue";


export default{
  components: {
    Link, ApiTypeLink, ApiParameterList
  },
  props: {
    attribute: Object,
  },
  computed: {
    isStatic(){
      return this.attribute.isStatic();
    }
  },
  data(){
    return {
      
    }
  }
}

</script>