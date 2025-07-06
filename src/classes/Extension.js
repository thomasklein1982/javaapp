import { Clazz } from "./Clazz";
import { Project } from "./Project";

export default class Extension{
  javaappVersion=null;

  constructor(name,clazzes){
    this.name=name;
    this.javaappVersion=app.version;
    this.clazzes=[];
    if(!clazzes) return;
    for(let i=0;i<clazzes.length;i++){
      let c=clazzes[i];
      let clazz;
      if(c instanceof Clazz){
        clazz=c;
      }else{
        clazz=new Clazz(c.name);
        clazz.restoreFromSaveObject(c);
      }
      this.clazzes.push(clazz);
    }
  }
  compile(Java){
    let ext=this;
    let code="/*EXTENSION-CODE "+ext.name+"*/";
    let project=new Project("Extensions");
    project.clazzes=[];
    for(let i=0;i<ext.clazzes.length;i++){
      let c=ext.clazzes[i];
      c.project=project;
      project.clazzes.push(c);
    }
    project.compile(true,true);
    for(let i=0;i<project.clazzes.length;i++){
      let c=project.clazzes[i];
      Java.datatypes[c.name]=c;
      if(c.isInterface) Java.interfaces[c.name]=c;
      else Java.clazzes[c.name]=c;
      code+="\n"+c.getJavaScriptCode();
    }
    return code;
  }
  removeFromJava(Java){
    for(let i=0;i<this.clazzes.length;i++){
      let c=this.clazzes[i];
      delete Java.datatypes[c.name];
      if(c.isInterface) delete Java.interfaces[c.name];
      else delete Java.clazzes[c.name];
    }
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