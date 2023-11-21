import { Error } from "./Error";

export class Source{
  constructor(src,tree,clazz){
    this.src=src;
    this.clazz=clazz;
    this.tree=tree;
  }
  getPositionShift(){
    if(this.clazz){
      return this.clazz.getPositionShift();
    }
    return 0;
  }
  getLineNumber(index){
    let line=1;
    for(let i=0;i<=index;i++){
      if(this.src[i]==="\n"){
        line++;
      }
    }
    return line;
  }
  getLine(index){
    let line=1;
    let lastIndex=0;
    for(let i=0;i<=index;i++){
      if(this.src[i]==="\n"){
        line++;
        lastIndex=i+1;
      }
    }
    return {
      number: line,
      startIndex: lastIndex
    };
  }
  createError(message,node){
    return new Error(message,node,this);
  }
  getText(node){
    return this.src.substring(node.from,node.to);
  }
}