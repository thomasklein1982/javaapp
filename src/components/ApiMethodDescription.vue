<template>
  <div style="margin-bottom: 1rem;">
    <div style="font-family: monospace;background-color: gray;"><ApiTypeLink v-if="!isConstructor" :type="method.type"/> {{ method.name }} ( <ApiParameterList :parameters="method.params"/> )</div>
    <div v-if="isConstructor">Konstruktor</div>
    <div>
      {{ method.comment }}
    </div>
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
    method: Object,
  },
  computed: {
    isConstructor(){
      return this.method.isConstructor()
    }
  },
  data(){
    return {
      
    }
  }
}

</script>