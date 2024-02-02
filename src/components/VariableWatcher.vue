<template>
  <div :style="{marginLeft: depth+'em'}">
    <div @click="clickExpand()" class="unselectable" style="cursor: pointer; display: flex; align-items: center;">
      <span :style="{visibility: isExpandable? '':'hidden'}" :class="isExpanded? 'pi pi-angle-down':'pi pi-angle-right'"/>{{ variable.n }}: {{ value }}
    </div>
    <template v-if="isExpanded">
      {{ depth>1? variable.v:'' }}
      <template v-for="(v,i) in variable.v">
        <VariableWatcher
          :variable="v"
          :template="template[variable.n]"
          :depth="depth+1"
          @update-scope="$emit('update-scope')"
        />
      </template>
    </template>
  </div>
</template>

<script>
export default{
  emits: ["update-scope"],
  props: {
    variable: Object,
    template: Object,
    depth: {
      type: Number,
      default: 0
    }
  },
  computed: {
    isExpanded(){
      return this.template && this.template[this.variable.n];
    },
    isObject(){
      let c=this.variable.t.charAt(0);
      return this.variable.t!=="String" && c===c.toUpperCase();
    },
    isArray(){
      return this.variable.d.length>0;
    },
    isExpandable(){
      return this.isArray||this.isObject;
    },
    value(){
      if(this.isArray){
        return this.variable.t+JSON.stringify(this.variable.d);
      }
      if(this.isObject){
        return this.variable.t;
      }
      if(this.variable.t==="String"){
        return JSON.stringify(this.variable.v);
      }
      return this.variable.v;
    }
  },
  methods: {
    clickExpand(){
      if(this.isExpanded){
        delete this.template[this.variable.n];
      }else{
        this.template[this.variable.n]={};
        this.$emit("update-scope");
      }
    }
  }
}
</script>