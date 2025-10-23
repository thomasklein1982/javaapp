<template>
  <div style="padding: 0.5rem">
  <h2>Neue Datei erzeugen</h2>
    <div class="p-buttonset" :style="{display: 'grid', gap: '0.2rem', 'grid-template':'1fr 1fr/1fr 1fr 1fr'}">
      <template v-if="!$root.webMode">
        <Button :severity="type==='class'?'primary':'secondary'" label="Klasse" @click="type='class'"/>
        <Button :severity="type==='interface'?'primary':'secondary'" label="Interface" @click="type='interface'"/>
        <Button :severity="type==='uiclass'?'primary':'secondary'" label="UI-Klasse" @click="type='uiclass'"/>
      </template>
      <Button :severity="type==='html'?'primary':'secondary'" label="HTML" @click="type='html'"/>
      <Button :severity="type==='css'?'primary':'secondary'" label="CSS" @click="type='css'"/>
      <Button :severity="type==='js'?'primary':'secondary'" label="JavaScript" @click="type='js'"/>
    </div>
    
    <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;" :style="{display: 'flex', 'place-items':'baseline'}">
      <div :style="{flex: 1}">
        <InputText id="filename" type="search" clazz="nameError?'':'p-invalid'" v-model.trim="name" :placeholder="labelName" fluid/>
      </div>
      <div>
        .{{ extension }}
      </div>
    </div>
    <small v-if="nameError" class="p-error">{{nameError}}</small>
    <small v-else-if="nameWarning" class="p-warning">{{nameWarning}}</small>
    <small v-else>Der Name geht in Ordnung.</small>
    <p><Button label="Hinzufügen" :disabled="disableConfirm" icon="pi pi-check" @click="confirm()"/></p>
    <Divider/>
    <h2>Dateien hochladen</h2>
    <p>Wähle bestehende Dateien aus und lade sie hoch.</p>
    <Button label="Hochladen" icon="pi pi-upload" @click="uploadFile()"/>
  </div>
</template>

<script>
import { Divider } from 'primevue';
import { Clazz } from '../classes/Clazz';
import { SourceFile } from '../classes/SourceFile';
import { UIClazz } from '../classes/UIClazz';
import { upload } from '../functions/helper';


export default {
  components: {
    Divider
  },
  props: {
    project: Object
  },
  emits: [
    'confirm'
  ],
  data: function(){
    return {
      name: '',
      type: this.$root.webMode? "html":"class"
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
    extension(){
      return {
        'class': "java",
        'interface': "java",
        'uiclass': "java",
        'html': "html",
        'css': "css",
        'js': "js"
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
      if(this.type==="class" || this.type==="interface" || this.type==="uiclass")
        return this.name.charAt(0).toUpperCase()+this.name.substring(1);
      else return this.name;
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
        let ext=null;
        let ext2={
          'class': "java",
          'interface': "java",
          'uiclass': "java",
          'html': "html",
          'css': "css",
          'js': "js"
        }[this.type];
        if(c instanceof Clazz || c instanceof UIClazz) ext="java";
        else if(c instanceof SourceFile) ext=c.fileType;
        if(ext===ext2 || ext==="html" && ext2==="java" || ext==="java" && ext2==="html"){
          if(c.isNative()){
            return "Es gibt bereits eine eingebaute Klasse mit diesem Namen.";
          }else{
            return "Es gibt bereits eine Datei mit diesem Namen.";
          }
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
    async uploadFile(){
      let files=await upload({ multi: true});
      console.log(files);
      let errors=[];
      for(let i=0;i<files.length;i++){
        let f=files[i];
        let name=f.fileName;
        let code=f.code;
        let p=name.lastIndexOf(".");
        let ext=name.substring(p+1);
        name=name.substring(0,p);
        name=name.replace(/\W/g,"");
        if(ext!=="html" && ext!=="css" && ext!=="js" && ext!=="java" && ext!=="ui"){
          errors.push(f);
          continue;
        }
        console.log("import ",f,name);
        let j=1;
        let baseName=name;
        while(!this.project.isFileNameOK(name,ext)){
          name=baseName+="_"+j;
          j++;
        }
        let c;
        if(ext==='java'){
          c=new Clazz(name,this.project,false);
          c.src=code;
        }else if(ext==='ui'){
          c=new UIClazz(name,this.project);
          try{
            let o=JSON.parse(code);
            o.name=name;
            c.restoreFromSaveObject(o);
          }catch(e){

          }
        }else{
          c=new SourceFile(name,ext,this.project);
          c.src=code;
        }
        this.project.addClazz(c);
        this.$root.emitEvent("new-class",{name})
      }
      if(errors.length>0)
        alert(errors.length+" Dateien konnten nicht geladen werden:\n- "+errors.map((v)=>v.fileName).join("\n- "));
    },
    confirm(){
      this.$emit("confirm",{name: this.realName, type: this.type});
    }
  }
}
</script>