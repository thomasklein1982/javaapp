export class Modifiers{
  constructor(){
    this.visibility='public';
    this.isStatic=false;
  }
  toString(){
    return this.visibility+" "+this.isStatic;
  }
  getJavaScriptCode(){
    return this.isStatic? "static":"";
  }
  compile(node,source){
    var errors=[];
    node=node.firstChild;
    this.visibility=null;
    while(node){
      if(node.name==="public"||node.name==="private"){
        if(this.visibility){
          errors.push(source.createError("Die Sichtbarkeit wurde bereits auf '"+this.visibility+"' festgelegt.",node));
        }else{
          this.visibility=node.name;
        }
      }else if(node.name==="static"){
        if(this.isStatic){
          errors.push(source.createError("Doppeltes Schlüsselwert 'static'.",node));
        }else{
          this.isStatic=true;
        }
        
      }else{
        console.log("modifier");
        console.log(node);
      }
      node=node.nextSibling;
    }
    return errors;
  }
}