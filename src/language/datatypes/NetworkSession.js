import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

export function defineNetworkSession(clazz){
  clazz.description=`Diese Klasse dient dazu, Netzwerkverbindungen zwischen zwei oder mehr Apps zu managen. Damit kann beispielsweise ein Chat oder ein Multiplayer-Spiel entwickelt werden.`;
  createConstructor({
    args: [
      
    ]
  },clazz);
  createMethod({
    name: "showStartDialog",
    args: [
      
    ],
    info: ""
  },clazz,false,false);
  createMethod({
    name: "start",
    args: [
      {name: 'sessionId', type: 'String'},
      {name: "username", type: "String"}
    ],
    info: "Startet diesen Computer als Server der Netzwerk-Sitzung."
  },clazz,false,false);

  createMethod({
    name: "connect",
    args: [
      {name: 'sessionId', type: 'String'},
      {name: "username", type: "String"}
    ],
    info: "Baut eine Verbindung zu einem Server auf und identifiziert sich mit einem Username."
  },clazz,false,false);
  createMethod({
    name: "sendToOthers",
    args: [
      {name: "message", type: "String"},
      {name: "header", type: "String", optional: true}
    ],
    info: "Sendet eine Nachricht an alle anderen Clients."
  },clazz,false,false);
  createMethod({
    name: "sendToEverybody",
    args: [
      {name: "message", type: "String"},
      {name: "header", type: "String", optional: true}
    ],
    info: "Sendet eine Nachricht an alle Clients."
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
  createMethod({
    name: "getID",
    args: [
      
    ],
    info: "Liefert die ID dieser Netzwerk-Session zurück oder null, wenn die Session nicht verbunden ist.",
    returnType: "String",
  },clazz,false,false);
  createMethod({
    name: "isConnected",
    args: [
      
    ],
    info: "Liefert true, falls diese Session mit einem Server verbunden ist.",
    returnType: "boolean",
  },clazz,false,false);
}