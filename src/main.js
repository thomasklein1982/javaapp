import { createApp } from 'vue'
import './style.css';
import App from './App.vue'
import PrimeVue  from "primevue/config";
import Aura from "@primevue/themes/aura";
import  Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import InputNumber from "primevue/inputnumber";
import ToggleSwitch from "primevue/toggleswitch";
import * as Dialog  from "primevue/dialog";
import Menubar from 'primevue/menubar';
import Sidebar from 'primevue/sidebar';
import Panel from 'primevue/panel';
import Tree from 'primevue/tree';
import Badge from 'primevue/badge';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Toast from "primevue/toast";
import ConfirmPopup from 'primevue/confirmpopup';
import Splitter from "primevue/splitter";
import SplitterPanel from 'primevue/splitterpanel'
import Slider from "primevue/slider";
import Card from 'primevue/card';
import SelectButton from 'primevue/selectbutton';
import ToggleButton from 'primevue/togglebutton';
import Message from "primevue/message";
import Listbox from 'primevue/listbox';
import TextArea from 'primevue/textarea';
import Tooltip from 'primevue/tooltip';
import IftaLabel from 'primevue/iftalabel';

// import 'primevue/resources/themes/vela-orange/theme.css';
// import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import './lib/lzstring.js';
import './lib/localforage.min.js';
import router from "./router";

import { registerSW } from 'virtual:pwa-register'
import { appjsdata } from './functions/snippets';
import { definePreset } from '@primevue/themes';
import { basicSetup, EditorView } from 'codemirror';
import { html } from '@codemirror/lang-html';

"use strict"

const updateSW=registerSW({
  onNeedRefresh(){
    let a=confirm("Eine neue Version ist verfügbar. Willst du aktualisieren (empfohlen!)?");
    if(a){
      updateSW();
    }
  },
  onOfflineReady(){
    console.log("offline ready");
  }
});

let app=createApp(App);
app.use(router);
let MyPreset=definePreset(Aura, {
  semantic: {
    primary: {
        50: '{amber.50}',
        100: '{amber.100}',
        200: '{amber.200}',
        300: '{amber.300}',
        400: '{amber.400}',
        500: '{amber.500}',
        600: '{amber.600}',
        700: '{amber.700}',
        800: '{amber.800}',
        900: '{amber.900}',
        950: '{amber.950}'
    },
    colorScheme: {
      dark: {
        surface: {
          50: '#E2E2F2',
          100: '#C7C7D7',
          200: '#B3B3C3',
          300: '#9999A9',
          400: '#848494',
          500: '#707080',
          600: '#5B5B6B',
          700: '#464656',
          800: '#313141',
          900: '#242434',
          950: '#101020'
        },
        
    }
    },
    surface: {
      50: '{amber.50}',
        100: '{amber.100}',
        200: '{amber.200}',
        300: '{amber.300}',
        400: '{amber.400}',
        500: '{amber.500}',
        600: '{amber.600}',
        700: '{amber.700}',
        800: '{amber.800}',
        900: '{amber.900}',
        950: '{amber.950}'
    }
  }
});
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.my-app-dark',
    }
  }
});
app.use(ConfirmationService);
app.use(ToastService);
app.directive('tooltip', Tooltip);
app.component('Button',Button);
app.component('Dialog',Dialog.default);
app.component('Checkbox',Checkbox);
app.component('InputText',InputText);
app.component('InputNumber',InputNumber);
app.component('Menubar',Menubar);
app.component('Sidebar',Sidebar);
app.component('Panel',Panel);
app.component('Tree',Tree);
app.component('Badge',Badge);
app.component('ConfirmPopup',ConfirmPopup);
app.component('Toast',Toast);
app.component('Splitter',Splitter);
app.component('SplitterPanel',SplitterPanel);
app.component('Slider',Slider);
app.component('ToggleSwitch',ToggleSwitch);
app.component('Card',Card);
app.component('SelectButton',SelectButton);
app.component('Select',Select);
app.component('ToggleButton',ToggleButton);
app.component('Message',Message);
app.component('Listbox',Listbox);
app.component('TextArea',TextArea);
app.component('IftaLabel',IftaLabel);


