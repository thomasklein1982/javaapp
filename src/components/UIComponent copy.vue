<template>
  <div style="position: relative; padding: 0.1rem" :style="{'user-select': 'none',border: selectedComponent===component? '2pt solid gold':'2pt solid transparent'}" >
    <span style="color: red" class="pi handle pi-exclamation-circle" v-if="component.errors && component.errors.length>0"/>
    <div v-if="!isContainer" :style="{display: 'flex'}">
      <div style="position: relative" :style="{flex: 1}">
        <template v-if="type==='JButton'">
          <button class="component jbutton">{{component.value}}</button>
        </template>
        <template v-if="type==='JLabel'">
          <div class="component jlabel">{{component.value}}</div>
        </template>
        <template v-if="type==='JHtml'">
          <div class="component jhtml">{{component.value}}</div>
        </template>
        <template v-if="type==='JTextField'">
          <input type="text" size="1" class="component jtextfield" :value="isEditable? component.value:'JTextField'" :placeholder="component.placeholder"/>
        </template>
        <template v-if="type==='JImage'">
          <div class="jimage"><span class="pi pi-image"/> {{ isEditable? imageName:'JImage' }}</div>
        </template>
        <template v-if="type==='JCheckBox'">
          <input type="checkbox" :checked="component.value"/> {{component.label}}
        </template>
        <template v-if="type==='JTextArea'">
          <textarea type="text" style="min-width:0" class="component jtextarea" :value="isEditable? component.value:'JTextArea'" :placeholder="component.placeholder"/>
        </template>
        <template v-if="type==='JComboBox'">
          <select class="component jcombobox">
            <option>{{isEditable? component.value: 'JComboBox'}}</option>
          </select>
        </template>
        <template v-if="type==='DataTable'">
          <table class="datatable">
            <tr>
              <th colSpan="3">DataTable</th>
            </tr>
            <tr style="background-color: lightgray">
              <td v-for="j in 3">&nbsp;</td>
            </tr>
          </table>
        </template>
        <div style="position: absolute; top: 0; right: 0">
          <Badge v-if="showActionCommand" :value="'\u00BB'+component.actionCommand+'\u00AB'" severity="warning" ></Badge>
          <Badge v-if="showName" :value="component.name" severity="info" ></Badge>
        </div>
        <div @click="handleClick" style="cursor: pointer; position: absolute; left: 0; right: 0; top: 0; bottom: 0"></div>
      </div>
      <span style="display:inline-block" v-if="selectedComponent===component">
        <Button icon="pi pi-copy" @click="clickDuplicate()"/>
        <Button icon="pi pi-trash" @click="clickRemove($event)"/>
      </span>
      <span class="pi handle pi-arrows-alt"/>
    </div>
    <template v-else>
      <div>
        <template v-if="isUIClazz">
          <div class="ui-clazz-top"  :style="{display: 'flex', 'align-items': 'center'}" >
            <span @click="handleClick" :style="{flex: 1, alignSelf: 'stretch'}">UI-Klasse {{uiClazzName}}</span>
            <Button icon="pi pi-copy" @click="clickDuplicateUIClazz()"/>
            <Button icon="pi pi-trash" @click="clickRemoveUIClazz($event)"/>
            <Button @click="$emit('recompile',true)" icon="pi pi-refresh"/>
          </div>
          <TextArea class="ui-clazz-variables" auto-resize style="width: 100%" v-model="component.variablesRaw" @change="emitRecompile()"/>
          <div style="font-family: monospace; color: red">
            <div v-for="(e,i) in component.variablesErrors"><template v-if="e.line">Z{{ e.line.number }}: {{ e.message }}</template><template v-else>{{ e }}</template></div>
          </div>
        </template>
        <div v-else class="jpanel-color" :style="{display: 'flex'}">
          <button @click="toggleHideContent()">{{hideContent? '+':'-'}}</button>
          <div v-if="type==='JPanel' || type==='Canvas' || type==='UIClazz'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">{{containerDisplayType}}
            <Badge v-if="showActionCommand" :value="'\u00BB'+component.actionCommand+'\u00AB'" severity="warning" ></Badge>
            <Badge v-if="showName" :value="component.name" severity="info" style="position: absolute; top: 0; right: 0"></Badge>
          </div>
          <div v-else-if="type==='For'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Wiederhole <template v-if="isEditable">für <strong>{{component.controlComponent.variable}}</strong> = <strong>{{component.controlComponent.min}}</strong> bis <strong>{{component.controlComponent.max}}</strong>:</template>
          </div>
          <div v-else-if="type==='If'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Falls <template v-if="isEditable"><strong>{{component.controlComponent.condition}}</strong>:</template>
          </div>
          <div v-else-if="type==='ElseIf'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Ansonsten falls <strong>{{component.controlComponent.condition}}</strong>:
          </div>
          <div v-else-if="type==='Else'" :style="{flex: 1}" style="position: relative" @click="handleClick" class="jpanel-top">Ansonsten:
          </div>
          <span style="display:inline-block" v-if="selectedComponent===component">
            <Button icon="pi pi-copy" @click="clickDuplicate()"/>
            <Button icon="pi pi-trash" @click="clickRemove($event)"/>
          </span>
          <span class="pi handle pi-arrows-alt"/>
        </div>
        <div v-show="!hideContent" style="width: 100%" :class="isUIClazz? 'ui-clazz-body':''" :style="{display: 'flex', 'flex-direction': 'row'}">
          <div v-if="!isUIClazz" @click="handleClick" class="jpanel-left">&nbsp;</div>
          <draggable
            v-model="component.components"
            item-key="id"
            :disabled="!isEditable"
            :removeCloneOnHide="false"
            :group="{
              name: 'components',
              put: true
            }"
            handle=".handle"
            ghost-class="drag-ghost-component"
            :style="{flex: 1,'padding-bottom': (!$root.printMode && isUIClazz)? '100%':'2rem'}"
            @end="endDrag"
            @add="emitIsolatedUpdate()"
            @sort="emitIsolatedUpdate()"
          >
            <template #item="{element}">
              <div>
                <UIComponent @removethis="removeChildComponent(element)" @recompile="emitRecompile()" @isolatedupdate="emitIsolatedUpdate()" :component="element" is-editable @clickcomponent="forwardClick" @duplicate="clickDuplicate()" :selected-component="selectedComponent" @duplicate-child="duplicateSelectedChildComponent()"
                @deselect-component="deselectComponent()"/>
                <ConfirmPopup></ConfirmPopup>
              </div>
            </template>
          </draggable>
        </div>
        <div v-if="!isUIClazz" @click="handleClick" class="jpanel-bottom">&nbsp;</div>
      </div>
    </template>
    
  </div>
  
