<template>
  <Dialog header="Projekt-Details" modal v-model:visible="show">
    <p>Hier kannst du Details zum Projekt festlegen und ein Manifest und einen Service-Worker herunterladen.</p>
    <div class="p-float-label">
      <InputText style="width: 100%" help="Der Name des Projekts." v-model="name"/>
      <label>Name</label>
    </div>
    <div class="p-float-label">
      <TextArea style="width: 100%" v-model="description"/>
      <label>Beschreibung</label>
    </div>
    <div>
      Theme-Color: <ColorPicker v-model="theme_color"/>
    </div>
    <template #footer>
      <Button :disabled="!nameOK" @click="clickOK()" label="OK"/>
      <Button @click="setVisible(false)" class="p-button-outlined" label="Abbrechen"/>
    </template>
  </Dialog>
</template>

<script>
import ColorPicker from "primevue/colorpicker";

export default {
  components: {
    ColorPicker
  },
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
      description: this.project.description,
      theme_color: this.project.theme_color,
      icon: this.project.icon
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