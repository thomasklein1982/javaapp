import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineGamepad(Clazz,Java){
  Clazz.description=`Mit Hilfe dieser Klasse können On-Screen-Gamepads erzeugt werden, die dann Eingaben durch einen oder mehrere Nutzer*innen zulassen.
  <h3>Beispiel</h3>
<pre><code>//Minimale UI:
JFrame frame = new JFrame( "1" );
Canvas canvas = new Canvas( 0, 100, 0, 100 );
frame.add( canvas );
JLabel figur = new JLabel( "😊" );
figur.setX( 50 );
figur.setY( 50 );
canvas.add( figur );
Gamepad gp = new Gamepad( );
//Timer für die Bewegung:
Timer timer = new Timer( 1000 / 60, ( ev ) -> {
  if ( gp.isLeftPressed( ) ) {
    figur.changeX( -1 );
  }
  if ( gp.isRightPressed( ) ) {
    figur.changeX( 1 );
  }
} );
timer.start( );
//Event-Listener für das Drücken einer Taste:
gp.setEventListener( "A", "press", ( ev ) -> {
  System.out.println( "Schuss!" );
} );
</code></pre>`;
  createConstructor({
    args: [
      
    ]
  },Clazz);
  createMethod({
    name: 'getDirection',
    args: [
    ],
    returnType: "String"
  },Clazz,false,false);
  createMethod({
    name: 'isUpPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isDownPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isLeftPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isRightPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isAPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isBPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isXPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'isYPressed',
    args: [
    ],
    returnType: "boolean"
  },Clazz,false,false);
  createMethod({
    name: 'setPosition',
    args: [
      {name: "left", type: "String"},
      {name: "bottom", type: "String"},
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setWidth',
    args: [
      {name: "w", type: "String"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setPadding',
    args: [
      {name: "p", type: "String"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setEventListener',
    args: [
      {name: "button", type: "String"},
      {name: "event", type: "String"},
      {name: "(ev)->{}", type: "ActionListener"},
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setDirectionButtonsSize',
    args: [
      {name: "size", type: "double"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setActionButtonsSize',
    args: [
      {name: "size", type: "double"}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setKey',
    args: [
      {name: "button", type: "String"},
      {name: "key", type: ["String","int"]}
    ]
  },Clazz,false,false);
  createMethod({
    name: 'setButtonVisible',
    args: [
      {name: "button", type: "String"},
      {name: "visible", type: "boolean"}
    ]
  },Clazz,false,false);
}