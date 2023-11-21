<template>
  <Dialog header="Projekt-Details" modal v-model:visible="show">
    <InputText help="Der Name des Projekts." v-model="name" label="Name"/>
    <template #footer>
      <Button :disabled="!nameOK" @click="clickOK()" label="OK"/>
      <Button @click="setVisible(false)" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
</template>

<script>
export default {
  props: {
    project: Object
  },
  computed: {
    nameOK(){
      let name=this.name.trim();
      if(name.length===0) return false;
      return true;
    }
  },
  data(){
    return {
      show: false,
      name: this.project.name,
    }
  },
  methods: {
    setVisible(v){
      this.show=v;
    },
    clickOK(){
      this.setVisible(false);
      this.project.name=this.name.trim();
    }
  }
}
</script>

<style scoped>
  .field *{
    display: block;
  }
</style>