</template>

<script>
  import draggable from "vuedraggable";
  //import draggable from "vuedraggable/dist/vuedraggable.common";
  import { UIClazz } from "../classes/UIClazz";

  export default{
    props: {
      component: Object,
      selectedComponent: Object,
      isEditable: {
        type: Boolean,
        default: false
      },
      autoUpdate: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      containerDisplayType(){
        if(this.type==="UIClazz"){
          return this.customComponentName;
        }else{
          return this.type;
        }
      },
      uiClazzName(){
        let name=this.component.name;
        if(!name) return null;
        if(name.length>13){
          name=name.substring(0,10)+"...";
        }
        return name;
        
      },
      customComponentName(){
        if(this.component.type==="UIClazz"){
          let name=this.component.componentName;
          if(name.length>13){
            name=name.substring(0,10)+"...";
          }
          return name;
        }
        return null;
      },
      imageName(){
        let name=this.component.value;
        let pos=name.lastIndexOf("/");
        name=name.substring(pos+1);
        if(name.length>20){
          name=name.substring(0,17)+"...";
        }
        return name;
      },
      showActionCommand(){
        if(!this.component.actionCommand){
          return false;
        }else{
          return true;
        }
      },
      showName(){
        if(this.component instanceof UIClazz){
          return false;
        }
        if(!this.component.name){
          return false;
        }
        return true;
      },
      isUIClazz(){
        return this.component instanceof UIClazz;
      },
      type(){
        return this.component.type;
      },
      isContainer(){
        return this.type==="Canvas" || this.type==="JPanel" || this.type==="UIClazz" || this.component instanceof UIClazz || this.component.controlComponent;
      },
      label(){
        if(this.isEditable && this.component.name){
          return this.component.name+" ["+this.component.type+"]";
        }else{
          return this.component.type;
        }
      }
    },
    data(){
      return {
        hideContent: false
      }
    },
    methods: {
      getIndexOfChildComponent(comp){
        for(let i=0;i<this.component.components.length;i++){
          let c=this.component.components[i];
          if(comp===c){
            return i;
          }
        }
        return -1;
      },
      clickDuplicate(){
        this.$emit("duplicate-child");
      },
      clickDuplicateUIClazz(){
        this.$emit("duplicate-self");
      },
      clickRemoveUIClazz(event){
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Diese UI-Klasse löschen?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$emit("remove-self");
          },
          reject: () => {
              //callback to execute when user rejects the action
          }
        });
      },
      duplicateSelectedChildComponent(){
        console.log(this.selectedComponent);
        
        let index=this.getIndexOfChildComponent(this.selectedComponent);
        console.log(index);
        let copy=JSON.parse(JSON.stringify(this.selectedComponent));
        console.log(copy);
        this.component.components.splice(index+1,0,copy);
      },
      toggleHideContent(){
        this.hideContent=!this.hideContent;
      }, 
      removeChildComponent(comp){
        for(let i=0;i<this.component.components.length;i++){
          let c=this.component.components[i];
          if(c===comp){
            this.component.components.splice(i,1);
            this.deselectComponent();
            return true;
          }
        }
        return false;
      },
      handleClick(){
        this.$emit('clickcomponent',this.component);
      },
      deselectComponent(){
        console.log("deselect");
        this.$emit("deselect-component");
      },
      forwardClick(c){
        this.$emit('clickcomponent',c);
      },
      handleAdd(ev){
        this.emitIsolatedUpdate();
      },
      emitIsolatedUpdate(){
        console.log("isolatedUpdate");
        this.$emit('isolatedupdate');
      },
      emitRecompile(){
        console.log("recompile");
        this.$emit('recompile');
      },
      clickRemove(event) {
        this.$confirm.require({
          target: event.currentTarget,
          message: 'Diese UI-Komponente löschen?',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.$emit("removethis");
            this.emitRecompile();
          },
          reject: () => {
              //callback to execute when user rejects the action
          }
        });
      },
      endDrag(ev){
        window.drag=ev;
        let from=ev.from;
        while(from && from.className!=="ui-clazz"){
          from=from.parentElement;
        }
        let remove=false;
        if(from){
          let rect=from.getBoundingClientRect();
          let x=ev.originalEvent.clientX;
          let y=ev.originalEvent.clientY;
          if(x<rect.x || x>rect.x+rect.width || y<rect.y || y>rect.y+rect.height){
            remove=true;
          }
        }else{
          remove=true;
        }
        if(remove){
          let list=ev.from.__draggable_component__.realList;
          if(list){
            list.splice(ev.oldIndex,1);
            this.emitIsolatedUpdate();
          }
        }
      }
    },
    components: {
      draggable
    }
  }
