<template>
  <div v-if="$root.printMode" @click="close()" style="background-color: white; color: black; width: 100%; min-height: 100%; overflow-x: hidden; overflow-y: visible;">
    <h1>Projekt {{ project.name }}</h1>
    <div v-for="(c,i) in project.clazzes" style="break-after: page;">
      <template v-if="!$root.webMode || i>0">
        <template v-if="c.isUIClazz()">
          <h2>UI-Klasse {{c.getFileName()}}</h2>
          <UIComponent :component="c"/>
        </template>
        <template v-else-if="isSourceFile(c)">
          <h2>{{c.getFileName()}}</h2>
          <div v-if="c.errors.length>0" style="font-size: small; font-family: monospace; color: red; margin-bottom: 1rem;">
            <div v-for="(e,j) in c.errors">
              [{{e.line.number}}:{{e.col}}]: {{e.message}} 
            </div>
          </div>
          <CodeDisplay
            :code="c.src"
            :file-type="c.fileType"
          />
        </template>
        <template v-else>
          <h2>Klasse {{c.getFileName()}}</h2>
          <div v-if="c.errors.length>0" style="font-size: small; font-family: monospace; color: red; margin-bottom: 1rem;">
            <div v-for="(e,j) in c.errors">
              [{{e.line.number}}:{{e.col}}]: {{e.message}} 
            </div>
          </div>
          <CodeDisplay
            :code="c.src"
          />
        </template>
      </template>
    </div>
    <template v-if="project.css.trim().length>0">  
      <h1>Globales CSS</h1>
      <CodeDisplay
        :code="project.css"
        file-type="css"
      />
    </template>
    <template v-if="!project.database.isEmpty()">
      <h1>Datenbank</h1>
      <template v-for="(t,i) in project.database.tables">
        <h2>Relation {{ t.name }}</h2>
        <table class="database-table" style="font-size: small">
          <tr>
            <th v-for="(a,i) in t.attributes">
              {{a.name}}
            </th>
          </tr>
          <tr v-for="(r,j) in t.records">
            <td v-for="(v,i) in r">
              {{ v }}
            </td>
          </tr>
        </table>
      </template>
    </template>
  </div>
</template>

<script>
import UIComponent from './UIComponent.vue';
import CodeDisplay from './CodeDisplay.vue';
import { SourceFile } from '../classes/SourceFile';

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
    isSourceFile(c){
      return (c instanceof SourceFile);
    },
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