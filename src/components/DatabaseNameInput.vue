<template>
  <div class="field">
    <label for="relationname">{{label}}</label>
    <InputText @input="updateValue" autofocus id="relationname" v-model="modelValue.name" type="text" />
    <small>{{help}}</small>
    <small v-if="error" style="color: red">{{error}}</small>
    <small v-if="additionalError" style="color: red">{{additionalError}}</small>
  </div>
</template>

<script>
import { SQL_KEYWORDS } from '../classes/Database';
export default {
  props: {
    modelValue: Object,
    label: {
      type: String,
      default: "Name"
    },
    help: String,
    additionalError: {
      type: String,
      default: null
    }
  },
  data(){
    return {
      value: {
        name: this.modelValue.name,
        ok: this.modelValue.ok
      }
    };
  },
  computed: {
    error(){
      this.value.ok=false;
      var name=this.modelValue.name.toLowerCase();
      if(/^\w+$/.test(name)){
        if(SQL_KEYWORDS.indexOf(name)<0){
          if(!this.additionalError){
            this.value.ok=true;
          }
          return null;
        }else{
          return "SQL-Schlüsselwörter wie '"+name.toUpperCase()+"' sind nicht erlaubt.";
        }
      }else{
        return "Der Name darf nur aus Buchstaben, Ziffern und dem Unterstrich bestehen.";
      }
    }
  },
  methods: {
    updateValue(event){
      this.value.name=event.target.value;
      this.$emit('update:modelValue', this.value);
    }
  }
};
</script>

<style scoped>
  .field *{
    display: block;
  }
</style>