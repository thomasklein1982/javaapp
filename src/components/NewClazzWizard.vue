<template>
  <div class="p-buttonset" :style="{display: 'grid', gap: '0.2rem', 'grid-template':'1fr 1fr/1fr 1fr 1fr'}">
    <Button :severity="type==='class'?'primary':'secondary'" label="Klasse" @click="type='class'"/>
    <Button :severity="type==='interface'?'primary':'secondary'" label="Interface" @click="type='interface'"/>
    <Button :severity="type==='uiclass'?'primary':'secondary'" label="UI-Klasse" @click="type='uiclass'"/>
    <Button :severity="type==='html'?'primary':'secondary'" label="HTML" @click="type='html'"/>
    <Button :severity="type==='css'?'primary':'secondary'" label="CSS" @click="type='css'"/>
    <Button :severity="type==='js'?'primary':'secondary'" label="JavaScript" @click="type='js'"/>
  </div>
  <h1>{{labelAdd}}</h1>
  
  <InputText type="search" clazz="nameError?'':'p-invalid'" v-model.trim="name" :placeholder="labelName"/>
  <small v-if="nameError" class="p-error">{{nameError}}</small>
  <small v-else-if="nameWarning" class="p-warning">{{nameWarning}}</small>
  <small v-else>Der Name geht in Ordnung.</small>
  <p><Button label="Hinzufügen" :disabled="disableConfirm" icon="pi pi-check" @click="confirm()"/></p>
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
      type: "class"
    };
  },
  computed: {
    labelAdd(){
      return {
        'class': "Neue Klasse hinzufügen",
        'interface': "Neues Interface hinzufügen",
        'uiclass': "Neue UI-Klasse hinzufügen",
        'html': "Neue HTML-Datei hinzufügen",
        'css': "Neue CSS-Datei hinzufügen",
        'js': "Neue JavaScript-Datei hinzufügen"
      }[this.type];
    },
    labelName(){
      return {
        'class': "Name der neuen Klasse",
        'interface': "Name des neuen Interface",
        'uiclass': "Name der neuen UI-Klasse",
        'html': "Name der neuen HTML-Datei",
        'css': "Name der neuen CSS-Datei",
        'js': "Name der neuen JavaScript-Datei"
      }[this.type];
    },
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
      let c=this.project.getClazzByName(this.name);
      if(c){
        if(c.isNative()){
          return "Es gibt bereits eine eingebaute Klasse mit diesem Namen.";
        }else{
          return "Es gibt bereits eine Klasse mit diesem Namen.";
        }
      }
      return false;
    },
    nameWarning(){
      if(this.nameError) return null;
      let c=this.project.getClazzByName(this.name);
      if(c && c.isNative()){
        return "Wenn du diesen Namen verwendest, kannst du die eingebaute Klasse '"+this.name+"' nicht mehr verwenden.";
      }
      return null;
    }
  },
  methods: {
    confirm(){
      this.$emit("confirm",{name: this.realName, type: this.type});
    }
  }
}
</script>