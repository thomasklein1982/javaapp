<template>
  <Dialog header="CSS-Editor" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <CodeMirrorEditor v-model="project.css" language="css"/>    
    
    
  </Dialog>
</template>
  
<script>
  import CodeMirrorEditor from './CodeMirrorEditor.vue';
  
  export default {
    props: {
      project: Object
    },
    data(){
      return {
        show: false,
      };
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
    },
    components: {
      CodeMirrorEditor
    }
  }
  </script>