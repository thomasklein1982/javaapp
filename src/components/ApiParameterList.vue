<template>
  <template v-for="(p,i) in realParameters">
    {{ i>0? ', ':'' }}
    <ApiTypeLink
      :type="p.type"
    /> {{ p.name }}
  </template>
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