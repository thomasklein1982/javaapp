<template>
  <Card class="asset" style="width: auto; display: inline-block" >
    <template #title>{{ name }} <Button v-if="editable" size="small" @click="$emit('edit')" icon="pi pi-pencil"/></template>
    <template #content>
      <template v-if="file.mime.indexOf('image')>=0">
        <img width="100" :src="file.code"/>
      </template>
      <template v-else-if="file.mime.indexOf('audio')>=0">
        <audio controls :src="file.code"/>
      </template>
      <template v-else>
        <span style="border: 1pt white solid; padding: 0.2rem; border-radius: 0.1rem;">Datei {{ file.fileName }}</span>
      </template>
      {{ fileSize }}
    </template>
  </Card>
</template>

<script>
import Card from "primevue/card";

export default {
  props: {
    asset: Object,
    editable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    name(){
      return this.asset.name;
    },
    file(){
      return this.asset.file;
    },
    fileSize(){
      if(!this.file) return "";
      let size=this.file.code.length;
      let unit="B";
      if(size>1000000){
        size/=1000000;
        unit="MB";
      }else if(size>1000){
        size/=1000;
        unit="KB";
      }
      if(unit!=="B"){
        size=size.toFixed(1);
      }
      return size+" "+unit;
    }
  },
  data(){
    return {

    };
  },
  methods: {

  },
  components: {
    Card
  }
};
</script>