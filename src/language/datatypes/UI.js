import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineUIClazzes(Java){
  defineJComponent(Java.datatypes.JComponent,Java);
  defineJTextComponent(Java.datatypes.JTextComponent,Java);
  defineJButton(Java.datatypes.JButton,Java);
  defineJImage(Java.datatypes.JImage,Java);
  defineJLabel(Java.datatypes.JLabel,Java);
  defineJTextArea(Java.datatypes.JTextArea,Java);
  defineJTextField(Java.datatypes.JTextField,Java);
  defineJCheckBox(Java.datatypes.JCheckBox,Java);
  defineJComboBox(Java.datatypes.JComboBox,Java);
  defineDataTable(Java.datatypes.DataTable,Java);
  defineJPanel(Java.datatypes.JPanel,Java);
  defineCanvas(Java.datatypes.Canvas,Java);
  defineJFrame(Java.datatypes.JFrame,Java);
}

function defineJComponent(Clazz,Java){
  
  createAttribute({
    name: "actionCommand",
    type: Java.datatypes.String,
    info: 'Jede Komponente kann ein ActionCommand erhalten. Dieses kann man verwenden, um festzulegen, was passieren soll, wenn mit der Komponente interagiert wird.'
  },Clazz,false);
  createMethod({
    name: 'setValue',
    args: [
      {name: 'v', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'addEventListener',
    args: [
      {name: 'event', type: 'String', info: 'Art des Events, z. B. "click" oder "change".'},
      {name: 'listener', default: '(ev)->{}', type: 'ActionListener'}
    ],
    info: "Fügt einen EventListener hinzu, der aufgerufen wird, wenn man mit der Komponente interagiert."
  },Clazz,false,false);
  // setCSSClass(className){
  //   this.$el.className=className;
  // }
  // getCSSClass(){
  //   return this.$el.className;
  // }
  // toggleCSSClass(className){
  //   this.$el.classList.toggle(className);
  // }
  // addCSSClass(className){
  //   this.$el.classList.add(className);
  // }
  // removeCSSClass(className){
  //   this.$el.classList.remove(className);
  // }
  createMethod({
    name: 'addActionListener',
    args: [
      {name: "listener", default: '(ev)->{}', type: 'ActionListener'}
    ],
    info: "Fügt einen ActionListener hinzu, der aufgerufen wird, wenn man mit der Komponente interagiert."
  },Clazz,false,false);
  createMethod({
    name: 'getElementById',
    args: [
      {name: 'id', type: 'String'}
    ],
    returnType: "HTMLElement",
    info: "Liefert das HTMLElement mit der angegebenen ID zurück."
  },Clazz,false,false);
  // createMethod({
  //   name: 'setOnAction',
  //   args: [
  //     {name: 'handler', type: 'ActionListener'}
  //   ],
  //   info: "Legt fest, welches Objekt bei einer Aktion die onAction-Methode ausführen soll."
  // },Clazz,false,false);
  createMethod({
    name: 'setCSSClass',
    args: [
      {name: 'className', type: 'String'}
    ],
    info: "Legt die CSS-Klassen der Komponente fest."
  },Clazz,false,false);
  createMethod({
    name: 'hasCSSClass',
    args: [
      {name: 'className', type: 'String'}
    ],
    info: "Prüft, ob die Komponente diese CSS-Klasse besitzt.",
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'getCSSClass',
    args: [],
    returnType: "String",
    info: "Liefert einen String mit allen CSS-Klassen der Komponente zurück."
  },Clazz,false,false);
  createMethod({
    name: 'querySelector',
    args: [
      {
        name: "selector", type: "String", info: "gültiger CSS-Selektor"
      }
    ],
    returnType: "JComponent",
    info: "Liefert das erste Kind-Element in dieser Komponente, das den CSS-Selektor erfüllt."
  },Clazz,false,false);
  createMethod({
    name: 'querySelectorAll',
    args: [
      {
        name: "selector", type: "String", info: "gültiger CSS-Selektor"
      }
    ],
    returnType: {baseType: "JComponent", dimension: 1},
    info: "Liefert ein Array aller Kind-Elemente in dieser Komponente, die den CSS-Selektor erfüllen."
  },Clazz,false,false);
  createMethod({
    name: 'toggleCSSClass',
    args: [
      {name: 'className', type: 'String'}
    ],
    returnType: "boolean",
    info: "Falls die Komponente die Klasse besitzt: Klasse wird entfernt, false wird zurückgeben.\nAnsonsten: Klasse wird hinzugefügt, true wird zurückgegeben."
  },Clazz,false,false);
  createMethod({
    name: 'addCSSClass',
    args: [
      {name: 'className', type: 'String'}
    ],
    info: "Fügt der Komponente die CSS-Klasse hinzu."
  },Clazz,false,false);
  createMethod({
    name: 'removeCSSClass',
    args: [
      {name: 'className', type: 'String'}
    ],
    info: "Entfernt die CSS-Klasse von der Komponente."
  },Clazz,false,false);
  createMethod({
    name: 'collides',
    args: [
      {name: 'comp', type: 'JComponent'}
    ],
    returnType: 'boolean'
  },Clazz,false,false);
  createMethod({
    name: 'getScrollPosition',
    args: [],
    returnType: 'int'
  },Clazz,false,false);
  createMethod({
    name: 'setScrollPosition',
    args: [{name: 'pos', type: 'int'}]
  },Clazz,false,false);
  createMethod({
    name: 'show',
    args: [
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'hide',
    args: [
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'focus',
    args: []
  },Clazz,false,false,Java);
  createMethod({
    name: 'setVisible',
    args: [
      {name: 'v', type: 'boolean'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setTriggerOnAction',
    args: [
      {name: 't', type: 'boolean'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setTriggerOnMouseDown',
    args: [
      {name: 't', type: 'boolean'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setTriggerOnMouseUp',
    args: [
      {name: 't', type: 'boolean'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'getValue',
    returnType: 'String'
  },Clazz,false,false,Java);
  createMethod({
    name: 'isVisible',
    returnType: 'boolean'
  },Clazz,false,false,Java);
  createMethod({
    name: 'changeX',
    args: [
      {name: 'dx', type: 'double'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'changeY',
    args: [
      {name: 'dy', type: 'double'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'changeWidth',
    args: [
      {name: 'dw', type: 'double'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'changeHeight',
    args: [
      {name: 'dh', type: 'double'}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setX',
    args: [
      {name: 'v', type: 'double'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setY',
    args: [
      {name: 'v', type: 'double'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setWidth',
    args: [
      {name: 'v', type: 'double'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setHeight',
    args: [
      {name: 'v', type: 'double'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setBounds',
    args: [
      {name: 'x', type: 'double'},
      {name: 'y', type: 'double'},
      {name: 'width', type: 'double'},
      {name: 'height', type: 'double'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'getX',
    returnType: 'double'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getY',
    returnType: 'double'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getWidth',
    returnType: 'double'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getHeight',
    returnType: 'double'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getPixelWidth',
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getPixelHeight',
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setStyle',
    args: [
      {name: 'key', type: 'String'},
      {name: 'value', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'getStyle',
    returnType: 'String',
    args: [
      {name: 'key', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setAlign',
    args: [
      {name: 'align', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setAlignContent',
    args: [
      {name: 'align', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setEnabled',
    args: [
      {name: 'e', type: 'boolean', default: 'false', info: 'true: Komponente ist aktiviert, false: Komponente ist deaktiviert.'}
    ],
    info: "Aktiviert bzw. deaktiviert die Komponente. Eine deaktivierte Komponente kann vom User nicht verwendet werden, wird aber weiterhin angezeigt."
  },Clazz,false,false,Java);
  createMethod({
    name: 'isEnabled',
    returnType: 'boolean'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getIndex',
    info: 'Liefert den Index dieser Komponente innerhalb ihres Containers zurück. Der Index beginnt bei 0.',
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getRow',
    info: 'Liefert den Zeilen-Index dieser Komponente innerhalb ihres Containers zurück. Der Index beginnt bei 0.',
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getColumn',
    info: 'Liefert den Spalten-Index dieser Komponente innerhalb ihres Containers zurück. Der Index beginnt bei 0.',
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getPanel',
    info: 'Liefert das Panel zurück, in dem sich diese Komponente befindet.',
    returnType: 'JPanel'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getActionCommand',
    args: [
    ],
    info: "Liefert den ActionCommand-String der Komponente zurück.",
    returnType: 'String'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setActionCommand',
    args: [
      {name: 'actionCommand', type: 'String', info: 'Der neue ActionCommand-String der Komponente.'}
    ],
    info: "Legt den ActionCommand-String der Komponente fest."
  },Clazz,false,false,Java);
  createMethod({
    name: 'getActionObject',
    args: [
    ],
    info: "Liefert das ActionObject der Komponente zurück.",
    returnType: 'Object'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setActionObject',
    args: [
      {name: 'actionObject', type: 'Object', info: 'Das neue ActionObject der Komponente.'}
    ],
    info: "Legt das ActionObject der Komponente fest."
  },Clazz,false,false,Java);
  createMethod({
    name: 'setCSS',
    args: [
      {name: 'cssRules', type: 'String'}
    ]
  },Clazz,false,false,Java);
  
  // createAttribute({
  //   name: "value",
  //   type: Java.datatypes.String,
  // },Clazz,false,Java);
  // createAttribute({
  //   name: "visible",
  //   type: Java.datatypes.boolean,
  // },Clazz,false,Java);
}

function defineJFrame(Clazz,Java){
  Clazz.superClazz=Java.datatypes.JPanel;
  createConstructor ({
    args: [
      {type: {baseType: 'String', dimension: 0}, name: 'template', optional: true}
    ]
  },Clazz,Java);
  // createMethod({
  //   name: 'setLayout',
  //   args: [
  //     {name: 'layout', type: 'String', info: 'Das neue Layout des Panels.'}
  //   ],
  //   info: 'Legt das Layout für das Panel fest.'
  // },Clazz,false,false,Java);
  // createMethod({
  //   name: 'setVisible',
  //   args: [
  //     {name: 'v', type: 'boolean', info: 'Legt fest, ob das Fenster sichtbar oder unsichtbar ist.'}
  //   ],
  //   info: "Macht das Fenster sichtbar oder unsichtbar."
  // },Clazz,false,false,Java);

  // createMethod({
  //   name: 'add',
  //   args: [
  //     {name: 'component', type: 'JComponent', info: 'Die Komponente, die hinzugefügt werden soll.'}
  //   ],
  //   info: 'Fügt dem Frame eine (weitere) Komponente hinzu.'
  // },Clazz,false,false,Java);
  // createMethod({
  //   name: 'remove',
  //   args: [
  //     {name: 'component', type: 'JComponent', info: 'Die Komponente, die entfernt werden soll.'}
  //   ],
  //   info: 'Entfernt die Komponente aus dem Frame, falls möglich.'
  // },Clazz,false,false,Java);
  // createMethod({
  //   name: 'removeAll',
  //   info: 'Entfernt alle Komponenten aus dem Frame.'
  // },Clazz,false,false,Java);
}

function defineJButton(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'label', optional: true, showAtCompletion: true}//, {type: 'double', name: 'x', optional: true}, {type: 'double', name: 'y'}, {type: 'double', name: 'width'}, {type: 'double', name: 'height'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineJImage(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'url'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  createMethod({
    name: 'setZoom',
    args: [
      {name: 'factor', default: '100%', type: 'String', info: 'Zoom-Faktor (1 = 100%)'}
    ],
    info: 'Legt den Zoomfaktor des Bildes fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setImageTranslationX',
    args: [
      {name: 'dx', default: '"0%"', type: 'String', info: 'Verschiebung des Bildes nach rechts/links.'}
    ],
    info: 'Legt die Verschiebung des Bildes in x-Richtung fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setImageTranslationY',
    args: [
      {name: 'dy', default: '"0%"', type: 'String', info: 'Verschiebung des Bildes nach oben/unten.'}
    ],
    info: 'Legt die Verschiebung des Bildes in y-Richtung fest.'
  },Clazz,false,false,Java);
}

function defineJLabel(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'text'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineJTextComponent(Clazz, Java){
  Clazz.superClazz=Java.datatypes.JComponent;
  createMethod({
    name: 'setPlaceholder',
    args: [
      {name: 'placeholder', type: 'String', info: 'Der neue Platzhalter-Text der Komponente.'}
    ],
    info: "Legt den Platzhalter-Text der Komponente fest."
  },Clazz,false,false,Java);
  createMethod({
    name: 'getSelectionStart',
    args: [],
    info: "Liefert die aktuelle Startposition des ausgewählten Texts zurück.",
    returnType: "int"
  },Clazz,false,false,Java);
  createMethod({
    name: 'getSelectionEnd',
    args: [],
    info: "Liefert die aktuelle Endposition des ausgewählten Texts zurück.",
    returnType: "int"
  },Clazz,false,false,Java);
  createMethod({
    name: 'setSelection',
    args: [
      {name: 'start', type: 'int', info: 'Die neue Startposition der Auswahl.'},
      {name: 'end', type: 'int', info: 'Die neue Endposition der Auswahl.'}
    ],
    info: "Legt den ausgewählten Text fest."
  },Clazz,false,false,Java);
}

function defineJTextField(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'type', optional: true}, {type: 'String', name: 'placeholder'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JTextComponent;
}

function defineJTextArea(Clazz, Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'placeholder'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JTextComponent;
}

function defineJComboBox(Clazz,Java){
  createConstructor ({
    args: [
      {type: {baseType: 'String', dimension: 1}, name: 'options', optional: true}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  createMethod({
    name: 'getSelectedIndex',
    args: [],
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setSelectedIndex',
    args: [
      {name: 'index', type: 'int'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'setOptions',
    args: [
      {
        name: 'optionArray', type: {baseType: 'String', dimension: 1}
      }
    ]
  }, Clazz, false,false,Java);
  createMethod({
    name: 'addItem',
    args: [
      {
        name: 'item', type: 'String'
      }
    ]
  }, Clazz, false,false);
  createMethod({
    name: 'removeItemAt',
    args: [
      {
        name: 'index', type: 'int'
      }
    ]
  }, Clazz, false,false);
  createMethod({
    name: 'removeAllItems',
    args: [
    ]
  }, Clazz, false,false);
}

function defineJCheckBox(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'String', name: 'label'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  
}

function defineDataTable(Clazz,Java){
  createConstructor ({
    args: [
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  createMethod({
    name: 'setArray',
    args: [
      {name: 'array', type: {baseType: 'Object', dimension: 1}}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'getSelectedIndex',
    args: [
    ],
    returnType: "int"
  },Clazz,false,false,Java);
  createMethod({
    name: 'setSelectedIndex',
    args: [
      {name: 'index', type: 'int'}
    ]
  },Clazz,false,false,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
}

function defineJPanel(Clazz,Java){
  createConstructor ({
    args: [
      {type: {baseType: 'String', dimension: 0}, name: 'template'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
  createMethod({
    name: 'setLayout',
    args: [
      {name: 'layout', type: 'String', info: 'Das neue Layout des Panels.'}
    ],
    info: 'Legt das Layout für das Panel fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'add',
    args: [
      {name: 'component', type: 'JComponent', info: 'Die Komponente, die hinzugefügt werden soll.'}
    ],
    info: 'Fügt dem Panel eine (weitere) Komponente hinzu.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'remove',
    args: [
      {name: 'component', type: 'JComponent', info: 'Die Komponente, die entfernt werden soll.'}
    ],
    info: 'Entfernt die Komponente aus dem Panel, falls möglich.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'removeAll',
    info: 'Entfernt alle Komponenten aus dem Panel.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getChild',
    args: [
      {name: 'index', type: 'int', info: 'Der Index der gesuchten Kind-Komponente, beginnt bei 0.'}
    ],
    info: "Liefert die n-te Kind-Komponente des Panels zurück.",
    returnType: 'JComponent'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getChildInGrid',
    args: [
      {name: 'rowIndex', type: 'int', info: 'Der Index der Zeile, in der sich die Kind-Komponente befindet. Beginnt bei 0.'},
      {name: 'colIndex', type: 'int', info: 'Der Index der Spalte, in der sich die Kind-Komponente befindet. Beginnt bei 0.'}
    ],
    info: "Liefert die Kind-Komponente des Panels zurück, die sich in der angegebenen Zeile und Spalte (beide beginnen bei 0) befindet.",
    returnType: 'JComponent'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getChildCount',
    args: [
    ],
    info: "Liefert die Anzahl der Kind-Komponenten dieses Panels zurück.",
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getIndexOf',
    args: [
      {name: 'child', type: 'JComponent', info: 'Die Kind-Komponente, deren Index man abfragen möchte.'}
    ],
    info: "Liefert den Index der angegebenen Kind-Komponente innerhalb des Panels zurück. Der Index beginnt bei 0.",
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getRowOf',
    args: [
      {name: 'child', type: 'JComponent', info: 'Die Kind-Komponente, deren Zeilen-Index man abfragen möchte.'}
    ],
    info: "Liefert den Index der Zeile der angegebenen Kind-Komponente innerhalb des Panels zurück. Der Index beginnt bei 0.",
    returnType: 'int'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getColumnOf',
    args: [
      {name: 'child', type: 'JComponent', info: 'Die Kind-Komponente, deren Spalten-Index man abfragen möchte.'}
    ],
    info: "Liefert den Index der Spalte der angegebenen Kind-Komponente innerhalb des Panels zurück. Der Index beginnt bei 0.",
    returnType: 'int'
  },Clazz,false,false,Java);
  Clazz.superClazz=Java.datatypes.JComponent;
}

function defineCanvas(Clazz,Java){
  createConstructor ({
    args: [
      {type: 'double', name: 'minX'},{type: 'double', name: 'maxX'},{type: 'double', name: 'minY'}, {type: 'double', name: 'maxY'}
    ]
  },Clazz,Java);
  Clazz.superClazz=Java.datatypes.JPanel;
  createMethod({
    name: 'save',
    args: [
    ],
    info: "Speichert den aktuellen Zustand des Canvas auf einem Stack."
  },Clazz,false,false,Java);
  createMethod({
    name: 'restore',
    args: [
    ],
    info: "Stellt den zuletzt gespeicherten Zustand des Canvas wieder her."
  },Clazz,false,false,Java);
  createMethod({
    name: 'reset',
    args: [
    ],
    info: "Resettet den Canvas."
  },Clazz,false,false,Java);
  createMethod({
    name: 'rotate',
    args: [{name: 'angle', type: 'double', info: 'Winkel, um den gedreht wird'}, {name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts der Drehung.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts der Drehung.'}],
    info: "Dreht alles, was danach gezeichnet wird, um den angegebenen Punkt."
  },Clazz,false,false,Java);
  createMethod({
    name: 'translate',
    args: [{name: 'dx', type: 'double', info: 'Verschiebung in x-Richtung.'}, {name: 'dy', type: 'double', info: 'Verschiebung in y-Richtung.'}],
    info: 'Verschiebt alles, was danach gezeichnet wird.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setTransform',
    args: [{name: 'm00', type: 'double'}, {name: 'm10', type: 'double'},{name: 'm01', type: 'double'},{name: 'm11', type: 'double'},{name: 'm02', type: 'double'},{name: 'm12', type: 'double'}],
    info: 'Legt die Transformationsmatrix auf die angegebenen Werte fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'scale',
    args: [{name: 'sx', type: 'double', info: 'Skalierungsfaktor in x-Richtung. Bei negativem Wert wird an einer vertikalen Achse gespiegelt.'}, {name: 'sy', type: 'double', info: 'Skalierungsfaktor in y-Richtung. Bei negativem Wert wird an einer horizontalen Achse gespiegelt.'}, {name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts der Skalierung.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts der Skalierung.'}],
    info: 'Skaliert alles, was danach gezeichnet wird.'
  },Clazz,false,false,Java);
  // createMethod({
  //   name: 'scale',
  //   args: [{name: 'sx', type: 'double', info: 'Skalierungsfaktor in x-Richtung. Bei negativem Wert wird an einer vertikalen Achse gespiegelt.'}, {name: 'sy', type: 'double', info: 'Skalierungsfaktor in y-Richtung. Bei negativem Wert wird an einer horizontalen Achse gespiegelt.'}, {name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts der Skalierung.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts der Skalierung.'}],
  //   info: 'Skaliert alles, was danach gezeichnet wird.'
  // },Clazz,false,false,Java);
  createMethod({
    name: 'setMirrored',
    args: [
      {name: 'm', type: 'boolean', info: 'true, wenn gespiegelt werden soll, sonst false'}
    ],
    info: ""
  },Clazz,false,false,Java);
  createMethod({
    name: 'redraw',
    args: [
    ],
    info: "Zeichnet den Canvas neu."
  },Clazz,false,false,Java);
  // createMethod({
  //   name: 'setOrigin',
  //   args: [{name: 'x', type: 'double', info: 'x-Koordinate des Koordinatenursprungs'}, {name: 'y', type: 'double', info: 'y-Koordinate des Koordinatenursprungs'}],
  //   info: 'Legt die Position des Koordinatenursprungs (0|0) fest.'
  // },Clazz,false,false,Java);
  createMethod({
    name: 'setAxisX',
    args: [{name: 'min', type: 'double', info: 'minimale x-Koordinate'}, {name: 'max', type: 'double', info: 'maximale x-Koordinate'}],
    info: 'Legt die x-Achse des Koordinatensystems fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setAxisY',
    args: [{name: 'min', type: 'double', info: 'minimale y-Koordinate'}, {name: 'max', type: 'double', info: 'maximale y-Koordinate'}],
    info: 'Legt die y-Achse des Koordinatensystems fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setRotation',
    args: [{name: 'angle', type: 'double', info: 'Winkel, um den gedreht wird'}],
    info: ''
  },Clazz,false,false,Java);
  createMethod({
    name: 'setOpacity',
    args: [{name: 'value', type: 'double', info: 'Wert zwischen 0 (komplett transparent) und 1 (komplett sichtbar).'}],
    info: 'Legt die Transparenz aller nachfolgenden Zeichnungen fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'clear',
    args: [],
    info: 'Löscht alle Zeichnungen auf dem Canvas.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setFontsize',
    args: [{name: 's', type: 'double', info: 'Schriftgröße'}],
    info: 'Ändert die Schriftgröße für die write-Befehle.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setFont',
    args: [{name: 'fontName', type: 'String', info: 'Name der Schriftart'}],
    info: 'Legt die Schriftart für die write-Befehle fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setLinewidth',
    args: [{name: 'w', type: 'double', info: 'Dicke der Linien'}],
    info: 'Legt die Breite der gezeichneten Linien fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'write',
    args: [{name: 'text', type: 'String', info: 'Der Text, der geschrieben werden soll. Verwende &bsol;n fuer Zeilenumbrueche.'}, {name: 'x', type: 'double', info: 'Die x-Koordinate des Texts.'}, {name: 'y', type: 'double', info: 'Die y-Koordinate des Texts.'}, {name: 'align', type: 'String', info: 'Eine Angabe aus bis zu 2 Woertern, die bestimmen, wie der Text am Punkt (x|y) ausgerichtet sein soll. Moegliche Woerter: "left", "center", "right" und "top", "middle", "bottom".', hide: true}],
    info: 'Schreibt Text in den Canvas.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'drawCircle',
    args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
    info: 'Zeichnet einen Kreis.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'fillCircle',
    args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
    info: 'Zeichnet einen ausgefüllten Kreis.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'drawRect',
    args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
    info: 'Zeichnet ein Rechteck.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'fillRect',
    args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
    info: 'Zeichnet ein ausgefülltes Rechteck.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'drawLine',
    args: [{name: 'x1', type: 'double', info: 'x-Koordinate des ersten Punkts.'}, {name: 'y1', type: 'double', info: 'y-Koordinate des ersten Punkts.'}, {name: 'x2', type: 'double', info: 'x-Koordinate des zweiten Punkts.'}, {name: 'y2', type: 'double', info: 'y-Koordinate des zweiten Punkts.'}],
    info: 'Zeichnet eine gerade Linie.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'setColor',
    args: [{name: 'farbe', type: 'String'}],
    info: 'Legt die Farbe für die nachfolgenden Zeichnungen fest.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getMouseX',
    args: [],
    info: 'Liefert die aktuelle x-Koordinate der Maus innerhalb dieses Canvas.',
    returnType: 'double'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getMouseY',
    args: [],
    info: 'Liefert die aktuelle y-Koordinate der Maus innerhalb dieses Canvas.',
    returnType: 'double'
  },Clazz,false,false,Java);
  createMethod({
    name: 'isMouseOver',
    args: [],
    info: 'Prüft, ob sich die Maus aktuell über dem Canvas befindet.',
    returnType: 'boolean'
  },Clazz,false,false,Java);
  createMethod({
    name: 'isMousePressed',
    args: [],
    info: 'Prüft, ob die Maustaste gedrückt ist und sich die Maus aktuell über dem Canvas befindet.',
    returnType: 'boolean'
  },Clazz,false,false,Java);
  createMethod({
    name: 'getChildAtPoint',
    args: [{name: "x", type: "double"}, {name: "y", type: "double"}],
    info: 'Liefert die Komponente an dieser Stelle.',
    returnType: 'JComponent'
  },Clazz,false,false,Java);
  createMethod({
    name: 'drawImage',
    args: [
      {name: 'image', type: 'String'},
      {name: 'cx', type: 'double'},
      {name: 'cy', type: 'double'},
      {name: 'width', type: 'double'},
      {name: 'height', type: 'double'},
      {name: 'rotation', type: 'double', optional: true},
      {name: 'mirrored', type: 'boolean', optional: true},
    ],//image, cx, cy, width, height
    info: 'Zeichnet ein Bild in den Canvas.'
  },Clazz,false,false,Java);
  createMethod({
    name: 'drawImagePart',
    args: [
      {name: 'image', type: 'String'},
      {name: 'cx', type: 'double'},
      {name: 'cy', type: 'double'},
      {name: 'width', type: 'double'},
      {name: 'height', type: 'double'},
      {name: 'sx', type: 'double'},
      {name: 'sy', type: 'double'},
      {name: 'swidth', type: 'double'},
      {name: 'sheight', type: 'double'},
      {name: 'rotation', type: 'double'},
      {name: 'mirrored', type: 'boolean'}
    ],//image, cx, cy, width, height
    info: 'Zeichnet einen Bildausschnitt in den Canvas.'
  },Clazz,false,false,Java);

  createMethod({
    name: 'setSizePolicy',
    args: [{name: '"stretch"', type: "String"}],
    info: 'Legt die Größenanpassung auf "stretch" oder auf "fit" fest.'
  },Clazz,false,false,Java);
}