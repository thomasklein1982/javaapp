<template>
  <DatabaseRelationEditDialog ref="dialogEdit" :relation="relation"/>
  <Card >
    <template #header>
      <div>{{relation.name}} ({{relation.getAttributeNames()}})</div>
    </template>
    <template #content>
      <ConfirmPopup/>
      <div class="inline-buttons">
        <Button @click="openEditDialog()" icon="pi pi-pencil"/>
        <Button @click="trash($event)" class="p-button-outlined" icon="pi pi-trash"/>
      </div>
    </template>
  </Card>
</template>

<script>
import DatabaseRelationEditDialog from './DatabaseRelationEditDialog.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row';                     //optional for row

export default {
  props: {
    relation: Object
  },
  emits: ["trash"],
  methods: {
    openEditDialog(){
      this.relation.database.changed=true;
      this.$refs.dialogEdit.setVisible(true);
    },
    trash(event) {
      this.$confirm.require({
        target: event.currentTarget,
        message: 'Willst du diese Relation wirklich löschen?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.$emit("trash");
        },
        reject: () => {
            
        }
      });
    },
  },
  components: {
    DataTable,Column,Row, DatabaseRelationEditDialog
  }
}
</script>
  