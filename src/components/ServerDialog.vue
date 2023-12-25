<template>
  <Dialog header="Lokaler Server" v-model:visible="show" :modal="true">
    <p>Hiermit kannst du deine App auf einem lokalen Server ausführen, damit du sie im Browser öffnen und debuggen kannst.</p>
    <p>Falls du ein iPad verwendest: Installiere dir unbedingt die <a href="">Web Inspector</a>-Erweiterung für Safari.</p>
    <Button @click="startServer()">Server starten</Button>
    <div v-if="serverURL"><a style="text-decoration: none" target="_blank" :href="serverURL"><div style="padding: 0.5rem; color: #FFD54F; text-align: center;">Link zur App</div></a></div>
    <div v-else>Aktuell läuft noch kein Server</div>
  </Dialog>
</template>
  
<script>
  
  export default {
    props: {
      project: Object
    },
    data(){
      return {
        show: false,
        serverURL: null
      };
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      startServer(){
        this.project.compile();
        let code=this.project.getFullAppCode();

        const blob = URL.createObjectURL(
          new Blob([code], { type: "text/html" })
        );
        if(this.serverURL){
          URL.revokeObjectURL(this.serverURL);
        }
        this.serverURL=blob;
      }
    },
    components: {
      
    }
  }
  </script>