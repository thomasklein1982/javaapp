export function getMimeFromDataURL(dataurl){
  let pos=dataurl.indexOf(";");
  let part=dataurl.substring(5,pos);
  return part;
}