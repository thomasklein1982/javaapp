<template>
  <Drawer v-model:visible="show" header="Dateien">
    <template v-for="(f,i) in files">
      <div>{{ f.name }}</div>
    </template>
  </Drawer>
</template>

<script>
import { Drawer } from 'primevue';


export default{
  components: {
    Drawer
  },
  props: {
    project: Object
  },
  computed: {
    files(){
      let files=[];
      for(let i=0;i<this.project.clazzes.length;i++){
        let c=this.project.clazzes[i];
        files.push(c);
      }
      files.sort((a,b)=>{
        return (a.name<b.name? -1: 1);
      });
      return files;
    }
  },
  data(){
    return {
      show: false
    }
  },
  methods: {
    open(){
      this.show=true;
    },
    close(){
      this.show=false;
    },
    toggle(){
      this.show=!this.show;
    }
  }
}
</script>