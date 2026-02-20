<template>
  <div :style="{flex: 1}" style="position: relative; width: 100%; height: 100%;z-index:100">
    <div ref="wrapper" style="width: 100%; height: 100%;"></div>
    <div v-if="paused" style="position: absolute; top: 3px; right: 3px">Angehalten...</div>
  </div>
</template>
<script>
import { options } from '../classes/Options';

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
      sendMessage(data){
        if(this.frame){
          this.frame.contentWindow.postMessage(data);
        }
      },
      askForScope(template){
        if(this.frame){
          this.frame.contentWindow.postMessage({
            type: "getScope",
            template: JSON.stringify(template)
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
      resume(args){
        if(this.frame){
          this.frame.contentWindow.postMessage({
            type: "debug-resume",
            slowMode: this.$root.getSlowModeDelay()
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
      stepAbove(){
        this.frame.contentWindow.postMessage({
          type: "debug-step-above"
        });
        this.focus();
      },
      stop(){
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.frame=null;
      },
      reload(noDebugging, args, additionalCode){
        this.project.compile();
        let frame=document.createElement('iframe');
        frame.style="background-color: white; width: 100%; height: 100%;";
        frame.setAttribute("sandbox", "allow-downloads allow-forms allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-modals");
        if(this.$refs.wrapper.firstChild){
          this.$refs.wrapper.removeChild(this.$refs.wrapper.firstChild);
        }
        this.$refs.wrapper.appendChild(frame);
        let prefix;
        if(this.$root.webMode){
          prefix="$App.console.hide();";
        }else{
          prefix=noDebugging?"$App.console.hide();":"$App.debug.setBreakpoints("+JSON.stringify(this.breakpoints)+"); window.addEventListener('keydown',(e)=>{console.log(e); let key=e.code||e.keyCode; if ( key === 113 || key==='F2') {e.preventDefault();$Exercise.sendMessage('keydown',{key: 'F2'});}},true);";
        }
        prefix+="$App.debug.slowMode="+(this.$root.getSlowModeDelay())+";\n";
        prefix+=additionalCode;
        let code=this.project.getFullAppCode(prefix,false,false,args);

        const blob = URL.createObjectURL(
          new Blob([code], { type: "text/html" })
        );
        frame.src=blob;
        URL.revokeObjectURL(blob);
        // let doc=frame.contentWindow.document;
        // doc.open();
        // doc.write(code);
        // doc.close();
        this.frame=frame;
        this.focus();
      }
    }
  }
</script>