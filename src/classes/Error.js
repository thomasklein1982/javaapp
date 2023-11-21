export class Error{
  constructor(message,node,source){
    if(node){
      this.from=node.from+source.getPositionShift();
      this.to=node.to+source.getPositionShift();
      
    }else{
      this.from=0;
      this.to=0;
    }
    this.line=source.getLine(node.from);
    this.col=this.from-this.line.startIndex;
    if(!message){
      message="Syntax-Fehler";
    }
    this.message=message;
  }
  toString(){
    return this.line.number+":"+this.col+": "+this.message;
  }
  shift(source,delta){
    this.from+=delta;
    this.to+=delta;
    this.line=source.getLine(this.from);
    this.col=this.from-this.line.startIndex;
  }
}