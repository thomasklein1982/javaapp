<template>
  <Dialog :closable="false" header="Neues Projekt erstellen" :visible="show"> 
    <div class="p-field">
      <InputText id="name" placeholder="Name des neuen Projekts" type="text" v-model="name" aria-describedby="name-help"/>
      <small id="name-help">Gib deinem Projekt einen Namen.</small>
    </div>
    <template #footer>
      <Button @click="confirm()" label="OK" icon="pi pi-check" autofocus />
      <Button label="No" icon="pi pi-times" class="p-button-text"/>
    </template>
  </Dialog>

</template>
<script>
export default {
  data(){
      return {
        show: false,
        name: ''
      }
    },
    computed: {
      
    },
    methods: {
      open(){
        this.show=true;
      },
      close(){
        this.show=false;
      },
      confirm(){
        this.$emit('ok',this.name);
        this.name="";
        this.close();
      }
    }
}
</script>
<style scoped>
  .p-field * {
    display: block;
  }
</style>