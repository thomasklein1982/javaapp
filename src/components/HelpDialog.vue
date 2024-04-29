<template>
  <Dialog header="Hilfe" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    Hier findest du noch nicht allzu viel. Du kannst aber das <a class="ja-link" href="https://thomaskl.uber.space/Sonstiges/java-app/java-app-cheat-sheet.pdf" target="_blank">Java-App-Cheat-Sheet</a> herunterladen.
  </Dialog>
</template>

<script>
export default {
  data(){
    return {
      show: false,
      
    };
  },
  mounted(){
    
  },
  computed: {
    
  },
  methods: {
    
    setVisible(v){
      this.show=v;
    }
  }
}
</script>