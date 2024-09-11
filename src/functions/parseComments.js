export function parseComments(source,node){
  let text="";
  while(node && node.type.name.indexOf("Comment")>=0){
    let type=node.type.name;
    let t=source.getText(node);
    if(type==="BlockComment"){
      t=t.replace(/\/\*/g,"");
      t=t.replace(/\*\//g,"");
    }else if(type==="LineComment"){
      t=t.replace(/\/\//g,"");
    }
    t=t.trim();
    if(t.length>0) t+="\n";
    text+=t;
    node=node.nextSibling;
  }
  text=text.trim();
  return {
    node, text
  }
}