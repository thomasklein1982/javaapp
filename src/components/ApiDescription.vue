<template>
  <h1>{{ title }}</h1>
  <h2 v-if="object.superClazz">extends <ApiTypeLink :type="object.superClazz"/></h2>
  <p>{{ object.description }}</p>
  <template v-if="object.attributeCount>0">
    <h2>Attribute</h2>
    <p v-for="(a,i) in object.attributes">
      {{ a.name }}
    </p>
  </template>
  <h2>Methoden</h2>
  <ApiMethodDescription 
    v-for="(m,i) in object.methods"
    :method="m"
  />
</template>

<script>
import {Java} from "./../language/java.js";
import ApiMethodDescription from "./ApiMethodDescription.vue";
import ApiTypeLink from "./ApiTypeLink.vue";

export default{
  components: {
    ApiMethodDescription, ApiTypeLink
  },
  props: {
    doku: String,
  },
  computed: {
    title(){
      
      return this.object.name;
    },
    object(){
      return Java.datatypes[this.doku];
    }
  },
  data(){
    return {
      
    }
  }
}

</script>