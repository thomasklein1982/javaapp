<template>
  <Dialog position="right" ref="dialog" header="App-Log" v-model:visible="show" :modal="false" maximizable>
    <div>
      <div v-for="(d,i) in data">{{ d.time }}: {{ d.data }}</div>
    </div>
    
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
      },
    },
    components: {
      
    }
  }
  </script>