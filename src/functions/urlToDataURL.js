export async function urlToDataURL(url){
  const image = new Image();
  image.crossOrigin='anonymous';
  let p=new Promise((resolve,reject)=>{
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;
      ctx.drawImage(image, 0, 0);
      try{
        const dataUrl = canvas.toDataURL();
        resolve(dataUrl);
      }catch(e){
        resolve(null);
      }
    }
  });
  image.src = url;
  let q = await p;
  return q;
}