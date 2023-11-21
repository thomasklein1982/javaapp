<template>
  <Dialog header="Einstellungen" v-model:visible="show"  :maximizable="true" :modal="true" :breakpoints="{'960px': '75vw', '640px': '100vw'}" :style="{width: '50vw'}">
    <Button label="Neu starten" @click="restart()"/>
    <div style="padding: 0.2rem">
      <InputSwitch id="optimizeCompiler" v-model="settings.optimizeCompiler"/><label for="optimizeCompiler">Compiler optimieren</label>
    </div>
    <div style="padding: 0.2rem">
      <InputSwitch id="autoUpdateUI" v-model="settings.autoUpdateUI"/><label for="autoUpdateUI">UI-Komponenten automatisch aktualisieren</label>
    </div>
    <div style="padding: 0.2rem">
      <InputSwitch id="showCaretPosition" v-model="settings.showCaretPosition"/><label for="showCaretPosition">Caret-Position anzeigen</label>
    </div>
    <div style="padding: 0.2rem" :style="{display: 'flex', 'justify-content': 'center', 'align-items':'center'}">
      <Button icon="pi pi-minus" @click="changeFontSize(-1)"/>
      <span style="padding: 0.2rem">{{myFontSize}}px</span>
      <Button icon="pi pi-plus" @click="changeFontSize(1)"/>
    </div>
    <div style="padding: 0.2rem" :style="{display: 'flex', 'justify-content': 'center', 'align-items':'center'}">
      <Button icon="pi pi-minus" @click="changeBodyFontSize(-1)"/>
      <span style="padding: 0.2rem">{{bodyFontSize}}px</span>
      <Button icon="pi pi-plus" @click="changeBodyFontSize(1)"/>
    </div>
  </Dialog>
</template>

<script>
export default {
  props: {
    fontSize: Number,
    settings: Object
  },
  computed: {
    
  },
  data(){
    return {
      show: false,
      myFontSize: this.fontSize,
      bodyFontSize: 20
    };
  },
  methods: {
    changeFontSize(ds){
      this.myFontSize+=ds;
      this.$emit("changefontsize",this.myFontSize);
    },
    changeBodyFontSize(ds){
      this.bodyFontSize+=ds;
      if(this.bodyFontSize<4){
        this.bodyFontSize=4;
      }
      document.body.style.fontSize=this.bodyFontSize+"px";
      document.body.parentElement.style.fontSize=document.body.style.fontSize;
    },
    setVisible(v){
      this.show=v;
    },
    confirm(){
      this.show=false;
      this.$emit("confirm",this.template);
    },
    restart(){
      location.reload();
    }
  }
}
</script>