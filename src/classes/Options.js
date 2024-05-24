import {loadLocally,saveLocally} from "../functions/helper";

let STORAGE_STRING="JAVA_APP_OPTIONS";
let STORAGE_STRING_TRYIT="JAVA_APP_OPTIONS_TRYIT";

class Options{
  /**
   * 
   * @param {*} classOptional class ...{} bei Hauptklasse optional
   * @param {*} voidOptional void kann weggelassen werden
   * @param {*} mainOptional keine main-Methode notwendig; erste Klasse ist immer Hauptklasse
   * @param {*} autocast primitive Typen und Strings werden automatisch implizit ineinander umgewandelt
   * @param {*} instantiateUIClasses für jede UI-Klasse wird automatisch ein Attribut in der Hauptklasse mit gleichem Namen erzeugt, das eine Instanz der UI-Klasse enthält. Alle diese UI-Klassen sind zu Beginn unsichtbar, außer, es gibt genau eine UI-Klasse.
   */
  constructor(){
    this.classOptional=false;
    this.voidOptional=false;
    this.mainOptional=false;
    this.autocast=false;
    this.instantiateUIClasses=false;
    this.stringCharAtDeliversString=false;
    this.stringIsComparable=false;
    this.autoextendJavaApp=false;
  }
  isEasyMode(){
    return this.classOptional||this.voidOptional||this.mainOptional;
  }
  isHardMode(){
    return !this.classOptional && !this.voidOptional && !this.mainOptional && !this.autocast && !this.instantiateUIClasses && !this.stringCharAtDeliversString && !this.stringIsComparable && !this.autoextendJavaApp;
  }
  difficulty(){
    if(this.isEasyMode())return 0;
    if(this.isHardMode())return 2;
    return 1;
  }
  static async createFromStorage(){
    let options=new Options();
    let obj=await loadLocally(STORAGE_STRING);
    if(!obj){
      options.changeToNormal();
    }else{
      for(let a in options){
        options[a]=obj[a]===true;
      }
    }
    return options;
  }
  async changeToEasy(dontSave){
    this.classOptional=true;
    this.voidOptional=true;
    this.mainOptional=true;
    this.autocast=true;
    this.instantiateUIClasses=true;
    this.stringCharAtDeliversString=true;
    this.stringIsComparable=true;
    this.autoextendJavaApp=true;
    if(dontSave) return;
    await this.saveToStorage();
  }
  async changeToNormal(dontSave){
    this.classOptional=false;
    this.voidOptional=false;
    this.mainOptional=false;
    this.autocast=true;
    this.instantiateUIClasses=false;
    this.stringCharAtDeliversString=true;
    this.stringIsComparable=true;
    this.autoextendJavaApp=true;
    if(dontSave) return;
    await this.saveToStorage();
  }
  async changeToHard(dontSave){
    this.classOptional=false;
    this.voidOptional=false;
    this.mainOptional=false;
    this.autocast=false;
    this.instantiateUIClasses=false;
    this.stringCharAtDeliversString=false;
    this.stringIsComparable=false;
    this.autoextendJavaApp=false;
    if(dontSave) return;
    await this.saveToStorage();
  }
  async saveToStorage(){
    await saveLocally(STORAGE_STRING, this);
  }
  static createFromHash(){
    let options=new Options();
    let hashes=[location.hash,location.search];
    for(let i=0;i<hashes.length;i++){
      let hash=hashes[i];
      if(hash.length>0){
        hash=hash.toLowerCase();
        for(let a in options){
          if(hash.indexOf(a.toLowerCase())>=0){
            options[a]=true;
          }
        }
        if(hash.indexOf("easy")>=0){
          options.changeToEasy(true);
        }else if(hash.indexOf("hard")>=0){
          options.changeToHard(true);
        }
      }
    }
    return options;
  }
}

export const options=await Options.createFromStorage();
let hash=location.hash;
if(hash.indexOf("tryit")){
  if(hash.indexOf(";easy")>=0){
    console.log("change to easy");
    options.changeToEasy(false);
  }else if(hash.indexOf(";normal")>=0){
    console.log("change to normal");
    options.changeToNormal();
  }else if(hash.indexOf(";hard")>=0){
    console.log("change to hard");
    options.changeToHard();
  }
}