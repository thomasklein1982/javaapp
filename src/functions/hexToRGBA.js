export function hexToRGBA(hex){
  let rgba=[0,0,0,0];
  if(hex.startsWith("#")){
    hex=hex.substring(1);
  }
  if(hex.length===3){
    hex=hex.charAt(0)+hex.charAt(0)+hex.charAt(1)+hex.charAt(1)+hex.charAt(2)+hex.charAt(2);
  }
  for(let i=0;i<hex.length/2;i++){
    let p=hex.substring(i*2,i*2+2);
    rgba[i]=parseInt(p,16);
  }
  return {
    r: rgba[0],
    g: rgba[1],
    b: rgba[2],
    a: rgba[3]
  };
}