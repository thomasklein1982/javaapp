<template>
  <h1>{{ title }}</h1>
  <h2 v-if="object.superClazz">extends <ApiTypeLink :type="object.superClazz"/></h2>
  <p>{{ object.description }}</p>
  <template v-if="object.attributeCount>0">
    <h2>Attribute</h2>
    <template v-for="(a,i) in object.attributes">
      <ApiAttributeDescription
        :attribute="a"
      />
    </template>
  </template>
  <template v-if="constructor">
    <h2>Konstruktor</h2>
    <ApiMethodDescription 
      :method="constructor"
    />
  </template>
  <template v-if="object.methodCount>0">
    <h2>Methoden</h2>
    <template 
      v-for="(m,i) in object.methods"
    >
      <ApiMethodDescription 
        v-if="m!==constructor"
        :method="m"
      />
    </template>
  </template>
</template>

<script>
import {Java} from "./../language/java.js";
import ApiAttributeDescription from "./ApiAttributeDescription.vue";
import ApiMethodDescription from "./ApiMethodDescription.vue";
import ApiTypeLink from "./ApiTypeLink.vue";

export default{
  components: {
    ApiMethodDescription, ApiTypeLink, ApiAttributeDescription
  },
  props: {
    doku: String,
  },
  computed: {
    title(){
      
      return this.object.name;
    },
    constructor(){
      return (this.object.getConstructor());
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