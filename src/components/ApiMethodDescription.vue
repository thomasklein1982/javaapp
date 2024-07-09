<template>
  <div style="margin-bottom: 1rem;">
    
      <div style="background-color: gray; font-family: monospace"><span v-if="isStatic" style="font-weight: bold">static</span> <ApiTypeLink v-if="!isConstructor" :type="method.type"/> {{ method.name }} ( <ApiParameterList :parameters="method.params"/> )</div>
      <details>
        <summary>
          <span v-html="method.comment"/>
        </summary>
        <div>
          <div v-for="(p,i) in method.params.parameters">
            <span style="font-family: monospace">
              <ApiTypeLink
                :type="p.type"
              /> {{ p.name }}<span style="font-family: sans-serif; " v-if="p.optional"> (optional)</span>:</span> <span v-html="p.info"/>
          </div>
          <div v-if="method.type">
            <span style="font-weight: bold">returns</span> <ApiTypeLink :type="method.type"/>: <span v-html="method.returnInfo"/>
          </div>
        </div>
      </details>
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
    isStatic(){
      return this.method.isStatic();
    },
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