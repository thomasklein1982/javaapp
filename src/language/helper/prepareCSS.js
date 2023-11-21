export function prepareCSS(cssText){
  let s=cssText.split("asset(");
  let t="";
  for(let i=0;i<s.length;i++){
    if(i%2===0){
      t+=s[i];
    }else{
      let pos=s[i].indexOf(")");
      let asset=s[i].substring(0,pos);
      
      t+=s[i].substring(pos+1);
    }
  }
}