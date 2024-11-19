<template>
  <Menubar :model="items" class="noprint">
    <template #start>
      <template v-if="isEasy">
        <span style="position: relative; white-space: nowrap;"><img alt="logo" src="/icon-white-transparent.png" style="height: 2rem" ><span style="font-size: 60%; color: yellow; writing-mode: vertical-lr;">Easy!</span></span>
      </template>
      <template v-else-if="isNormal">
        <img alt="logo" src="/icon-white-transparent.png" style="height: 2rem" >
      </template>
      <template v-else>
        <span style="position: relative; white-space: nowrap;"><img alt="logo" src="/icon-white-transparent.png" style="height: 2rem" ><span style="font-size: 60%; color: red; writing-mode: vertical-lr;">Hard!</span></span>
      </template>
    </template>
    <template #item="{ item, props, hasSubmenu, root }">
      <a class="flex items-center" v-bind="props.action">
        <div style="width: 100%; height: 100%" @click.stop="" v-if="item.file">
          <input :disabled="item.file===currentClazz" type="checkbox" @click.stop="" v-model="item.file.isEditorShown"/>
          <span class="p-menubar-item-label">{{ item.label }}</span>
        </div>
        <template v-else>
          <span :class="item.icon+' p-menubar-item-icon'"/>
          <span class="p-menubar-item-label">{{ item.label }}</span>
          <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
        </template>
      </a>
    </template>
    <template #end>
      <template v-if="currentClazz && !currentClazz.isUIClazz()">
        <badge style="margin-right: 0.5rem" v-if="caretPosition>=0">Pos: {{ caretPosition }}</badge>
        <Button severity="secondary" rounded size="small" style="margin-right: 0.5rem" label="" icon="pi pi-undo" @click="$emit('undo')"/>
        <Button severity="secondary" rounded size="small" style="margin-right: 0.5rem" label="" icon="pi pi-refresh" @click="$emit('redo')"/>
      </template>
      <Button severity="secondary" rounded size="small" style="margin-right: 0.5rem" label="" :icon="rightClosed? 'pi pi-eye-slash': 'pi pi-eye'" @click="$emit('toggleright')"/>
    </template>
  </Menubar>  
</template>

<script>
import { Checkbox } from 'primevue';

export default {
  components: {
    Checkbox
  },
  props: {
    rightClosed: Boolean,
    difficulty: Number,
    allowTrash: Boolean,
    currentClazz: Object,
    project: Object,
    caretPosition: {
      type: Number,
      default: -1
    }
  },
  data(){
    return {
      
    };
  },
  computed: {
    isEasy(){
      return this.difficulty===0;
    },
    isNormal(){
      return this.difficulty===1;
    },
    isHard(){
      return this.difficulty===2;
    },
    items(){
      let items= [
        {
          label: 'Projekt',
          items: [
            {
              label: 'Neu',
              icon: 'pi pi-file',
              command: (ev)=>{
                this.$emit('new');
              }
            },
            {
              label: 'Hochladen',
              icon: 'pi pi-upload',
              command: (ev)=>{
                this.$emit('upload');
              }
            },
            {
              label: 'Herunterladen',
              icon: 'pi pi-download',
              command: (ev)=>{
                this.$emit('download');
              }
            },
            {
              separator:true
            },
            {
              label: 'App-Details',
              icon: 'pi pi-ellipsis-v',
              command: (ev)=>{
                this.$emit('details');
              }
            },
            {
              label: 'CSS',
              icon: 'pi pi-palette',
              command: (ev)=>{
                this.$emit('css');
              }
            },
            {
              label: 'Assets',
              icon: 'pi pi-images',
              command: (ev)=>{
                this.$emit('assets');
              }
            },
            {
              label: 'Datenbank',
              icon: 'pi pi-database',
              command: (ev)=>{
                this.$emit('database');
              }
            },
            {
              separator:true
            },
            {
              label: 'Drucken',
              icon: 'pi pi-print',
              command: (ev)=>{
                this.$emit('print');
              }
            },
            {
              label: 'Kompilieren',
              icon: 'pi pi-forward',
              command: (ev)=>{
                this.$emit("compile");
              }
            },
          ]
        },
        {
          label: 'Aktion',
          items: [
            {
              label: 'Ausführen',
              icon: 'pi pi-fw pi-play',
              command: (ev)=>{
                this.$emit("play");
              }
            },
            // {
            //   label: 'Ausführen (Vollbild)',
            //   icon: 'pi pi-fw pi-play',
            //   command: (ev)=>{
            //     this.$emit("fullscreen");
            //   }
            // },
            {
              label: 'Ausführen (eigenes Fenster)',
              icon: 'pi pi-fw pi-play',
              command: (ev)=>{
                this.$emit("play-window");
              }
            },
            {
              label: 'Ausführen (mit DEV-Tools)',
              icon: 'pi pi-fw pi-play',
              command: (ev)=>{
                this.$emit("play-dev");
              }
            },
            {
              label: 'Formatieren',
              icon: 'pi pi-fw pi-align-left',
              command: (ev)=>{
                this.$emit("prettify");
              }
            },
            {
              label: 'Kommentar umschalten',
              icon: 'pi pi-fw pi-comment',
              command: (ev)=>{
                this.$emit("toggle-comment");
              }
            },
            {
              label: 'Suchen/Ersetzen',
              icon: 'pi pi-fw pi-search',
              command: (ev)=>{
                this.$emit("search");
              }
            },
            {
              label: 'Fehler anzeigen',
              icon: 'pi pi-fw pi-exclamation-circle',
              command: (ev)=>{
                this.$emit("lint");
              }
            },
            {
              label: 'Löschen',
              icon: 'pi pi-fw pi-trash',
              disabled: !this.allowTrash,
              command: (ev)=>{
                this.$emit("trash");
              }
            }
            // {
            //   label: 'Umbenennen',
            //   icon: 'pi pi-fw pi-pencil',
            //   command: (ev)=>{
            //     this.$emit("rename");
            //   }
            // }
          ]
        },
        {
          label: "Workspace",
          items: []
        },
        {
          label: "Extras",
          items: [
          {
              label: 'Hilfe',
              icon: 'pi pi-question-circle',
              command: (ev)=>{
                this.$emit("help");
              }
            },
            {
              label: 'Links',
              icon: 'pi pi-star',
              command: (ev)=>{
                this.$emit("resources");
              }
            },
            {
              label: 'Terminal',
              icon: 'pi pi-hashtag',
              command: (ev)=>{
                this.$emit("terminal");
              }
            },
            {
              label: 'Einstellungen',
              icon: 'pi pi-cog',
              command: (ev)=>{
                this.$emit("settings");
              }
            }
          ]
        }
      ];
      if(this.project){
        let workspace=items[items.length-2];
        for(let i=0;i<this.project.clazzes.length;i++){
          let c=this.project.clazzes[i];
          workspace.items.push({
            label: c.name,
            file: c,
            
          });
        }
      }
      if(this.$root.tryItMode){
        items[0].label="TryIt: "+this.$root.tryItName;
        items[0].items[0]={
          label: "TryIt!",
          command: (ev)=>{
            this.$emit("tryit");
          }
        }
        items[0].items[1].disabled=true;
      }
      return items;
    }
  },
  methods: {
    updateItems(){
    } 
  }
}
</script>

<style scoped>

</style>