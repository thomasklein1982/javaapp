<template>
  <Dialog @show="onShow()" header="Terminal" v-model:visible="show" :modal="true" maximizable>
    <div style="background-color: #121212; color: white; font-family: monospace; font-size: 1rem">
      <div style="height: 10rem; overflow: auto; width: 100%;white-space: pre-wrap;" ref="terminal" v-html="text"></div>
      <div style="display: flex">
        <span>#&gt;</span><form @submit.prevent="submit()"><input ref="input" type="text" v-model="input" style="flex: 1; background-color: #121212; color: white; font-family: monospace; font-size: 1rem; outline: none; border: none;"/></form>
      </div>
    </div>
  </Dialog>
</template>

<script>
import { nextTick } from 'vue';
import {splitValues} from '../functions/helper';

export default{
  props: {
      project: Object
    },
    data(){
      return {
        show: false,
        input: "",
        text: ""
      };
    },
    computed: {
      
    },
    methods: {
      onShow(){
        
        setTimeout(()=>{
          this.$refs.input.focus();
        },500);
      },
      setVisible(v){
        this.show=v;
      },
      pushLine(text,color){
        if(this.text.length>0){
          this.text+="\n";
        }
        if(color){
          text="<span style='color:"+color+"'>"+text+"</span>";
        }
        this.text+=text;
        nextTick(()=>{
          this.$refs.terminal.scrollTop=this.$refs.terminal.scrollHeight;
          this.$refs.terminal.scrollLeft=0;
        });
      },
      clear(){
        console.log("clear");
        this.text="";
      },
      submit(){
        let cmd=this.input.trim();
        this.input="";
        if(cmd.length===0) return;
        this.pushLine(">"+cmd);
        let res;
        if(cmd==="cls"){
          this.clear();
          return;
        }
        res=/^\s*java\s*(\w+)(.*)$/.exec(cmd);
        if(res){
          let file=res[1];
          let clazz=this.project.getClazzByName(file);
          if(!clazz){
            this.pushLine("Es gibt keine Klasse namens "+JSON.stringify(file),"red");
          }
          let args=res[2].trim();
          try{
            args=splitValues(args," ");
            this.$emit("run",{file,args});
            this.setVisible(false);
          }catch(e){
            this.pushLine(e);
          }
        }else{
          this.pushLine("Unbekannter Befehl "+JSON.stringify(cmd),"red");
        }
      }
    },
    components: {
      
    }
}

</script>