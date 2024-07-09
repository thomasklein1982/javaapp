<template>
  <template v-for="(p,i) in realParameters">
    <span :style="{'font-style': optional>=0 && i>=optional? 'italic': ''}">
      <span v-if="optional===i" style="font-style: italic"> [</span>{{ i>0? ', ':'' }}
      <ApiTypeLink
        :type="p.type"
      /> {{ p.name }}
    </span>
  </template>
  <span v-if="optional>=0">]</span>
</template>

<script>
import ApiTypeLink from "./ApiTypeLink.vue";

export default{
  components: {
    ApiTypeLink
  },
  props: {
    parameters: Object
  },
  computed: {
    optional(){
      for(let i=0;i<this.realParameters.length;i++){
        let p=this.realParameters[i];
        if(p.optional){
          return i;
        }
      }
    },
    realParameters(){
      console.log(this.parameters);
      return this.parameters.parameters;
    }
  },
  data(){
    return {
      
    }
  }
}

</script>