export function prettify(code, options){
  let stringDelimiter;
  if(options?.stringDelimiter){
    stringDelimiter=options.stringDelimiter;
  }else{
    stringDelimiter=['"'];
  }
  let blockDelimiter;
  if(options?.blockDelimiter){
    blockDelimiter=options.blockDelimiter;
  }else{
    blockDelimiter=["{","}"];
  }
  code=code.replace(/\r|\n/g,"\n");
  let lastIsWhitespace=false;
  let inBrackets=false;
  let inString=null;
  let inComment=false;
  let startNewLine=false;
  let newCode="";
  let indent="";
  let lastChar=null;
  for(let i=0;i<code.length;i++){
    let c=code.charAt(i);
    if(inString){
      lastChar=c;
      lastIsWhitespace=false;
      newCode+=c;
      if(c===inString){
        inString=null;
      }
      continue;
    }
    if(inComment){
      lastIsWhitespace=false;
      newCode+=c;
      let comment;
      if(inComment.length===2){
        comment=lastChar+c;
      }else{
        comment=c;
      }
      if(comment===inComment){
        inString=null;
      }
      lastChar=c;
      continue;
    }
    if(c===" " || c==="\t"){
      lastChar=c;
      if(lastIsWhitespace){
        continue;
      }
      lastIsWhitespace=true;
      newCode+=" ";
      continue;
    }
    if(inBrackets){
      lastChar=c;
      if(c===")"){
        if(!lastIsWhitespace) newCode+=" ";
        inBrackets=false;
      }
      lastIsWhitespace=false;
      newCode+=c;
      continue;
    }
    if(c==="("){
      inBrackets=true;
      newCode+=c+" ";
      lastIsWhitespace=true;
      lastChar=c;
      continue;
    }
    if(c==="/" && lastChar==="/"){
      inComment="\n";
      lastChar=c;
      lastIsWhitespace=false;
      newCode+=c;
      continue;
    }
    if(c==="*" && lastChar==="/"){
      inComment="*/";
      lastChar=c;
      lastIsWhitespace=false;
      newCode+=c;
      continue;
    }
    let index=stringDelimiter.indexOf(c);
    if(index>=0){
      lastChar=c;
      inString=stringDelimiter[index];
      newCode+=c;
      lastIsWhitespace=false;
      continue;
    }
    if(c===blockDelimiter[1]){
      lastChar=c;
      indent=indent.substring(2);
      newCode+="\n"+indent+c;
      startNewLine=false;
      lastIsWhitespace=false;
      continue;
    }
    if(c===";"){
      lastChar=c;
      startNewLine=true;
      newCode+=c;
      lastIsWhitespace=false;
      continue;
    }
    if(c===blockDelimiter[0]){
      lastChar=c;
      indent+="  ";
      newCode+=c;
      startNewLine=true;
      lastIsWhitespace=false;
      continue;
    }
    
    
    if(c==="\n"){
      lastChar=c;
      lastIsWhitespace=true;
      if(startNewLine){
        newCode+="\n"+indent;
        startNewLine=false;
      }else{
        startNewLine=true;
      }
      continue;
    }
    lastIsWhitespace=false;
    if(startNewLine){
      startNewLine=false;
      newCode+="\n"+indent;
      lastIsWhitespace=true;
    }
    newCode+=c;
    lastChar=c;
  }
  return newCode;
}