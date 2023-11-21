<template>
  <div :style="{flex: 1}" style="position: relative; width: 100%; height: 100%;">
    <div ref="wrapper" style="width: 100%; height: 100%;"></div>
  </div>
</template>
<script>
import { UIClazz } from '../classes/UIClazz';
  export default {
    props: {
      uiClazz: Object
    },
    data: function(){
      return {
        frame: null
      }
    },
    methods: {
      focus(){
        if(this.frame){
          this.frame.focus();
        }
      },
      clear(){
        if(!(this.uiClazz instanceof UIClazz)) return;
        let frame=document.createElement('div');
        frame.style="color: red; background-color: white; width: 100%; height: 100%; display: flex; align-items: center; text-align: center";
        frame.innerHTML="Automatisches Aktualisieren ist deaktiviert...";
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.$refs.wrapper.appendChild(frame);
        this.frame=null;
      },
      reload(){
        if(!(this.uiClazz instanceof UIClazz)) return;
        let frame=document.createElement('iframe');
        frame.style="background-color: white; width: 100%; height: 100%;";
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.$refs.wrapper.appendChild(frame);
        let code=this.uiClazz.getUIPreviewCode();
        let doc=frame.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
        this.frame=frame;
        this.focus();
      }
    }
  }
</script>