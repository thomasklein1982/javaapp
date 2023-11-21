<template>
  <div v-if="$root.printMode" @click="close()" style="background-color: white; color: black; width: 100%; min-height: 100%; overflow-x: hidden; overflow-y: visible;">
    <h1>Klassen</h1>
    <div v-for="(c,i) in project.clazzes">
      <template v-if="c.isUIClazz()">
        <h2>UI-Klasse {{c.name}}</h2>
        <UIComponent :component="c"/>
      </template>
      <template v-else>
        <h2>Klasse {{c.name}}</h2>
        <div v-if="c.errors.length>0" style="font-size: small; font-family: monospace; color: red; margin-bottom: 1rem;">
          <div v-for="(e,j) in c.errors">
            [{{e.line.number}}:{{e.col}}]: {{e.message}} 
          </div>
        </div>
        <CodeDisplay
          :code="c.src"
        />
      </template>
    </div>
    <template v-if="project.css.trim().length>0">  
      <h1>Globales CSS</h1>
      <CodeDisplay
        :code="project.css"
      />
    </template>
  </div>
</template>

<script>
import UIComponent from './UIComponent.vue';
import CodeDisplay from './CodeDisplay.vue';

export default {
  props: {
    project: Object
  },
  data(){
    return {
      
    };
  },
  computed: {
    completeCode(){
      return "test";
    }
  },
  methods: {
    
    open(){
      this.$root.printMode=true;
    }, 
    close(){
      this.$root.printMode=false;
    }
  },
  components: {
    UIComponent,
    CodeDisplay
  }
}
</script>