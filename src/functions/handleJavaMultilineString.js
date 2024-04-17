export function handleJavaMultilineString(s){
  let lines=s.split("\n");
  let startLineIndex=0;
  if(lines[0].trim().length===0){
    startLineIndex=1;
  }
  //get minimum indentation:
  let minimumIndentation=-1;
  for(let i=startLineIndex;i<lines.length;i++){
    let line=lines[i];
    let indentation=0;
    let N;
    if(minimumIndentation>=0){
      N=Math.min(minimumIndentation,line.length);
    }else{
      N=line.length;
    }
    for(let j=0;j<N;j++){
      if(line.charAt(j)!==" ") break;
      indentation++;
    }
    if(minimumIndentation<0 || indentation<minimumIndentation){
      minimumIndentation=indentation;
    }
  }
  if(minimumIndentation<0) return "";
  //shift left, put together:
  s="";
  for(let i=startLineIndex;i<lines.length;i++){
    if(i>startLineIndex) s+="\n";
    s+=lines[i].substring(minimumIndentation).trimEnd();
  }
  return s;
}