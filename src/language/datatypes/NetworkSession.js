import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineNetworkSession(clazz){
  createConstructor({
    args: [
      {name: 'sessionId', type: 'String'}
    ]
  },clazz);
  createMethod({
    name: "start",
    args: [],
    info: "Startet diesen Computer als Server der Netzwerk-Sitzung."
  },clazz,false,false);
  createMethod({
    name: "join",
    args: [
      {name: "username", type: "String"}
    ],
    info: "Tritt der Session unter einem Username bei."
  },clazz,false,false);
  createMethod({
    name: "sendToAll",
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