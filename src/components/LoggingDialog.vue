<template>
  <Dialog style="max-width: 30vw" position="right" ref="dialog" header="App-Log" v-model:visible="show" :modal="false" maximizable @hide="setLoggingEnabled(false)">
    <div style="max-width: 100%;">
      <div v-for="(d,i) in data">{{ d.time }}: {{ d.data }}</div>
    </div>
    <template #footer>
      <Button @click="$root.clearLog()" icon="pi pi-trash"/>
    </template>
  </Dialog>
</template>
  
<script>
  export default{
    props: {
      data: Array
    },
    data(){
      return {
        show: false,
      }
    },
    methods: {
      setVisible(v){
        this.show=v;
        this.setLoggingEnabled(true);
      },
      setLoggingEnabled(v){
        this.$root.setLoggingEnabled(v);
      }
    },
    components: {
      
    }
  }
  </script>