</script>

<style scoped>
  .component{
    width: 100%;
    min-height: 1cm;
    max-height: 2cm;
    overflow: hidden;
  }
  .jimage{
    min-height: 1cm;
    line-height: 1cm;
  }
  .ui-class-top{
    height: 1cm;
  }
  .jlabel{
    border: 1pt dotted black;
  }
  .jhtml{
    border: 1pt dotted black;
    font-family: monospace;
  }
  .datatable{
    border: 1pt solid black;
  }
  .jpanel{
    border: 1pt solid black;
    width: 100%;
  }
  .jpanel-top,.jpanel-bottom{
    width: 100%;
    padding: 0.2rem;
  }
  .jpanel-top{
    line-height: 0.8cm;
  }
  .jpanel-bottom{
    min-height: 0.2cm;
    line-height: 0.2cm;
  }
  .jpanel-color,.jpanel-left,.jpanel-top,.jpanel-bottom{
    background-color: #DDD;
    color: black;
    cursor: pointer;
  }
  .jpanel-left{
    width: 0.3cm;
  }
  .datatable{
    width: 100%;
  }
  .handle{
    cursor: pointer;
    width: 1cm;
    height: 1cm;
    display: inline-block;
    line-height: 1cm;
    text-align: center;
    background-color: rgba(0,0,0,0);
  }
  .drag-ghost-component{
    opacity: 0.4;
    height: 0.5cm;
  }
</style>