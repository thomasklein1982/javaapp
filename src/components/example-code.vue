<template>
  <div style="padding: 0.5rem; border: 1pt solid white">
    <div style="display: flex"><SelectButton :options="difficulties" option-label="label" option-value="value" v-model="difficulty"/> <div style="flex: 1"></div><a v-if="url" target="_blank" :href="realUrl"><Button icon="pi pi-external-link" @click="tryIt()" label="Try it!"/></a></div>
    <div>
      <slot></slot>
      <slot v-if="difficulty===0" name="easy"></slot>
      <slot v-if="difficulty===1" name="normal"></slot>
      <slot v-if="difficulty===2" name="hard"></slot>
    </div>
  </div>
</template>

<script>
import SelectButton from "primevue/selectbutton";

export default{
  components: {
    SelectButton
  },
  props: {
    url: {
      type: [Array,String]
    }
  },
  computed: {
    difficultyLabel(){
      return ["Easy","Normal","Hard"][this.difficulty];
    },
    realUrl(){
      //https://thomaskl.uber.space/Sonstiges/java-app/examples/konsole/ausgabe_hard.html
      let base="https://thomaskl.uber.space/Apps/java-app/";
      let url;
      if(Array.isArray(this.url)){
        url=this.url[this.difficulty];
      }else{
        url=this.url;
      }
      let mode=this.difficultyLabel.toLowerCase();
      url=base+"#tryit:"+url+".html;"+mode;
      console.log(url);
      return url;
    },
    // localUrl(){
    //   let url;
    //   if(this.url.splice){
    //     url=this.url[this.difficulty];
    //   }else{
    //     url=this.url;
    //   }
    //   url="misc/examples/"+url;
    //   console.log(url);
    //   return url;
    // }
  },
  data(){
    return {
      difficulties: [
        {
          label: "Easy",
          value: 0    
        },
        {
          label: "Normal",
          value: 1    
        },
        {
          label: "Hard",
          value: 2    
        },
      ],
      difficulty: this.$root.difficulty
    };
  },
  methods: {
  }
};
</script>