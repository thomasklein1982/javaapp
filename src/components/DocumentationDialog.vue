<template>
  <Dialog header="JavaApp-Dokumentation" v-model:visible="show" :modal="true" class="p-dialog-maximized">
    <div :style="{display: 'flex'}" style="height: 100%">
      <div style="height: 100%; overflow-y: auto; overflow-x: hidden;" class="documentation-menu">
        <Menu ref="menu" :model="menuItems"/>
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
  import about_whatis from "./help/about/what-is.vue";
  import about_development from "./help/about/development.vue";
  import about_modes from "./help/about/modes.vue";
  import assets_fonts from "./help/assets/fonts.vue";
  import assets_whatis from "./help/assets/what-is.vue";
  import assets_images from "./help/assets/images.vue";
  import assets_sounds from "./help/assets/sounds.vue";
  import ui_whatis from "./help/ui/what-is.vue";
  import ui_uiclasses from "./help/ui/ui-classes.vue";
  import ui_programming from "./help/ui/programming.vue";
  import about_lifecycle from "./help/about/life-cycle.vue";
  import api_canvas from "./help/api/canvas.vue";
  import api_datatable from "./help/api/datatable.vue";
  import api_htmlelement from "./help/api/htmlelement.vue";
  import api_jbutton from "./help/api/jbutton.vue";
  import api_jcheckbox from "./help/api/jcheckbox.vue";
  import api_jcombobox from "./help/api/jcombobox.vue";
  import api_jcomponent from "./help/api/jcomponent.vue";
  import api_jimage from "./help/api/jimage.vue";
  import api_jlabel from "./help/api/jlabel.vue";
  import api_jpanel from "./help/api/jpanel.vue";
  import api_jtextarea from "./help/api/jtextarea.vue";
  import api_jtextfield from "./help/api/jtextfield.vue";
  import api_actionevent from "./help/api/actionevent.vue";
  import api_arraylist from "./help/api/arraylist.vue";
  import api_boolean from "./help/api/boolean.vue";
  import api_char from "./help/api/char.vue";
  import api_double from "./help/api/double.vue";
  import api_exception from "./help/api/exception.vue";
  import api_file from "./help/api/file.vue";
  import api_integer from "./help/api/integer.vue";
  import api_javaapp from "./help/api/javaapp.vue";
  import api_json from "./help/api/json.vue";
  import api_matcher from "./help/api/matcher.vue";
  import api_math from "./help/api/math.vue";
  import api_matrix from "./help/api/matrix.vue";
  import api_object from "./help/api/object.vue";
  import api_pattern from "./help/api/pattern.vue";
  import api_random from "./help/api/random.vue";
  import api_sound from "./help/api/sound.vue";
  import api_string from "./help/api/string.vue";
  import api_system from "./help/api/system.vue";
  import api_vector from "./help/api/vector.vue";
  import api_timer from "./help/api/timer.vue";

  export default {
    props: {
      project: Object
    },
    components: {
      sidebar, Menu, about_development, about_modes, about_whatis, assets_fonts, assets_images, assets_sounds, assets_whatis, ui_programming, ui_uiclasses, ui_whatis, about_lifecycle, api_canvas, api_datatable, api_htmlelement, api_jbutton, api_jcheckbox, api_jcombobox, api_jcomponent, api_jimage, api_jlabel, api_jpanel, api_jtextarea, api_jtextfield, api_actionevent, api_arraylist, api_boolean, api_char, api_double, api_exception, api_file, api_integer, api_javaapp, api_json, api_matcher, api_math, api_matrix, api_object, api_pattern, api_random, api_sound, api_string, api_system, api_vector, api_timer
    },
    data(){
      return {
        show: false,
        currentComponent: "about_whatis",
        showSidebar: true,
        menuItems: [
          {
            label: "Über Java-App",
            items: [
              {
                label: "Was ist Java-App?",
                command: (e)=>{
                  this.changeSite("about_whatis");
                }
              },
              {
                label: "Wer entwickelt Java-App?",
                command: (e)=>{
                  this.changeSite("about_development");
                }
              },
              {
                label: "Easy - Normal - Hard",
                command: (e)=>{
                  this.changeSite("about_modes");
                }
              },
              {
                label: "Lebenszyklus einer JavaApp",
                command: (e)=>{
                  this.changeSite("about_lifecycle");
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
                  this.changeSite("ui_whatis");
                }
              },
              {
                label: "UI-Klassen",
                command: (e)=>{
                  this.changeSite("ui_uiclasses");
                }
              },
              {
                label: "Erzeugen von UI-Komponenten im Code",
                command: (e)=>{
                  this.changeSite("ui_programming");
                }
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
                  this.changeSite("assets_whatis");
                }
              },
              {
                label: "Bilder",
                command: (e)=>{
                  this.changeSite("assets_images");
                }
              },
              {
                label: "Sound und Musik",
                command: (e)=>{
                  this.changeSite("assets_sounds");
                }
              },
              {
                label: "Schriftarten",
                command: (e)=>{
                  this.changeSite("assets_fonts");
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
                label: "Canvas"
              },
              {
                label: "Char"
              },
              {
                label: "Database"
              },
              {
                label: "DataTable"
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
                label: "Gamepad"
              },
              {
                label: "HTMLElement"
              },
              {
                label: "Integer"
              },
              {
                label: "JavaApp"
              },
              {
                label: "JComponent"
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
                label: "Record"
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