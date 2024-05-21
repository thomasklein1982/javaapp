<template>
  <Dialog header="JavaApp-Dokumentation" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <div :style="{display: 'flex'}" style="height: 100%">
      <div style="height: 100%; overflow-y: auto; overflow-x: hidden;" class="documentation-menu">
        <Menu :model="menuItems"/>
      </div>
      <div style="padding: 0.5rem; height: 100%; overflow-y: auto;" :style="{flex: 1}">
        <component :is="currentComponent"/>
      </div>
    </div>
  </Dialog>
</template>
  
<script>
  import sidebar from "primevue/sidebar";
  import Menu from "primevue/menu";
  import About_WhatIs from "./help/about/what-is.vue";
  import About_Development from "./help/about/development.vue";
  import About_Modes from "./help/about/modes.vue";
  import Assets_Fonts from "./help/assets/fonts.vue";
  import Assets_WhatIs from "./help/assets/what-is.vue";
  import Assets_Images from "./help/assets/images.vue";
  import Assets_Sounds from "./help/assets/sounds.vue";
  import UI_WhatIs from "./help/ui/what-is.vue";
  import UI_UIClasses from "./help/ui/ui-classes.vue";
  import UI_Programming from "./help/ui/programming.vue";
  import About_LifeCycle from "./help/about/life-cycle.vue";

  export default {
    props: {
      project: Object
    },
    components: {
      sidebar, Menu, About_Development, About_Modes, About_WhatIs, Assets_Fonts, Assets_Images, Assets_Sounds, Assets_WhatIs, UI_Programming, UI_UIClasses, UI_WhatIs, About_LifeCycle
    },
    data(){
      return {
        show: false,
        currentComponent: "About_WhatIs",
        showSidebar: true,
        menuItems: [
          {
            label: "Über Java-App",
            items: [
              {
                label: "Was ist Java-App?",
                command: (e)=>{
                  this.changeSite("About_WhatIs");
                }
              },
              {
                label: "Wer entwickelt Java-App?",
                command: (e)=>{
                  this.changeSite("About_Development");
                }
              },
              {
                label: "Easy - Normal - Hard",
                command: (e)=>{
                  this.changeSite("About_Modes");
                }
              },
              {
                label: "Lebenszyklus einer JavaApp",
                command: (e)=>{
                  this.changeSite("About_LifeCycle");
                }
              },
            ]
          },
          {
            label: "Konsolen-Programme",
            items: [
              {
                label: "Ausgabe"
              },
              {
                label: "Eingabe"
              },
              {
                label: "Programm-Loop"
              }
            ]
          },
          {
            label: "Grafische Oberflächen (UI)",
            items: [
              {
                label: "Was ist eine grafische Oberfläche?",
                command: (e)=>{
                  this.changeSite("UI_WhatIs");
                }
              },
              {
                label: "UI-Klassen",
                command: (e)=>{
                  this.changeSite("UI_UIClasses");
                }
              },
              {
                label: "Erzeugen von UI-Komponenten im Code",
                command: (e)=>{
                  this.changeSite("UI_Programming");
                }
              }
            ]
          },
          {
            label: "UI-Komponenten",
            items: [
              {
                label: "JComponent"
              },
              {
                label: "HTMLElement"
              },
              {
                label: "JLabel"
              },
              {
                label: "JButton"
              },
              {
                label: "JTextField"
              },
              {
                label: "JTextArea"
              },
              {
                label: "JCheckBox"
              },
              {
                label: "JComboBox"
              },
              {
                label: "JImage"
              },
              {
                label: "JPanel"
              },
              {
                label: "Canvas"
              },
              {
                label: "DataTable"
              }
            ]
          },
          {
            label: "Der Canvas",
            items: [
              {
                label: "Was ist ein Canvas?"
              },
              {
                label: "Koordinaten"
              },
              {
                label: "Zeichnen"
              },
              {
                label: "Die Canvas-Klasse"
              },
              {
                label: "Beispiel"
              },
            ]
          },
          {
            label: "Assets",
            items: [
              {
                label: "Was sind Assets?",
                command: (e)=>{
                  this.changeSite("Assets_WhatIs");
                }
              },
              {
                label: "Bilder",
                command: (e)=>{
                  this.changeSite("Assets_Images");
                }
              },
              {
                label: "Sound und Musik",
                command: (e)=>{
                  this.changeSite("Assets_Sounds");
                }
              },
              {
                label: "Schriftarten",
                command: (e)=>{
                  this.changeSite("Assets_Fonts");
                }
              },
            ]
          },
          {
            label: "Das Gamepad",
            items: [
              {
                label: "Erzeugen eines Gamepads"
              },
              {
                label: "Modifizieren des Gamepads"
              },
              {
                label: "Mehrere Gamepads"
              },
              {
                label: "Beispiel"
              },
            ]
          },
          {
            label: "Echtzeit und Timer",
            items: [
              {
                label: "Die Game-Loop"
              },
              {
                label: "Die Timer-Klasse"
              },
              {
                label: "Beispiel"
              },
            ]
          },
          {
            label: "Datenbanken",
            items: [
              {
                label: "Erstellen einer Datenbank"
              },
              {
                label: "Die Database-Klasse"
              },
              {
                label: "Die Record-Klasse"
              },
              {
                label: "Beispiele"
              },
            ]
          },
          {
            label: "JavaApp-Klassenbibliothek",
            items: [
              {
                label: "ActionEvent"
              },  
              {
                label: "ArrayList"
              },
              {
                label: "Boolean"
              },
              {
                label: "Char"
              },
              {
                label: "Double"
              },
              {
                label: "Exception"
              },
              {
                label: "File"
              },
              {
                label: "Integer"
              },
              {
                label: "JavaApp"
              },
              {
                label: "JSON"
              },
              {
                label: "Matcher"
              },
              {
                label: "Math"
              },
              {
                label: "Matrix"
              },
              {
                label: "Object"
              },
              {
                label: "Pattern"
              },
              {
                label: "Random"
              },
              {
                label: "Sound"
              },
              {
                label: "String"
              },
              {
                label: "System"
              },
              {
                label: "Vector"
              },
            ]
          },
        ]
      };
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      changeSite(name){
        this.currentComponent=name;
      }
    }
  }
  </script>