<template>
  <Dialog header="TryIt" v-model:visible="show"  :modal="true">
    Java-App wurde im TryIt-Modus gestartet. Das bedeutet, dass du mit einem Beispielprogramm herumspielen kannst.
    <p>Damit nicht aus Versehen Daten von Dir gelöscht werden, ist in diesem Modus das automatische Speichern ausgeschaltet. Außerdem kannst du keine neuen Projekte anlegen oder hochladen. Verwende dafür einfach den normalen Modus von JavaApp.</p>
    <p>Viel Spaß beim Ausprobieren.</p>
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