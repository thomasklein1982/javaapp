import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineSocket(clazz){
  createConstructor({
    args: [
    ]
  },clazz);
  // createMethod({
  //   name: "start",
  //   args: [],
  //   info: "Startet diesen Computer als Server der Netzwerk-Sitzung."
  // },clazz,false,false);
  createMethod({
    name: "connect",
    args: [
      {name: "serverID", type: "String"},
      {name: "username", type: "String"}
    ],
    info: "Baut eine Verbindung zum Server mit der angegebenen serverID auf und identifiziert sich mit dem username."
  },clazz,false,false);
  createMethod({
    name: "send",
    args: [
      {name: "message", type: "String"},
      {name: "header", type: "String", optional: true}
    ],
    info: "Sendet eine Nachricht an alle anderen Clients."
  },clazz,false,false);
  createMethod({
    name: "sendToServer",
    args: [
      {name: "message", type: "String"},
      {name: "header", type: "String", optional: true}
    ],
    info: "Sendet eine Nachricht an den Server."
  },clazz,false,false);
  createMethod({
    name: "sendTo",
    args: [
      {name: "username", type: "String"},
      {name: "message", type: "String"},
      {name: "header", type: "String", optional: true}
    ],
    info: "Sendet eine Nachricht an einen bestimmten Client."
  },clazz,false,false);
  createMethod({
    name: "onMessage",
    args: [
      {name: "listener", type: "MessageListener", default: "(m)->{}"}
    ],
    info: "Legt fest, was passieren soll, wenn eine Nachricht über das Netzwerk empfangen wird."
  },clazz,false,false);
}