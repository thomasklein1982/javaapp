import { createMethod } from "../helper/createMethod";
import { createConstructor } from "../helper/createConstructor";

export function defineTimer(clazz){
  createConstructor({
    args: [
      {
        name: "delay",
        type: "int",
        info: "Die Anzahl Millisekunden bis der Timer abläuft."
      },
      {
        name: "(ev)->{}",
        type: "ActionListener",
        info: "Wird ausgeführt, wenn der Timer abläuft."
      },
    ],
    info: "Erzeugt einen neuen Timer."
  },clazz);
  createMethod({
    name: "setActionCommand",
    args: [{name: "cmd", type: "String"}],
    info: "Legt das ActionCommand des Timers fest."
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
}