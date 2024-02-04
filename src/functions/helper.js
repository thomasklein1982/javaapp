
export function download(data,filename,mime,noDownload){
  window.URL =  window.URL || window.webkitURL;
  if(!filename) filename="Download.txt";
  if(!mime || !mime.substring){
    var split=filename.split(".");
    if(split.length>0){
      var extension=split[split.length-1];
      mime="text/"+extension;
    }else{
      var extension="txt";
      mime="text";
      filename+=extension;
    }
  }else{
    if(mime.substring(0,4).toLowerCase()!="text"){
      /*dataurl*/
      var bin = window.atob(data.split(',')[1]);
      var arrayBuffer=new ArrayBuffer(bin.length),
      data=new Uint8Array(arrayBuffer);
      for(var i=0;i<bin.length;i++) data[i]=bin.charCodeAt(i);
    }
  }
  var blob = new Blob([data], {type: mime});
  var downloadAnchor=document.createElement("a");
  downloadAnchor.style.display="none";
  document.body.appendChild(downloadAnchor);
  if(noDownload!==true){
    downloadAnchor.download = filename;
  }else{
    downloadAnchor.target="_blank";
  }
  let objectURL=window.URL.createObjectURL(blob);
  downloadAnchor.href=objectURL;
  downloadAnchor.dataset.downloadurl = [mime, downloadAnchor.download, downloadAnchor.href].join(':');
  downloadAnchor.click();
  setTimeout(function(){
    window.URL.revokeObjectURL(objectURL);
  },200);
  document.body.removeChild(downloadAnchor);
}

function uploadCallback(callback,options){
  //alert("upload callback");
  var fi=document.createElement("input");
  fi.type="file";
  if(options && options.accept) fi.accept=options.accept;
  fi.name="files[]";
  fi.style.display="none";
  document.body.appendChild(fi);
  if(options && options.multi){fi.multiple=true;}
  
  fi.handleCallback=()=>{
    //alert("handle callback");
    var fileReader=new FileReader();
    var file=fi.files[0];
    fileReader.addEventListener("load",(e)=>{
      document.body.removeChild(fi);
      var code=e.target.result;
      callback(code,file.name,file.type);
      //alert("called callback");
    },false);
    if(options &&options.dataURL){
      fileReader.readAsDataURL(file);
    }else{
      fileReader.readAsText(file);
    }
  };

  fi.addEventListener("change",(e)=>{
    //alert("on change");
    fi.handleCallback();
  },false);
  fi.click();
  //
}

export async function upload(options){
  var p=new Promise(function(resolve,reject){
    uploadCallback(function(code,fileName,mime){
      resolve({
        code: code,
        fileName: fileName,
        mime: mime
      });
    },options);
  });
  var q=await p;
  return q;
}

export async function saveLocally(key,data){
  var s=JSON.stringify(data);
  //var c=LZString.compress(s);
  //let c=s;
  await localforage.setItem(key,s);
}

export async function loadLocally(key){
  var c=await localforage.getItem(key);
  if(c===undefined || c===null){
    return null;
  }
  //var s=LZString.decompress(c);
  try{
    var data=JSON.parse(c);
  }catch(e){
    c=LZString.decompress(c);
    data=JSON.parse(c);
  }
  return data;
}

export function concatArrays(array,array2){
  //if(!array || !array2) return;
  for(let a of array2){
    array.push(a);
  }
}

export function splitValues(s,sep,allowEmptyValues){
  let inString=false;
  let v="";
  let values=[];
  for(let i=0;i<s.length;i++){
    let c=s.charAt(i);
    if(c===sep){
      if(inString){
        v+=c;
      }else{ 
        if(allowEmptyValues || v.length>0){
          values.push(v);
          v="";
        }
      }
    }else if(c=='"'){
      if(inString){
        values.push(v);
        v="";
      }
      inString=!inString;
    }else{
      v+=c;
    }
  }
  if(v){
    if(inString){
      throw "\" erwartet";
    }
    values.push(v);
  }
  return values;
}