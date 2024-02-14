export class Error{
  constructor(message,from,to,source){
    
    this.from=from;
    this.to=to;
    this.line=source.getLine(from);
    this.col=this.from-this.line.startIndex;
    if(!message){
      message="Syntax-Fehler";
    }
    this.message=message;
    //console.error(this.message,this)
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