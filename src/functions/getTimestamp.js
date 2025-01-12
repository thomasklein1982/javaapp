export function getTimestamp(d){
  let h=twoDigits(d.getHours());
  let m=twoDigits(d.getMinutes());
  let s=twoDigits(d.getSeconds());
  return h+":"+m+":"+s;
}

function twoDigits(x){
  if(x<10) return "0"+x;
  else return x+"";
}