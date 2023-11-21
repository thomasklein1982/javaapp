import {loadLocally,saveLocally} from "../functions/helper";

let STORAGE_STRING="JAVA_APP_OPTIONS";

class Options{
  /**
   * 
   * @param {*} classOptional class ...{} bei Hauptklasse optional
   * @param {*} voidOptional void kann weggelassen werden
   * @param {*} mainOptional keine main-Methode notwendig; erste Klasse ist immer Hauptklasse
   * @param {*} autocast primitive Typen und Strings werden automatisch implizit ineinander umgewandelt
   * @param {*} instantiateUIClasses für jede UI-Klasse wird automatisch ein Attribut in der Hauptklasse mit gleichem Namen erzeugt, das eine Instanz der UI-Klasse enthält. Alle diese UI-Klassen sind zu Beginn unsichtbar, außer, es gibt genau eine UI-Klasse.
   */
  constructor(classOptional, voidOptional, mainOptional, autocast, instantiateUIClasses){
    this.classOptional=classOptional;
    this.voidOptional=voidOptional;
    this.mainOptional=mainOptional;
    this.autocast=autocast;
    this.instantiateUIClasses=instantiateUIClasses;
  }
  isEasyMode(){
    return this.classOptional||this.voidOptional||this.mainOptional;
  }
  static async createFromStorage(){
    let options=new Options(false,false,false,false,false);
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
  async changeToEasy(){
    this.classOptional=true;
    this.voidOptional=true;
    this.mainOptional=true;
    this.autocast=true;
    this.instantiateUIClasses=true;
    await this.saveToStorage();
  }
  async changeToNormal(){
    this.classOptional=false;
    this.voidOptional=false;
    this.mainOptional=false;
    this.autocast=true;
    this.instantiateUIClasses=false;
    await this.saveToStorage();
  }
  async saveToStorage(){
    await saveLocally(STORAGE_STRING, this);
  }
  static createFromHash(){
    let options=new Options(false,false,false,false,false);
    let hash=location.hash;
    if(hash.length>0){
      hash=hash.toLowerCase();
      for(let a in options){
        if(hash.indexOf(a.toLowerCase())>=0){
          options[a]=true;
        }
      }
      if(hash.indexOf("easy")>=0){
        options.classOptional=true;
        options.voidOptional=true;
        options.mainOptional=true;
        options.autocast=true;
        options.instantiateUIClasses=true;
      }
    }
    hash=location.search;
    if(hash.length>0){
      hash=hash.toLowerCase();
      for(let a in options){
        if(hash.indexOf(a.toLowerCase())>=0){
          options[a]=true;
        }
      }
      if(hash.indexOf("easy")>=0){
        options.classOptional=true;
        options.voidOptional=true;
        options.mainOptional=true;
        options.autocast=true;
        options.instantiateUIClasses=true;
      }
    }
    return options;
  }
}

export const options=await Options.createFromStorage();