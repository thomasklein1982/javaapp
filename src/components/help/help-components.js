import about_whatis from "./about/what-is.vue";
  import about_development from "./about/development.vue";
  import about_modes from "./about/modes.vue";
  import assets_fonts from "./assets/fonts.vue";
  import assets_whatis from "./assets/what-is.vue";
  import assets_images from "./assets/images.vue";
  import assets_sounds from "./assets/sounds.vue";
  import ui_whatis from "./ui/what-is.vue";
  import ui_uiclasses from "./ui/ui-classes.vue";
  import ui_programming from "./ui/programming.vue";
  import about_lifecycle from "./about/life-cycle.vue";
  import datatypes_boolean from "./datatypes/boolean.vue";
  import datatypes_char from "./datatypes/char.vue";
  import datatypes_double from "./datatypes/double.vue";
  import datatypes_int from "./datatypes/int.vue";
  // import api_canvas from "./api/canvas.vue";
  // import api_datatable from "./api/datatable.vue";
  // import api_htmlelement from "./api/htmlelement.vue";
  // import api_jbutton from "./api/jbutton.vue";
  // import api_jcheckbox from "./api/jcheckbox.vue";
  // import api_jcombobox from "./api/jcombobox.vue";
  // import api_jcomponent from "./api/jcomponent.vue";
  // import api_jimage from "./api/jimage.vue";
  // import api_jlabel from "./api/jlabel.vue";
  // import api_jpanel from "./api/jpanel.vue";
  // import api_jtextarea from "./api/jtextarea.vue";
  // import api_jtextfield from "./api/jtextfield.vue";
  // import api_actionevent from "./api/actionevent.vue";
  // import api_arraylist from "./api/arraylist.vue";
  // import api_boolean from "./api/boolean.vue";
  // import api_char from "./api/char.vue";
  // import api_double from "./api/double.vue";
  // import api_exception from "./api/exception.vue";
  // import api_database from "./api/database.vue";
  // import api_file from "./api/file.vue";
  // import api_integer from "./api/integer.vue";
  // import api_inputstream from "./api/inputstream.vue";
  // import api_javaapp from "./api/javaapp.vue";
  // import api_json from "./api/json.vue";
  // import api_matcher from "./api/matcher.vue";
  // import api_math from "./api/math.vue";
  // import api_matrix from "./api/matrix.vue";
  // import api_object from "./api/object.vue";
  // import api_printstream from "./api/printstream.vue";
  // import api_pattern from "./api/pattern.vue";
  // import api_random from "./api/random.vue";
  // import api_record from "./api/record.vue";
  // import api_sound from "./api/sound.vue";
  // import api_string from "./api/string.vue";
  // import api_system from "./api/system.vue";
  // import api_vector from "./api/vector.vue";
  // import api_timer from "./api/timer.vue";
  import about_faq from "./about/faq.vue";
  import advanced_javascript from "./advanced/javascript.vue";

  let components={
    about: {
      label: "Über JavaApp",
      components: {
        whatis: {
          label: "Was ist JavaApp?",
          comp: about_whatis
        },
        development: {
          label: "Entwicklung",
          comp: about_development
        },
        modes: {
          label: "Easy - Normal - Hard",
          comp: about_modes
        },
        faq: {
          label: "FAQ",
          comp: about_faq
        },
        // lifecycle: {
        //   label: "Lebenszyklus",
        //   comp: about_lifecycle
        // },
      }
    },
    assets: {
      label: "Assets",
      components: {
        whatis: {
          label: "Was sind Assets?",
          comp: assets_whatis
        },
        images: {
          label: "Bilder",
          comp: assets_images
        },
        sounds: {
          label: "Sound und Musik",
          comp: assets_sounds
        },
        fonts: {
          label: "Schriftarten",
          comp: assets_fonts
        },
      }
    },
    datatypes: {
      label: "Primitive Datentypen",
      components: {
        boolean: {
          label: "boolean",
          comp: datatypes_boolean
        },
        char: {
          label: "char",
          comp: datatypes_char
        },
        double: {
          label: "double",
          comp: datatypes_double
        },
        int: {
          label: "int",
          comp: datatypes_int
        },
      }
    },
    api: {
      label: "JavaApp-Klassenbibliothek",
      // components: {
      //   actionevent: {
      //     label: "ActionEvent",
      //     comp: api_actionevent
      //   },
      //   arraylist: {
      //     label: "ArrayList",
      //     comp: api_arraylist
      //   },
      //   boolean: {
      //     label: "Boolean",
      //     comp: api_boolean
      //   },
      //   canvas: {
      //     label: "Canvas",
      //     comp: api_canvas,
      //   },
      //   char: {
      //     label: "Char",
      //     comp: api_char
      //   },
      //   database: {
      //     label: "Database",
      //     comp: api_database
      //   },
      //   datatable: {
      //     label: "DataTable",
      //     comp: api_datatable
      //   },
      //   double: {
      //     label: "Double",
      //     comp: api_double
      //   },
      //   exception: {
      //     label: "Exception",
      //     comp: api_exception
      //   },
      //   file: {
      //     label: "File",
      //     comp: api_file
      //   },
      //   htmlelement: {
      //     label: "HTMLElement",
      //     comp: api_htmlelement
      //   },
      //   inputstream: {
      //     label: "InputStream",
      //     comp: api_inputstream
      //   },
      //   integer: {
      //     label: "Integer",
      //     comp: api_integer
      //   },
      //   javaapp: {
      //     label: "JavaApp",
      //     comp: api_javaapp
      //   },
      //   jbutton: {
      //     label: "JButton",
      //     comp: api_jbutton
      //   },
      //   jcheckbox: {
      //     label: "JCheckBox",
      //     comp: api_jcheckbox
      //   },
      //   jcombobox: {
      //     label: "JComboBox",
      //     comp: api_jcombobox
      //   },
      //   jcomponent: {
      //     label: "JComponent",
      //     comp: api_jcomponent
      //   },
      //   jimage: {
      //     label: "JImage",
      //     comp: api_jimage
      //   },
      //   jlabel: {
      //     label: "JLabel",
      //     comp: api_jlabel
      //   },
      //   jpanel: {
      //     label: "JPanel",
      //     comp: api_jpanel
      //   },
      //   json: {
      //     label: "JSON",
      //     comp: api_json
      //   },
      //   jtextarea: {
      //     label: "JTextArea",
      //     comp: api_jtextarea
      //   },
      //   jtextfield: {
      //     label: "JTextField",
      //     comp: api_jtextfield
      //   },
      //   matcher: {
      //     label: "Matcher",
      //     comp: api_matcher
      //   },
      //   math: {
      //     label: "Math",
      //     comp: api_math
      //   },
      //   matrix: {
      //     label: "Matrix",
      //     comp: api_matrix
      //   },
      //   object: {
      //     label: "Object",
      //     comp: api_object
      //   },
      //   pattern: {
      //     label: "Pattern",
      //     comp: api_pattern
      //   },
      //   printstream: {
      //     label: "PrintStream",
      //     comp: api_printstream
      //   },
      //   random: {
      //     label: "Random",
      //     comp: api_random
      //   },
      //   record: {
      //     label: "Record",
      //     comp: api_record
      //   },
      //   sound: {
      //     label: "Sound",
      //     comp: api_sound
      //   },
      //   string: {
      //     label: "String",
      //     comp: api_string
      //   },
      //   system: {
      //     label: "System",
      //     comp: api_system
      //   },
      //   timer: {
      //     label: "Timer",
      //     comp: api_timer
      //   },
      //   vector: {
      //     label: "Vector",
      //     comp: api_vector
      //   },
      // }
    },
    advanced: {
      label: "Für Fortgeschrittene",
      components: {
        javascript: {
          label: "JavaScript",
          comp: advanced_javascript
        }
      }
    }
  }


  export default components;