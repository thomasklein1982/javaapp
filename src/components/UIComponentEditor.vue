<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <div v-if="!maximized" :style="{display: 'flex', 'align-items': 'center'}">
      <Button @click="showExpandedDialog=true" icon="pi pi-window-maximize"/>&nbsp;{{ componentName }}
    </div>
    <table style="width: 100%">
      <tr><td style="width: 0"></td><td></td></tr>
      <template v-if="!component.controlComponent">
        <tr>
          <td>Name:</td>
          <td><InputText type="search" spellcheck="false" v-model.trim="component.name" @change="emitRecompile()" style="width: 95%"/></td>
        </tr>
        <tr>
          <td colspan="2" style="color: red" v-if="nameError">Der Name muss mit einem Buchstaben beginnen.</td>
        </tr>
        <tr>
          <td>Array:</td>
          <td><InputText type="search" spellcheck="false" v-model.trim="component.array" @change="emitRecompile()" style="width: 95%"/></td>
        </tr>
      </template>
      <template v-if="uiClazz">
        <tr v-for="(v,i) in uiClazz.variables">
          <td>{{ v.name }}:</td>
          <td>
            <InputText spellcheck="false" v-model="component.variablesValues[v.name]" @change="emitRecompile()" style="width: 95%"/>
          </td>
        </tr>
      </template>
      <template v-if="component.tag!==undefined">
        <tr>
          <td>Tag:</td>
          <td><InputText type="search" spellcheck="false" @change="emitUpdate()" v-model.trim="component.tag" style="width: 95%"/></td>
        </tr>
        <tr>  
          <td>Attribute:</td>
          <td><TextArea rows="2" spellcheck="false" @change="emitUpdate()" v-model="component.attributes" style="width: 95%; resize: vertical"/></td>
        </tr>
      </template>
      <tr v-if="component.options!==undefined">
        <td>Optionen:</td>
        <td><InputText type="search" spellcheck="false" @change="emitUpdate()" v-model.trim="component.options" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.label!==undefined">
        <td>Text:</td>
        <td><InputText type="search" spellcheck="false" @change="emitUpdate()" v-model="component.label" style="width: 95%"/></td>
      </tr>
      <tr v-if="component.inputType!==undefined">
        <td>Eingabetyp:</td>
        <td><Select @change="emitUpdate()" :options="['text','number']" v-model="component.inputType" style="width: 95%"/></td>
      </tr>
      <tr v-if="type && type.labels && type.labels.value!==undefined">
        <td>Wert:</td>
        <td v-if="component.valueType==='Boolean'">
          <ToggleSwitch @change="emitUpdate()" v-model="component.value"/>
        </td>
        <td v-else-if="component.valueType===undefined || component.valueType==='inline-text'">
          <InputText type="search" spellcheck="false" @change="emitUpdate()" v-model="component.value" style="width: 95%"/>
        </td>
        <td v-else-if="component.valueType==='text' || !maximized">
          <TextArea rows="2" spellcheck="false" @change="emitUpdate()" v-model="component.value" style="width: 95%; resize: vertical"/>
        </td>
        <td v-else>
          <CodeMirrorEditor style="max-width: 95%" :language="component.valueType" v-model="component.value"/>
        </td>
      </tr>
      <tr v-if="component.placeholder!==undefined">
        <td>Platzhalter:</td>
        <td><InputText type="search" spellcheck="false" @change="emitUpdate()" v-model="component.placeholder" style="width: 95%"/></td>
      </tr>
      <template v-if="component.align!==undefined">
        <tr>
          <td>Ausrichtung:</td>
          <td ><Select style="width: 95%"  @change="emitUpdate()" v-model="component.align" :options="['center','top &uArr;', 'bottom &dArr;','left &lArr;','right &rArr;','left top &nwArr;', 'left bottom &swArr;', 'right top &neArr;', 'right bottom &seArr;']"/></td>
        </tr>
      </template>
      <tr v-if="!component.controlComponent && !isUIClazz">
        <td>Unsichtbar:</td>
        <td><ToggleSwitch @change="emitUpdate()" v-model="component.invisible"/></td>
      </tr>
      <template v-if="component.maxX!==undefined">
        <tr>
          <td>min. x:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.minX" style="width: 95%"/></td>
        </tr>
        <tr>
          <td>max. x:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.maxX" style="width: 95%"/></td>
        </tr>
        <tr>
          <td>min. y:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.minY" style="width: 95%"/></td>
        </tr>
        <tr>
          <td>max. y:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.maxY" style="width: 95%"/></td>
        </tr>
      </template>
      <template v-if="component.imageZoom!==undefined">
        <tr>
          <td>Bild-Zoom:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.imageZoom" style="width: 95%"/></td>
        </tr>
        <!-- <tr>
          <td>Bild-Höhe:</td>
          <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.imageHeight" style="width: 95%"/></td>
        </tr> -->
        <tr>
          <td>Bild-Verschiebung-X:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.imageTranslationX" style="width: 95%"/></td>
        </tr>
        <tr>
          <td>Bild-Verschiebung-Y:</td>
          <td><InputText type="number" spellcheck="false" @change="emitUpdate()" v-model.number="component.imageTranslationY" style="width: 95%"/></td>
        </tr>
      </template>
      <template v-if="component.sizePolicy!==undefined">
        <td>Anpassung:</td>
        <td><Select @change="emitUpdate()" :options="['fit','stretch']" v-model="component.sizePolicy" style="width: 95%"/></td>
      </template>
      <tr v-if="component.onAction!==undefined">
        <td>onAction auslösen?</td>
        <td><ToggleSwitch v-model="component.onAction"/></td>
      </tr>
      <!-- <tr v-if="component.onMouseDown!==undefined">
        <td>onMouseDown auslösen?</td>
        <td><ToggleSwitch v-model="component.onMouseDown"/></td>
      </tr>
      <tr v-if="component.onMouseUp!==undefined">
        <td>onMouseUp auslösen?</td>
        <td><ToggleSwitch v-model="component.onMouseUp"/></td>
      </tr>
      <tr v-if="component.onMouseMove!==undefined">
        <td>onMouseMove auslösen?</td>
        <td><ToggleSwitch v-model="component.onMouseMove"/></td>
      </tr> -->
      <tr>
        <td>ActionCommand:</td>
        <td><InputText spellcheck="false" @change="emitUpdate()" v-model.trim="component.actionCommand" style="width: 95%"/></td>
      </tr>
      <template v-if="component.template!==undefined">
        <tr>
          <td rowSpan="1">Layout:</td>
          <td ><div style="width: 95%" :style="{display: 'flex'}"><InputText spellcheck="false" @change="emitUpdate()" v-model.trim="component.template" :style="{flex: 1}" /><Button icon="pi pi-pencil" label="" @click="$refs.templateDialog.setVisible(true,component.template)"/></div> </td>
        </tr>
      </template>
      <tr v-if="!component.disabled!==undefined">
        <td>Deaktiviert:</td>
        <td><ToggleSwitch @change="emitUpdate()" v-model="component.disabled"/></td>
      </tr>
      <template v-if="component.controlComponent">
        <tr v-for="(v,a) in component.controlComponent">
          <td>{{ a }}</td>
          <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.controlComponent[a]" style="width: 95%"/></td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td>CSS-Regeln:</td>
          <td v-if="!maximized">
            <TextArea spellcheck="false" @change="emitUpdate()" v-model.trim="component.cssCode" style="width: 95%; resize: vertical;"/>
          </td>
          <td v-else>
            <CodeMirrorEditor language="css" v-model.trim="component.cssCode" style="max-width: 95%"/>
            
          </td>
        </tr>
        <tr>
          <td>CSS-Klassen:</td>
          <td><InputText spellcheck="false" @change="emitUpdate()" v-model.trim="component.cssClass" style="width: 95%"/></td>
        </tr>
        <!-- <tr>
          <td>Absolute Position:</td>
          <td><ToggleSwitch @change="emitUpdate()" v-model="component.forceAbsolute"/></td>
        </tr> -->
        <template v-if="!isUIClazz">
          <tr>
            <td>x:</td>
            <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.x" style="width: 95%"/></td>
          </tr>
          <tr>
            <td>y:</td>
            <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.y" style="width: 95%"/></td>
          </tr>
          <tr>
            <td>Breite:</td>
            <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.width" style="width: 95%"/></td>
          </tr>
          <tr>
            <td>Höhe:</td>
            <td><InputText spellcheck="false" @change="emitUpdate()" v-model="component.height" style="width: 95%"/></td>
          </tr>
        </template>
      </template>
    </table>
  </div>
  <TemplateDialog ref="templateDialog" @confirm="applyTemplate"/>
  <Dialog @hide="emitUpdate(true)" v-if="!maximized" maximized :header="componentName" v-model:visible="showExpandedDialog"  :maximizable="true" :modal="true" >
    <UIComponentEditor maximized :project="project" :component="component"/>
  </Dialog>
