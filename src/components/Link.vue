<template>
  <a style="cursor: pointer" @click="click()"><slot></slot></a>
</template>

<script>
export default {
  props: {
    href: String
  },
  computed: {
    siteName(){
      let s=this.href.split("/");
      return s[0]+"_"+s[1];
    }
  },
  data(){
    return {

    };
  },
  methods: {
    click(){
      console.log(this.siteName);
      app.$refs.editor.$refs.dialogHelp.changeSite(this.siteName);
    }
  }
}
</script>

<style scoped>

</style>