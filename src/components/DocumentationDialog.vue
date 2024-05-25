<template>
  <Dialog header="JavaApp-Dokumentation" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <div :style="{display: 'flex'}" style="height: 100%">
      
        <div :style="{display: showSidebar? 'block':'none'}" style="height: 100%;  overflow-y: auto; overflow-x: hidden;" class="documentation-menu">
          <Menu ref="menu" :model="menuItems"/>
        </div>
      <div style="height: 100%; overflow:hidden; position: relative" :style="{flex: 1}">
        <div style="padding: 0.5rem; height: 100%;  overflow-y: auto; overflow-x: hidden;">
          <component :is="currentComponent"/>
        </div>
        <div @click="showSidebar=!showSidebar" :class="showSidebar? 'pi pi-angle-double-left':'pi pi-angle-double-right'" :style="{opacity: 0.7}" style="text-align: center; cursor: pointer; display: grid; align-items: center; background-color: rgb(255, 213, 79); border-bottom-right-radius:100%; border-top-right-radius:100%; position: absolute; top: calc(50% - 1rem); left: 0;width: 1.5rem; height: 2rem;"></div>
      </div>
    </div>
  </Dialog>
</template>
  
<script>
  import sidebar from "primevue/sidebar";
  import Menu from "primevue/menu";
  import help from "./help/help-components";

  let components={
    sidebar, Menu
  };
  for(let cat in help){
    for(let a in help[cat].components){
      components[cat+"_"+a]=help[cat].components[a].comp;
    }
  }
  console.log(components);

  export default {
    props: {
      project: Object
    },
    components: components,
    computed: {
      menuItems(){
        let menuItems=[];
        for(let cat in help){
          let category={label: help[cat].label};
          let items=[];
          for(let a in help[cat].components){
            let c=help[cat].components[a];
            let name=cat+"_"+a;
            let item={
              label: c.label,
              command: (e)=>{
                this.changeSite(name);
              }
            }
            items.push(item);
          }
          category.items=items;
          menuItems.push(category);
        }
        return menuItems;
      }
    },
    data(){
      return {
        show: false,
        currentComponent: "about_whatis",
        showSidebar: true,
        // menuItems: [
        //   {
        //     label: "Über Java-App",
        //     items: [
        //       {
        //         label: "Was ist Java-App?",
        //         command: (e)=>{
        //           this.changeSite("about_whatis");
        //         }
        //       },
        //       {
        //         label: "Wer entwickelt Java-App?",
        //         command: (e)=>{
        //           this.changeSite("about_development");
        //         }
        //       },
        //       {
        //         label: "Easy - Normal - Hard",
        //         command: (e)=>{
        //           this.changeSite("about_modes");
        //         }
        //       },
        //       {
        //         label: "Lebenszyklus einer JavaApp",
        //         command: (e)=>{
        //           this.changeSite("about_lifecycle");
        //         }
        //       },
        //     ]
        //   },
        //   {
        //     label: "Konsolen-Programme",
        //     items: [
        //       {
        //         label: "Ausgabe"
        //       },
        //       {
        //         label: "Eingabe"
        //       },
        //       {
        //         label: "Programm-Loop"
        //       }
        //     ]
        //   },
        //   {
        //     label: "Grafische Oberflächen (UI)",
        //     items: [
        //       {
        //         label: "Was ist eine grafische Oberfläche?",
        //         command: (e)=>{
        //           this.changeSite("ui_whatis");
        //         }
        //       },
        //       {
        //         label: "UI-Klassen",
        //         command: (e)=>{
        //           this.changeSite("ui_uiclasses");
        //         }
        //       },
        //       {
        //         label: "Erzeugen von UI-Komponenten im Code",
        //         command: (e)=>{
        //           this.changeSite("ui_programming");
        //         }
        //       }
        //     ]
        //   },
        //   {
        //     label: "Der Canvas",
        //     items: [
        //       {
        //         label: "Was ist ein Canvas?"
        //       },
        //       {
        //         label: "Koordinaten"
        //       },
        //       {
        //         label: "Zeichnen"
        //       },
        //       {
        //         label: "Die Canvas-Klasse"
        //       },
        //       {
        //         label: "Beispiel"
        //       },
        //     ]
        //   },
        //   {
        //     label: "Assets",
        //     items: [
        //       {
        //         label: "Was sind Assets?",
        //         command: (e)=>{
        //           this.changeSite("assets_whatis");
        //         }
        //       },
        //       {
        //         label: "Bilder",
        //         command: (e)=>{
        //           this.changeSite("assets_images");
        //         }
        //       },
        //       {
        //         label: "Sound und Musik",
        //         command: (e)=>{
        //           this.changeSite("assets_sounds");
        //         }
        //       },
        //       {
        //         label: "Schriftarten",
        //         command: (e)=>{
        //           this.changeSite("assets_fonts");
        //         }
        //       },
        //     ]
        //   },
        //   {
        //     label: "Das Gamepad",
        //     items: [
        //       {
        //         label: "Erzeugen eines Gamepads"
        //       },
        //       {
        //         label: "Modifizieren des Gamepads"
        //       },
        //       {
        //         label: "Mehrere Gamepads"
        //       },
        //       {
        //         label: "Beispiel"
        //       },
        //     ]
        //   },
        //   {
        //     label: "Echtzeit und Timer",
        //     items: [
        //       {
        //         label: "Die Game-Loop"
        //       },
        //       {
        //         label: "Die Timer-Klasse"
        //       },
        //       {
        //         label: "Beispiel"
        //       },
        //     ]
        //   },
        //   {
        //     label: "Datenbanken",
        //     items: [
        //       {
        //         label: "Erstellen einer Datenbank"
        //       },
        //       {
        //         label: "Die Database-Klasse"
        //       },
        //       {
        //         label: "Die Record-Klasse"
        //       },
        //       {
        //         label: "Beispiele"
        //       },
        //     ]
        //   },
        //   {
        //     label: "JavaApp-Klassenbibliothek",
        //     items: [
        //       {
        //         label: "ActionEvent"
        //       },  
        //       {
        //         label: "ArrayList"
        //       },
        //       {
        //         label: "Boolean"
        //       },
        //       {
        //         label: "Canvas"
        //       },
        //       {
        //         label: "Char"
        //       },
        //       {
        //         label: "Database"
        //       },
        //       {
        //         label: "DataTable"
        //       },
        //       {
        //         label: "Double"
        //       },
        //       {
        //         label: "Exception"
        //       },
        //       {
        //         label: "File"
        //       },
        //       {
        //         label: "Gamepad"
        //       },
        //       {
        //         label: "HTMLElement"
        //       },
        //       {
        //         label: "Integer"
        //       },
        //       {
        //         label: "JavaApp"
        //       },
        //       {
        //         label: "JComponent"
        //       },
        //       {
        //         label: "JLabel"
        //       },
        //       {
        //         label: "JButton"
        //       },
        //       {
        //         label: "JTextField"
        //       },
        //       {
        //         label: "JTextArea"
        //       },
        //       {
        //         label: "JCheckBox"
        //       },
        //       {
        //         label: "JComboBox"
        //       },
        //       {
        //         label: "JImage"
        //       },
        //       {
        //         label: "JPanel"
        //       },
        //       {
        //         label: "JSON"
        //       },
        //       {
        //         label: "Matcher"
        //       },
        //       {
        //         label: "Math"
        //       },
        //       {
        //         label: "Matrix"
        //       },
        //       {
        //         label: "Object"
        //       },
        //       {
        //         label: "Pattern"
        //       },
        //       {
        //         label: "Random"
        //       },
        //       {
        //         label: "Record"
        //       },
        //       {
        //         label: "Sound"
        //       },
        //       {
        //         label: "String"
        //       },
        //       {
        //         label: "System"
        //       },
        //       {
        //         label: "Vector"
        //       },
        //     ]
        //   },
        // ]
      };
    },
    methods: {
      setVisible(v){
        this.show=v;
      },
      changeSite(name){
        console.log("changeSite",name);
        this.currentComponent=name;
      }
    }
  }
  </script>