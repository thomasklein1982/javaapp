import { createMethod } from "../language/helper/createMethod";
import { Clazz } from "./Clazz";
import peggy from "peggy";

export class PeggyParser extends Clazz{
  constructor(name,project){
    super(name,project,false);
    this.src="";
    this.isPeggyParser=true;
  }
  restoreFromSaveObject(obj){
    let props=["name","src"];
    for(let i=0;i<props.length;i++){
      let p=props[i];
      if(obj[p]!==undefined){
        this[p]=obj[p];
      }
    }
  }
  getSaveObject(){
    return {
      name: this.name,
      src: this.src,
      isPeggyParser: true,
    }
  }
  compile(fromSource,optimizeCompiler){
    
  }
  getParseFunctionName(){
    return this.name+"peg$parse";
  }
  getParseFunctionCode(){
    let src=this.prepareGrammar(this.src);
    let code=peggy.generate(src, {
      format: "commonjs",
      output: "source"
    });
    code=code.replace(/peg\$SyntaxError/g,"$"+this.name+"SyntaxError");
    let pos=code.indexOf("function peg$parse(input, options)");
    let codeSyntax=code.substring(0,pos).trim();
    let codeParse=code.substring(pos);
    pos=codeParse.indexOf("module.exports");
    codeParse="function "+this.getParseFunctionName()+codeParse.substring(18,pos).trim();
    let pos1=codeParse.indexOf("function peg$buildSimpleError");
    let pos2=codeParse.indexOf("function peg$buildStructuredError",pos1);
    pos2=codeParse.indexOf("}",pos2);
    codeParse=codeParse.substring(0,pos1)+`function peg$buildSimpleError(message, location){ 
      return { message, location };
  }
  function peg$buildStructuredError(expected, found, location) {
      return {expected, found, location};
  }`+codeParse.substring(pos2+1);
    return codeParse;
  }
  getJavaScriptCode(){
    try{
      let code=this.getParseFunctionCode()+"\n";
      code+="class "+this.name+"{";
      code+="\nstatic parse(input){";
      code+="\n  return "+this.getParseFunctionName()+"(input);";
      code+="\n}";
      code+="\nstatic getParser(){";
      code+="\n return this;";
      code+="\n}";
      code+="\n}";
      return code;
    }catch(e){
      return "class "+this.name+"{ static parse(input){ alert('Peggy-Parser funktioniert nicht'); }\nstatic getParser(){ return this; }}";
    }
  }
  prepareGrammar(src){
    let code=peggy.generate(src, {
      format: "commonjs",
      output: "ast"
    });
    if(code.rules.length===0) return src;
    let newCode="";
    let lastTo=-1;
    for(let i=0;i<code.rules.length;i++){
      let rule=code.rules[i];
      let from=rule.location.start.offset;
      let to=rule.location.end.offset;
      if(lastTo<0){
        newCode+=src.substring(0,from);
      }else{
        newCode+=src.substring(lastTo,from);
      }
      lastTo=to;
      let expr=rule.expression;
      if(expr.type==="action"){
        newCode+="\n"+src.substring(from,to);
        continue;
      }
      let exprFrom=expr.location.start.offset;
      let exprTo=expr.location.end.offset;
      newCode+="\n"+rule.name+" = ALL_OF_IT:("+src.substring(exprFrom,exprTo)+") {let l=location(); let o={};o.name='"+rule.name+"'; o.text=text(); o.start=l.start.offset; o.end=l.end.offset; o.line=l.start.line;o.children=ALL_OF_IT; return o;}";
      
    }
    return newCode;
  }
  getConstructorParameters(){
    return null;
  }
  getFileExtension(){
    return "peg";
  }
  compileDeclaration(){}
  compileDeclarationTypeParameters(){}
  compileMemberDeclarations(){
    let m=createMethod({
      name: "parse",
      args: [
        {name: "text", type: "String"}
      ],
      returnType: "AST",
      info: "Parst den Text und gibt ihn als AST (Abstract Syntax Tree) zurück"
    },this,true,false);
    this.methods.parse=m;
    m=createMethod({
      name: "getParser",
      args: [
        
      ],
      returnType: "Object",
      info: ""
    },this,true,false);
    this.methods.getParser=m;
  }
  compileMethods(){}
  resolveSuperClazz(){}
  generateSrcAndTree(src){
    this.src=src;
  }
  getMethodByPosition(){}
  getRealSuperClazz(){
    return this.superClazz;
  }
  getRuntimeInfos(){ }
  hasStaticMainMethod(){
    return false;
  }
  getAllAttributeNames(){
    return [];
  }
  getFileName(){
    return this.name+"."+this.getFileExtension();
  }
  isUIClazz(){return false;}
  isNative(){return false;}
}