window.app=app.mount('#app');

let text=(appJScode+"");
let pos=text.indexOf("{");
let pos2=text.lastIndexOf("}");
text=text.substring(pos+1,pos2);
text+="\nApp={$hideFromConsole: true};";

for(let i=0;i<appjsdata.functions.length;i++){
  let f=appjsdata.functions[i];
  if(f.isNative){
    text+="\nApp."+f.name+"=function(a,b,c,d){"+f.name+"(a,b,c,d)};";
  }else{
    text+="\nApp."+f.name+"="+f.name+";";
  }
}

for(let name in appjsdata.objects){
  let o=appjsdata.objects[name];
  text+="\nApp."+o.name+"=window."+o.name+";";
}

window.appJScode=text;

text=(additionalJSCode+"");
pos=text.indexOf("{");
pos2=text.lastIndexOf("}");
text=text.substring(pos+1,pos2);
additionalJSCode=text;


text=(peerJScode+"");
pos=text.indexOf("{");
pos2=text.lastIndexOf("}");
text=text.substring(pos+1,pos2);
peerJScode=text;

window.onmessage=function(message){
  if(!message) return;
  let app=window.app;
  let data=message.data;
  if(data.type==="error"){
    data=data.data;
    app.$refs.editor.setRuntimeError(data);
  }else if(data.type==="debug-pause"){
    app.paused=true;
    app.resetCurrent(data.line,data.name);
  }else if(data.type==="getScope"){
    app.current.$scope.local=data.data.local;
    app.current.$scope.that=data.data.that;
    app.current.$scope.main=data.data.main;
  }else if(data.type==="update-scope-main"){
    app.current.$scope.main=data.data;
  }else if(data.type==="setup-exercise"){
    app.setupExercise(data.data);
  }else if(data.type==="exercise-tested"){
    app.handleExerciseTest(data.data);
  }else if(data.type==="show-check-exercise-button"){
    app.showCheckExerciseButton();
  }else if(data.type==="give-exercise-data"){
    app.sendExerciseData();
  }else if(data.type==="reportError"){
    data=data.data;
    app.$refs.editor.setSourceFileError(data);
  }else if(data.type==="give-class-names"){
    app.sendClassNames();
  }else if(data.type==="give-project"){
    app.sendProject();
  }else if(data.type==="give-full-app-code"){
    app.sendFullAppCode();
  }else if(data.type==="add-class"){
    app.addClazz(data.data);
  }else if(data.type==="remove-class"){
    app.removeClazz(data.data.name);
  }else if(data.type==="open-project"){
    app.openProjectFromJSON(data.data);
  }else if(data.type==="open-project-from-full-app-code"){
    app.openProjectFromFullAppCode(data.data);
  }else if(data.type==="open-project-empty"){
    app.switchToEmptyProject();
  }else if(data.type==="set-visible-menubar"){
    app.setVisibleMenubar(data.data.visible);
  }else if(data.type==="set-visible-sidebar"){
    app.setVisibleSidebar(data.data.visible);
  }else if(data.type==="set-visible-run-button"){
    app.setVisibleRunButton(data.data.visible);
  }
}


document.addEventListener("keydown", function(e) {
  let platform;
  if(window.navigator.userAgentData){
    platform=window.navigator.userAgentData.platform || window.navigator.platform;
  }else{
    platform=window.navigator.platform;
  }
  if(!platform) platform="";

  let key=e.code||e.keyCode;
  if ((platform.match("Mac") ? e.metaKey : e.ctrlKey)  && (key === 83 || key==="KeyS")) {
    e.preventDefault();
    window.app.$refs.editor.downloadProject();
  }
}, false);


window.startTime=null;
window.stopTimeStart=function(){
  window.startTime=Date.now();
}
window.stopTimeStop=function(s){
  let e=Date.now();
  console.log("time stopped",s,(e-window.startTime)+"ms");
  window.startTime=e;
}

window.clazzSources={
  
}

if(window.parent){
  window.parent.postMessage({
    type: "LOADING-COMPLETE"
  },"*");
}