<template>
  <div style="width:100%;font-family: monospace;white-space: pre-wrap;">
    <div :style="{display: 'flex'}" v-for="(l,i) in lines">
      <div style="text-align: right; margin-right: 2rem">{{i+1}}</div>
      <div :style="{flex: 1}" style="">{{l}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    code: String
  },
  computed: {
    lines(){
      let s=this.code.split("\n");
      return s;
    },
    lineNumbers(){
      
      for(let i=0;i<s.length;i++){
        s[i]=i+1;
      }
      return s.join("\n");
    },
  },
  data(){
    return {

    };
  }
};
</script>