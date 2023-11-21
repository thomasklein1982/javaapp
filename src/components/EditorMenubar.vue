<template>
  <Menubar :model="items" class="noprint">
    <template #start>
      <template v-if="isEasy">
        <span style="position: relative; white-space: nowrap;"><img alt="logo" src="/icon-white-transparent.png" style="height: 2rem" ><span v-if="isEasy" style="font-size: 60%; color: yellow; writing-mode: vertical-lr;">Easy!</span></span>
      </template>
      <template v-else>
        <img alt="logo" src="/icon-white-transparent.png" style="height: 2rem" >
      </template>
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
export default {
  props: {
    rightClosed: Boolean,
    isEasy: Boolean,
    allowTrash: Boolean,
    currentClazz: Object,
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
    items(){
      return [
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
              label: 'Details',
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
            {
              label: 'Ausführen (Vollbild)',
              icon: 'pi pi-fw pi-play',
              command: (ev)=>{
                this.$emit("fullscreen");
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
          label: "Extras",
          items: [
            {
              label: 'Links',
              icon: 'pi pi-star',
              command: (ev)=>{
                this.$emit("resources");
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