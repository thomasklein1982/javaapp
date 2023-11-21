

export function BlockComment(node,source,scope,errors){
  let text=source.getText(node);
  let code;
  if(text.startsWith("/*JAVASCRIPT-CODE")){
    code="/*JAVASCRIPT-CODE-START*/\n"+text.substring(17,text.length-2)+"\n/*JAVASCRIPT-CODE-STOP*/";
  }else{
    code=text;
  }
  console.log(code);
  return {
    code,
    type: null
  };
}