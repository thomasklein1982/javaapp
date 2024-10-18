<template>
  <a style="cursor: pointer" @click="click()"><slot></slot></a>
</template>

<script>
import { Java } from '../language/java';

export default {
  props: {
    href: String
  },
  computed: {
    siteName(){
      let s=this.href.split("/");
      if(s[0]==="api"){
        let clazz=Java.datatypes[s[1]];
        return clazz;
      }
      return s[0]+"_"+s[1];
    }
  },
  data(){
    return {

    };
  },
  methods: {
    click(){
      this.$root.$refs.dialogHelp.changeSite(this.siteName);
    }
  }
}
</script>

<style scoped>

</style>