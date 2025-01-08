export async function urlToDataURL(url){
  
  let data=await fetch(url);
  if(!data) return null;
  const blob = await data.blob();
  var reader  = new FileReader();
  let p=new Promise((resolve,reject)=>{
    reader.onload=(ev)=>{
      let b64 = ev.target.result; // your gif in base64 here
      resolve(b64);
    };
    reader.onerror=(ev)=>{
      return null;
    };
    reader.readAsDataURL(blob);
  });
  return await p;

}