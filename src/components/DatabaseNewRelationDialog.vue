<template>
  <Dialog header="Neue Relation" modal v-model:visible="show">
    <DatabaseNameInput help="Der Name der neuen Relation." v-model="name" label="Name"/>
    <template #footer>
      <Button :disabled="!name.ok" @click="clickOK()" label="OK"/>
      <Button @click="setVisible(false)" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
</template>

<script>
import DatabaseNameInput from "./DatabaseNameInput.vue";
export default {
  data(){
    return {
      show: false,
      name: {
        name: "",
        ok: true
      }
    }
  },
  methods: {
    setVisible(v){
      this.show=v;
    },
    clickOK(){
      this.setVisible(false);
      this.$emit('confirm',this.name.name)
    }
  },
  components: {
    DatabaseNameInput
  }
}
</script>

<style scoped>
  .field *{
    display: block;
  }
</style>