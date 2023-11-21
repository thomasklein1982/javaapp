<template>
  <div :style="{flex: 1}" style="position: relative; width: 100%; height: 100%;z-index:100">
    <div ref="wrapper" style="width: 100%; height: 100%;"></div>
    <div v-if="paused" style="position: absolute; top: 3px; right: 3px">Angehalten...</div>
  </div>
</template>
<script>
  export default {
    props: {
      project: Object,
      paused: {
        type: Boolean,
        default: false
      }
    },
    data: function(){
      return {
        frame: null,
        breakpoints: null
      }
    },
    methods: {
      focus(){
        if(this.frame){
          this.frame.focus();
        }
      },
      setBreakpoints(bp){
        //console.log("set bp", bp);
        this.breakpoints=bp;
        if(this.frame){
          this.frame.contentWindow.postMessage({
            type: "breakpoints",
            breakpoints: bp
          });
        }
      },
      runInFullscreen(){
        this.stop();
        this.reload(true);
        if(!this.frame) return;
        this.frame.style.position="fixed";
        this.frame.style.left="0";
        this.frame.style.right="0";
        this.frame.style.top="0";
        this.frame.style.bottom="0";
        this.frame.focus();
      },
      resume(){
        if(this.frame){
          this.frame.contentWindow.postMessage({
            type: "debug-resume"
          });
        }
        this.focus();
      },
      step(){
        this.frame.contentWindow.postMessage({
          type: "debug-step"
        });
        this.focus();
      },
      stop(){
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.frame=null;
      },
      reload(noDebugging){
        let frame=document.createElement('iframe');
        frame.style="background-color: white; width: 100%; height: 100%;";
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.$refs.wrapper.appendChild(frame);
        console.log("start app",this.breakpoints);
        let prefix=noDebugging?"console.hide();":"$App.debug.setBreakpoints("+JSON.stringify(this.breakpoints)+");";
        let code=this.project.getFullAppCode(prefix);
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