<template>
  <div class="p-buttonset" :style="{display: 'grid', 'grid-template':'1fr/1fr 1fr'}">
    <Button :severity="type==='class'?'primary':'secondary'" label="Klasse" @click="type='class'"/>
    <Button :severity="type==='interface'?'primary':'secondary'" label="Interface" @click="type='interface'"/>
  </div>
  <h1>{{type==='class'? 'Neue Klasse':'Neues Interface'}} hinzufügen</h1>
  
  <InputText clazz="nameError?'':'p-invalid'" v-model.trim="name" :placeholder="type==='class'? 'Name der neuen Klasse': 'Name des neuen Interface'"/>
  <small v-if="nameError" class="p-error">{{nameError}}</small>
  <small v-else>Der Name geht in Ordnung.</small>
  <div v-if="type==='class'" class="p-inputgroup">
      <span class="p-inputgroup-addon">
        <InputSwitch v-model="uiClazz"/>
      </span>
      <span class="p-inputgroup-addon" :style="{color: uiClazz? '':'lightgray'}">
        UI-Klasse
      </span>
  </div>
  <Button label="Hinzufügen" :disabled="disableConfirm" icon="pi pi-check" @click="confirm()"/>
</template>

<script>
export default {
  props: {
    project: Object
  },
  emits: [
    'confirm'
  ],
  data: function(){
    return {
      name: '',
      type: "class",
      uiClazz: false
    };
  },
  computed: {
    typeName(){
      if(type==="class"){
        return "Klasse";
      }else{
        return "Interface";
      }
    },
    disableConfirm(){
      if(this.nameError){
        return true;
      }else{
        return false;
      }
    },
    realName(){
      if(this.name.length===0) return this.name;
      return this.name.charAt(0).toUpperCase()+this.name.substring(1);
    },
    nameError(){
      if(this.realName.length===0){
        return "Der Name muss aus mindestens einem Zeichen bestehen.";
      }
      if(!/^[A-Za-z]/.test(this.realName)){
        return "Der Name muss mit einem Buchstaben beginnen."
      }
      if(!/^[A-Za-z][A-Za-z0-9_]*$/.test(this.realName)){
        return "Der Name darf nur aus Buchstaben, Ziffern und dem Unterstrich bestehen.";
      }
      if(this.realName==='App'){
        return "Der Name 'App' ist reserviert. Wähle einen anderen Namen.";
      }
      if(this.project.getClazzByName(this.name)){
        return "Es gibt bereits eine Klasse mit diesem Namen.";
      }
      return false;
    }
  },
  methods: {
    confirm(){
      this.$emit("confirm",{name: this.realName, ui: this.uiClazz, type: this.type});
    }
  }
}
</script>