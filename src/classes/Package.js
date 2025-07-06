import { Clazz } from "./Clazz";

export class Package{
  javaappVersion=null;

  constructor(name,clazzes){
    this.javaappVersion=app.version;
    this.clazzes=clazzes;
    this.name=name;
  }

  toJSON(){
    let clazzes=[];
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      clazzes.push(c.getSaveObject());
    }
    let data={
      javaappVersion: this.javaappVersion,
      name: this.name,
      clazzes
    };
    return data;
  }

  fromJSON(obj){
    this.javaappVersion=obj.javaappVersion;
    this.name=obj.name;
    this.clazzes=[];
    for(let i=0;i<obj.clazzes.length;i++){
      let c=obj.clazzes[i];
      let clazz=new Clazz(c.name);
      clazz.restoreFromSaveObject(c);
      this.clazzes.push(clazz);
    }
  }
}