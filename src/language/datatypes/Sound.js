import { options } from "../../classes/Options";
import { createAttribute } from "../helper/createAttribute";
import { createConstructor } from "../helper/createConstructor";
import { createMethod } from "../helper/createMethod";

// constructor(url){
//   this.url=url;
//   this.audio=new Audio(this.url);
// }
// setSource(url){
//   this.url=url;
//   this.audio=new Audio(this.url);
// }
// play(loop){
//   this.stop();
//   this.audio.loop=loop;
//   this.audio.play();
// }
// pause(){
//   if(!this.audio) return;
//   this.audio.pause();
// }
// stop(){
//   this.audio.pause();
//   this.audio.currentTime = 0;
// }
// getDuration(){
//   return this.audio.duration;
// }
// getCurrentTime(){
//   return this.audio.currentTime;
// }
// isEnded(){
//   return this.audio.ended;
// }

export function defineSound(Clazz,Java){
  createConstructor({
    args: [
      {name: 'source', type: 'String'}
    ]
  },Clazz);
  createMethod({
    name: 'setSource',
    args: [
      {name: 'source', type: 'String'}
    ]
  },Clazz,false,false,Java);
  createMethod({
    name: 'play',
    args: [
      {name: 'loop', type: 'boolean'}
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'pause',
    args: [
    ],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'stop',
    args: [],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'getDuration',
    args: [],
    info: "",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'getCurrentTime',
    args: [],
    info: "",
    returnType: "int"
  },Clazz,false,false);
  createMethod({
    name: 'setCurrentTime',
    args: [{name: "time", type: "int"}],
    info: ""
  },Clazz,false,false);
  createMethod({
    name: 'isEnded',
    args: [],
    info: "",
    returnType: "boolean"
  },Clazz,false,false);
}