</template>

<script>
import { UIClazz } from '../classes/UIClazz';
import CodeMirrorEditor from './CodeMirrorEditor.vue';
import TemplateDialog from './TemplateDialog.vue';

  let timer;
  let oldName=null;
  export default{
    props: {
      component: Object,
      project: Object,
      maximized: {
        type: Boolean,
        default: false
      },
      settings: Object
    },
    computed: {
      nameError(){
        if(!this.component) return false;
        let name=this.component.name;
        if(!/[a-zA-Z_]\w*/.test(name)){
          return true;
        }
        return false;
      },
      type(){
        if(this.component.type==="JImage"){
          console.log("image");
        }
        return UIClazz.UIClazzes[this.component.type];
      },
      isUIClazz(){
        return this.component instanceof UIClazz;
      },
      uiClazz(){
        if(this.component.type!=='UIClazz')
          return null;
        let uc=this.project.getClazzByName(this.component.componentName);
        if(!uc) return null;
        return uc;
      },
      componentName(){
        if(this.component.componentName){
          return this.component.componentName;
        }else{
          return this.component.type;
        }
      }
    },
    data(){
      return {
        showExpandedDialog: false
      };
    },
    watch: {
      "component.name": {
        handler: function(n){
          if(!n) return;
          n=n.replace(/\s/g,"");
          n=n.replace(/[^A-Za-z0-9_]/g,"");
          this.component.name=n;
        }
      }
    },
    methods: {
      applyTemplate(template){
        this.component.template=template;
        this.emitUpdate();
      },
      emitRecompile(){
        if(this.settings.autoUpdateUI){
          this.$emit("recompile");  
        }
      },
      emitUpdate(force){
        if(this.settings.autoUpdateUI && (force || !this.maximized)){
          this.$emit("isolatedupdate");
        }
      }
    },
    emits: ["isolatedupdate","recompile"],
    components: {
      TemplateDialog,
      CodeMirrorEditor
  }
  }
</script>
