<template>
  <div class="umlmember" @click="click()">
    <span class="umlmember-modifiers"><span v-html="visibility"></span><sup class="static" v-if="member.isStatic()">S</sup></span><span class="umlmember-signature">{{member.getSignatureString()}}</span>
  </div>
</template>

<script>
import { nextTick } from '@vue/runtime-core';
export default {
  props: {
    member: Object
  },
  computed: {
    visibility(){
      let v=this.member.modifiers.visibility;
      if(v==="private") return "&minus;";
      if(v==="protected") return "#";
      return "+";
    }
  },
  methods: {
    click(){
      let editor=this.$root.$refs.editor;
      for(let i=0;i<editor.$refs.editor.length;i++){
        let cm=editor.$refs.editor[i];
        if(cm.clazz===this.member.clazz && this.member.node){
          editor.activeTab=cm.tabIndex;
          let offset=this.member.clazz.getPositionShift();
          cm.setSelection(this.member.getFrom()+offset,this.member.getTo()+offset);
          nextTick(()=>{
            cm.focus()
          });
        }
      }
      // let index=editor.project.getClazzIndexByName(this.member.clazz.name);
      // editor.activeTab=index;
      // console.log(editor);
      // let cm=editor.$refs.editor[index];
      // cm.setSelection(this.member.node.from,this.member.node.to);
      // nextTick(()=>{
      //     cm.focus()
      //   }
      // );
    }
  }
}
</script>

<style scoped>
.umlmember{
  display: flex;
  cursor: pointer;
}
.umlmember-signature{
  display: inline-block;
  flex: 1;
  font-family: monospace;
  align-self: flex-end;
}
.umlmember-modifiers{
  display: inline-block;
  width: 1em;
  text-align: center;
}
.static{
  font-size: small;
}
</style>