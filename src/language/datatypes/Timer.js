import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";

export function defineTimer(clazz){
  clazz.description=`Ein Timer kann verwendet werden, um regelmäßig oder einmalig eine Methode auszuführen, nachdem eine gewisse Zeitspanne verstrichen ist.
  <h3>Beispiel</h3>
<pre><code>int sekunden = 0;
Timer t = new Timer ( 1000, (ev)->{
  sekunden++;
  System.out.println( sekunden );
} );
t.start();
</code></pre>`;
  createConstructor({
    args: [
      {
        name: "delay",
        type: "int",
        info: "Die Anzahl Millisekunden bis der Timer abläuft."
      },
      {
        name: "listener",
        default: "(ev)->{}",
        type: "ActionListener",
        info: "Wird ausgeführt, wenn der Timer abläuft."
      },
    ],
    info: "Erzeugt einen neuen Timer."
  },clazz);
  createMethod({
    name: "getDelay",
    args: [],
    returnType: "int",
    info: "Liefert die Anzahl der Millisekunden bis der Timer abläuft."
  },clazz,false,false);
  createMethod({
    name: "setDelay",
    args: [{name: "delay", type: "int"}],
    info: "Legt die Anzahl der Millisekunden, bis der Timer abläuft, fest."
  },clazz,false,false);
  createMethod({
    name: "setActionCommand",
    args: [{name: "cmd", type: "String"}],
    info: "Legt das ActionCommand des Timers fest."
  },clazz,false,false);
  createMethod({
    name: "getActionCommand",
    args: [],
    returnType: "String",
    info: "Liefert das ActionCommand des Timers."
  },clazz,false,false);
  createMethod({
    name: "start",
    args: [],
    info: "Startet den Timer."
  },clazz,false,false);
  createMethod({
    name: "stop",
    args: [],
    info: "Stoppt den Timer."
  },clazz,false,false);
  createMethod({
    name: "restart",
    args: [],
    info: "Startet den Timer neu."
  },clazz,false,false);
  createMethod({
    name: "setRepeats",
    args: [{name: "false", type: "boolean"}],
    info: "Left fest, ob der Timer mehrfach ausgeführt werden soll oder nicht."
  },clazz,false,false);
  createMethod({
    name: "isRepeats",
    args: [],
    returnType: "boolean",
    info: "Liefert zurück, ob der Timer nach Ablauf automatisch wieder von vorne startet."
  },clazz,false,false);
  createMethod({
    name: "isRunning",
    args: [],
    returnType: "boolean",
    info: "Liefert zurück, ob der Timer läuft oder nicht."
  },clazz,false,false);
}