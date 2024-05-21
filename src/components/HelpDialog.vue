<template>
  <Dialog header="Hilfe" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <h1>Cheat-Sheet</h1>
    Hier kannst du das <a class="ja-link" href="https://thomaskl.uber.space/Sonstiges/java-app/java-app-cheat-sheet.pdf" target="_blank">Java-App-Cheat-Sheet</a> herunterladen.
    <h1>Beispiele-Playlist</h1>
    In <a href="https://www.youtube.com/playlist?list=PLrhVWl3_6h-nClf8Fz3cMF8GMfSS--WtN" class="ja-link" target="_blank">dieser YouTube-Playlist</a> findet du Videos, in denen ich bestimmte Features von Javaapp vorstelle.
    <h1>Dokumentation</h1>
    
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