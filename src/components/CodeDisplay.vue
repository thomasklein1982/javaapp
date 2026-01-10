<template>
  <!-- <div style="width:100%;font-family: monospace;white-space: pre-wrap;">
    <div :style="{display: 'flex'}" v-for="(l,i) in lines">
      <div style="text-align: right; margin-right: 2rem">{{i+1}}</div>
      <div :style="{flex: 1}" style="">{{l}}</div>
    </div>
  </div> -->
  <span ref="root">
    <pre :class="classes" ><code :class="language">{{ code }}</code></pre>
  </span>
  
</template>

<script>
import Prism from "prismjs";

export default {
  components: {
    
  },
  props: {
    code: String,
    fileType: {
      type: String,
      default: "java"
    },
    noNumbers: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    lang(){
      if(this.fileType==="js"){
        return "javascript";
      }else {
        return this.fileType;
      }
    },
    language(){
      return "language-"+this.lang;
    },
    classes(){
      return this.language+(!this.noNumbers? " line-numbers":"");
    },
    trimmedCode(){
      return this.code.trim();
    },
    lines(){
      let s=this.trimmedCode.split("\n");
      return s;
    }
  },
  mounted(){
    Prism.highlightAllUnder(this.$refs.root);
  },
  data(){
    return {

    };
  }
};
</script>
<style scoped>
  pre{
    white-space: pre-wrap;
  }
</style>