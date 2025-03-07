/**jede definierte Klasse benötigt eine $constructor-Methode anstelle des constructor!
 * neue Objekte der definierten Klassen müssen mit $new(Klasse,Parameter,...) erzeugt werden 
 * statt mit new Klasse(Parameter,...)*/


function additionalJSCode(){
  window.mousePressed=false;
  window.addEventListener('DOMContentLoaded', ()=>{
    document.body.addEventListener("pointerenter",(ev)=>{
      window.mousePressed=ev.buttons>0;
    },false);
    window.addEventListener("pointerdown",(ev)=>{
      try{
        ev.target.releasePointerCapture(ev.pointerId);
      }catch(e){}
      window.mousePressed=ev.buttons>0;
    },false);
    window.addEventListener("pointerup",(ev)=>{
      window.mousePressed=false;
    },false);
    document.body.addEventListener("pointerleave",(ev)=>{
      window.mousePressed=ev.buttons>0;
    },false);
    window.addEventListener("message", async (ev)=>{
      let message=ev.data;
      if(message.type==="showPage"){
        let pageName=message.data;
        let page=window.uiClazzObjects[pageName];
        if(!page) return;
        page.show();
      }else if(message.type==="reportError"){
        console.log("Fehler!",message.data);
        if(window.parent){
          window.parent.postMessage(message);
        }
        //alert("Fehler Datei "+message.data.file+" in Zeile "+message.data.line+": "+message.data.error);
      }else if(message.type==="callMethod"){
        try{
          let res=await $main[message.data.methodName].apply($main,message.data.args);
          ev.currentTarget[0].$fullfillPromise(res);
        }catch(e){
          
        }
        //alert("Fehler Datei "+message.data.file+" in Zeile "+message.data.line+": "+message.data.error);
      }
    }, true);
  }, false);

  JSON.$constructor=function(){ };

  function $u(v){if(v===undefined){throw $new(Exception,"Undefinierter Wert.")} return v;}
  function $N(v,name){if(v===null){throw $new(Exception,"NullPointerException: Der Wert von '"+name+"' ist null, deshalb kannst du nicht auf Methoden oder Attribute zugreifen.")} return v;}
  function $v(v){if(Number.isNaN(v*1)){throw $new(Exception,"'"+v+"' ist keine Zahl.")}else{return v*1;}}
  function $i(v){if(Number.isNaN(v*1)){throw $new(Exception,"'"+v+"' ist keine Zahl.")}else{v*=1; return v>=0? Math.floor(v):Math.ceil(v);}}
  function $m(v,message,line){if(v===undefined){throw $new(Exception,message,line)}else{return v;}}
  function $ret(v){$App.debug.decCallDepth(); return v;}
  function $n(a){return a;}
  function $s(v){if(v) return v+"";else return v;}
  Object.defineProperty(String.prototype,'len',{value: function(){return this.length;}, writeable: false});
  function $isInstanceOf(obj,typename){

  }

  function $randomInt(obj, min, max){
    return $Exercise.random(min,max);
  }

  function $changePreviewSelection(previewID){
    console.log(previewID);
    // if($uiSelectedComponent){let c=$uiSelectedComponent;\nc.style.filter='none';c.style.backgroundColor=c.oldBackground;\nc.style.borderWidth=c.oldBorderWidth;\nc.style.borderStyle=c.oldBorderStyle;\nc.style.borderColor=c.oldBorderColor;}\nlet c=document.querySelectorAll('[data-id='+ev.data.id+']');\nif(c){\nc.oldBackground=c.style.backgroundColor;\nc.oldBorderWidth=c.style.borderWidth;\nc.oldBorderStyle=c.style.borderStyle;\nc.oldBorderColor=c.style.borderColor;\nc.style.backgroundColor='gray';\nc.style.borderWidth='1pt';\nc.style.borderStyle='dashed';\nc.style.borderColor='gold';\nc.style.filter='opacity(0.5)';\n$uiSelectedComponent=c;\n}else{\n$uiSelectedComponent=null;\n}\n}\n
    if(!window.$previewSelectedComponents){
      window.$previewSelectedComponents=[];
    }
    for(let i=0;i<window.$previewSelectedComponents.length;i++){
      let c=window.$previewSelectedComponents[i];
      for(let a in c.oldStyle){
        c.style[a]=c.oldStyle[a];
      }
      delete c.oldStyle;
    }
    window.$previewSelectedComponents=document.querySelectorAll('[data-id='+previewID+']');
    let style={
      backgroundColor: "gray",
      opacity: "0.5",
      borderWidth: "1pt",
      borderColor: "gold",
      borderStyle: "dashed"
    };
    for(let i=0;i<window.$previewSelectedComponents.length;i++){
      let c=window.$previewSelectedComponents[i];
      c.oldStyle={};
      for(let a in style){
        c.oldStyle[a]=c.style[a];
        c.style[a]=style[a];
      }
    }
  }

  async function $createAllUIClazzes(constructors){
    if(window.uiClazzObjects) return;
    window.uiClazzObjects={};
    for(let i=0;i<constructors.length;i++){
      let c=constructors[i];
      await c.$createSelf();
      window.uiClazzObjects[c.name]=c;
    }
  }

  function $serveFile(name,content,fileType){
    if(!window.$servedFiles) window.$servedFiles={};
    let mimes={
      png: "image/png",
      jpg: "image/jpg",
      gif: "image/gif",
      jpeg: "image/jpg",
      txt: "text/plain",
      html: "text/html",
      htm: "text/html",
      js: "text/javascript",
      json: "application/json",
      mp3: "audio/mpeg",
      mp4: "video/mp4",
      otf: "font/otf",
      pdf: "application/pdf",
      svg: "image/svg+xml",
      tif: "image/tiff",
      tiff: "image/tiff",
      ttf: "font/ttf",
    };
    let mime=mimes[fileType];
    const blob = URL.createObjectURL(
      new Blob([content], { type: mime })
    );
    if(window.$servedFiles[name]){
      URL.revokeObjectURL(window.$servedFiles[name].url);
    }
    window.$servedFiles[name]={
      url: blob,
    }

  }

  function $new(constructor){
    let o;
    try{
      o=new constructor();
    }catch(e){
      o=new constructor.constructor();
      return o;
    }
    if(!o.$constructor){
      return o;
      //console.error("error in $new!!!",constructor);
    }
    let args=[];
    for(let i=1;i<arguments.length;i++){
      args.push(arguments[i]);
    }
    o.$constructor.apply(o,args);
    return o;
  }

  function $createInterfaceInstance(name,methodname,func){
    let o=new Object();
    o[methodname]=func;
    return o;
  }

  async function $handleOnAction(ev){
    $handleEvent.call(this,"Action",ev);
  }

  async function $handleOnPointerMove(ev){
    $handleEvent.call(this,"MouseMove",ev,(ev,comp)=>{
      comp.$updateMousePosition(ev);
      return [comp.getMouseX(),comp.getMouseY(),ev.buttons>0,comp];
    });
  }

  async function $handleOnPointerDown(ev){
    $handleEvent.call(this,"MouseDown",ev,(ev,comp)=>{
      comp.$updateMousePosition(ev);
      return [comp.getMouseX(),comp.getMouseY(),comp];
    });
  }

  async function $handleOnPointerUp(ev){
    $handleEvent.call(this,"MouseUp",ev,(ev,comp)=>{
      comp.$updateMousePosition(ev);
      return [comp.getMouseX(), comp.getMouseY(), comp];
    });
  }

  async function $handleEvent(eventname,ev,argsFunc){
    let comp=this.component;
    if(comp.$actionListeners && comp.$actionListeners.length>0){
      for(let i=0;i<comp.$actionListeners.length;i++){
        let al=comp.$actionListeners[i];
        let event=$new(ActionEvent,comp,0,comp.actionCommand,Date.now());
        al.actionPerformed(event);
        //source,id,command,when
      }
      return;
    }
    let listener=comp["$triggerOn"+eventname];
    if (listener) {
        ev.stopPropagation();
        let args;
        if(argsFunc){
          args=argsFunc(ev,comp);
        }else{
          args=[comp];
        }
        let handler=listener["on"+eventname];
        if(handler && handler.apply){
          await handler.apply(listener,args);
          return;
        }
        let panel=comp.getPanel();
        while(panel){
          let handler=panel["on"+eventname];
          if(handler && handler.call){
            let handled=await handler.apply(panel,args);//panel["on"+eventname](comp);
            if(handled!==false){
              return;
            }
          }
          panel=panel.getPanel();
        }
        if($main && $main["on"+eventname]){
          $main["on"+eventname].apply($main,args);
        }
    }
  }

  function $beep(object,frequency, volume, duration, type){
    if(!type) type="sine";
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    gainNode.gain.value = volume;
    oscillator.frequency.value = frequency;
    oscillator.type = type;

    oscillator.start();

    setTimeout(
      function() {
        oscillator.stop();
      },
      duration
    );
  }

  $arrayCheckBounds=function(array,index){
    if(index>=array.length || index<0){
      var m="Index "+index+" liegt ausserhalb der Array-Grenzen von 0 bis "+(array.length-1);
      console.error(m);
      throw m;
    }
    return this;
  };
  $arrayGet=function(array,index){
    $arrayCheckBounds(array,index);
    return array[index];//this.privateGet(index,this.values,0);
  };
  $arraySet=function(array,index,value){
    $arrayCheckBounds(array,index);
    array[index]=value;
  }

  $createArrayValues=function(type,dim){
    if(dim.length===1){
      var array=[];
      let initialValue;
      if(type.substring){
        if(type.charAt(0)===type.charAt(0).toUpperCase()){
          initialValue=null;
        }else if(type==="boolean"){
          initialValue=false;
        }else{
          initialValue=0;
        }
      }else{
        if("initialValue" in type){
          initialValue=type.initialValue;
        }else{
          initialValue=null;
        }
      }
      for(var i=0;i<dim[0];i++){
        array.push(initialValue);
      }
      return array;
    }else{
      var array=[];
      var newDim=[];
      for(let i=1;i<dim.length;i++){
        newDim.push(dim[i]);
      }
      for(var i=0;i<dim[0];i++){
        var subArray=$createArray(type, newDim);
        array.push(subArray);
      }
      return array;
    }
  }

  /*
   * String type: 'int' etc.
   * int dim
   * type[] values
   */
  function $createArray(type, dim, values){
    let array;
    if(Array.isArray(dim)){
      array=$createArrayValues(type,dim);
      array.$dim=dim;
    }else{
      array=values;
      array.$dim=[];
      var a=values;
      while(a && Array.isArray(a)){
        array.$dim.push(a.length);
        a=a[0];
      }
    }
    if(typeof type==="string"){
      array.$type=type;
    }else{
      array.$type=type.name;
    }
    return array;
  };

  function $getElementById(uiclazz, id){
    //return new HTMLElement(document.getElementById(uiclazz.constructor.name+"-"+id));
    let e=document.getElementById(id);
    if(!e) return null;
    return $new(HTMLElement,e);
  }

  function $getFromArray(array,index){
    if(!array){
      throw $new(Exception,"NullPointerException: Kann nicht aus dem Array laden, weil es null ist.");
    }
    if(array.$type){
      return $arrayGet(array,index);
    }else{
      return array[index];
    }
  }

  function $setInArray(array,index,value,assignOp){
    if(!array){
      throw $new(Exception,"NullPointerException: In dem Array kann nichts gespeichert werden, weil es null ist.");
    }
    if(assignOp==="+="){
      value=$getFromArray(array,index)+value;
    }else if(assignOp==="-="){
      value=$getFromArray(array,index)-value;
    }else if(assignOp==="*="){
      value=$getFromArray(array,index)*value;
    }else if(assignOp==="/="){
      value=$getFromArray(array,index)/value;
    }else if(assignOp==="%="){
      value=$getFromArray(array,index)%value;
    }
    if(array.$type){
      $arraySet(array,index,value);
    }else{
      array[index]=value;
    }
  }

  function $getIndexOfComponentInParent(comp){
    var index=0;
    while(comp.previousElementSibling){
      index++;
      comp=comp.previousElementSibling;
    }
    return index;
  }

  function $castObject(object,destTypeName,destDimension){
    if(object===null) return object;
    let m="Objekt kann nicht gecastet werden";
    if(destDimension>0){
      let dim=[];
      let v=object;
      for(let i=0;i<destDimension;i++){
        dim.push(v.values.length);
        v=v.values[0];
      }
      let array=$createArray({name: destTypeName},dim);
      for(let i=0;i<object.values.length;i++){
        let v=object.values[i];
        array.values[i]=$castObject(v,destTypeName,destDimension-1);
      }
      return array;
    }
    let destPrimitive=destTypeName.charAt(0)===destTypeName.charAt(0).toLowerCase();
    let isType=typeof object;
    let isPrimitive=isType!=="object" && isType!=="string";
    
    var instOf;
    eval("instOf=(object instanceof "+destTypeName+");");
    var destRuntimeInfos=$clazzRuntimeInfos[destTypeName];
    if(destRuntimeInfos){
      eval("dest=new "+destTypeName+"();");
      for(let a in destRuntimeInfos.attributes){
        let at=destRuntimeInfos.attributes[a];
        if(!(a in object)){
          m+=". Attribut '"+a+"' nicht vorhanden.";
          App.console.log(m);
          throw m;
        }
        dest[a]=$castObject(object[a],at.baseType,at.dimension);
      }
    }else{
      return object;
    }
    return dest;
  }

  function $object_toString(obj){
    return obj.toString();
  }

  function $object_serialize(obj){
    try{
      return JSON.stringify(obj);
    }catch(e){
      throw {
        message: e.message
      };
    }
  }

  function $array_deserialize(type,dimension,data){
    //TODO: mehrdimensionale Arrays
    if(!data) return null;
    let array=$createArray(type, [data.length]);
    let first=type.charAt(0);
    let creator=null;
    if(first!==first.toLowerCase()){
      creator = Function("return new "+type+"();");
    }
    for(let i=0;i<data.length;i++){
      if(creator){
        let object=creator();
        array[i]=$object_deserialize_internal(object,data[i]);
      }else{
        array[i]=data[i];
      }
    }
    return array;
  }

  function $object_deserialize_internal(object,data){
    if(data===null || data===undefined) return null;
    try{
      let infos=$clazzRuntimeInfos[object.constructor.prototype.constructor.name];
      if(infos){
        for(a in infos.attributes){
          if(data[a]!==undefined){
            let attr=infos.attributes[a];
            if(attr.dimension>0){
              object[a]=$array_deserialize(attr.baseType,attr.dimension,data[a]);
            }else{
              let type=attr.baseType;
              let first=type.charAt(0);
              if(type==="String" || first===first.toLowerCase()){
                //primitiv oder string
                object[a]=data[a];
              }else{
                let creator = Function("return new "+type+"();");
                object[a]=creator();
                object[a]=$object_deserialize_internal(object[a],data[a]);
              }
            }
          }
        }
      }else{
        //keine eigene Klasse
        for(a in data){
          if(data[a]!==undefined){
            object[a]=data[a];
          }
        }
      }
      return object;
    }catch(e){
      throw {
        message: "String konnte nicht deserialisiert werden\n"+e
      }
    }
  }

  function $object_deserialize(obj,s){
    try{
      let data=JSON.parse(s);
      let object=new obj();
      return $object_deserialize_internal(object,data);
    }catch(e){
      throw {
        message: "String konnte nicht deserialisiert werden\n"+e
      }
    }
  }

  async function $asyncFunctionCallVariableObject(object,objectWithMethod,methodname,argumentsArray){
    let w=await objectWithMethod[methodname].apply(object,argumentsArray);
    return w;
  };

  class $File{
    $constructor(name){
      this.fileName=name;
      this.data="";
      this.contentIsDataURL=false;
    }
  }

  function $getFileName(obj){
    return obj.fileName;
  }

  function $getFileContentAsString(obj){
    let data=obj.data;
    data=data.split(",");
    data=data[data.length-1];
    data=window.atob(data);
    data=data.replace(/\r\n/g,"\n")
    return data;
  }

  function $setFileContentAsString(obj,data){
    if(!data) data="";
    obj.contentIsDataURL=false;
    obj.data=window.btoa(data.replace(/\r\n/g,"\n"));
  }

  function $setFileContent(obj,data){
    obj.data=data;
    obj.contentIsDataURL=true;
  }
  function $getFileContent(obj){
    return obj.data;
  }

  function $downloadFile(obj){
    let data=obj.data;
    if(obj instanceof $File && !obj.contentIsDataURL){
      data=window.atob(data);
    }
    $download(data,obj.fileName,obj.contentIsDataURL);
  }

  function $download(data,filename,isDataURL){
    window.URL =  window.URL || window.webkitURL;
    if(!filename) filename="Download.txt";
    let blob,mime;
    if(isDataURL){
      let pos=data.indexOf(",");
      let before=data.substring(0,pos);
      let after=data.substring(pos+1);
      let byteString=window.atob(after);
      mime=before.split(":")[1].split(";")[0];
      let ab=new ArrayBuffer(byteString.length);
      let ia=new Uint8Array(ab);
      for(let i=0;i<byteString.length;i++){
        ia[i]=byteString.charCodeAt(i);
      }
      blob=new Blob([ab],{type: mime});
    }else{
      var split=filename.split(".");
      if(split.length>0){
        var extension=split[split.length-1].toLowerCase();
        //mime="text/"+extension;
      }else{
        var extension="txt";
        //mime="text";
        filename+=extension;
      }
      let mimes={
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpg",
        txt: "text/plain",
        html: "text/html",
        htm: "text/html",
        js: "text/javascript",
        json: "application/json",
        mp3: "audio/mpeg",
        mp4: "video/mp4",
        otf: "font/otf",
        pdf: "application/pdf",
        svg: "image/svg+xml",
        tif: "image/tiff",
        tiff: "image/tiff",
        ttf: "font/ttf",
      };
      mime=mimes[extension];
      if(!mime) mime="text/plain";
      
      blob = new Blob([data], {type: mime});
    }
    var downloadAnchor=document.createElement("a");
    downloadAnchor.style.display="none";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.download = filename;
    let objectURL=window.URL.createObjectURL(blob);
    downloadAnchor.href=objectURL;
    downloadAnchor.dataset.downloadurl = [mime, downloadAnchor.download, downloadAnchor.href].join(':');
    downloadAnchor.click();
    setTimeout(()=>{
      window.URL.revokeObjectURL(objectURL);
    },200);
    document.body.removeChild(downloadAnchor);
  }

  async function $upload(){
    var p=new Promise(function(resolve,reject){
      $App.$uploadCallback(function(data,fileName,mime){
        //data=data.replace(/\r\n/g,"\n");
        resolve({
          data: data,
          fileName: fileName,
          mime: mime
        });
      },{dataURL: true});
    });
    var q=await p;
    return q;
  }

  function $toRadians(obj,x){
    return x*Math.PI/180;
  }

  function $toDegrees(obj,x){
    return x*180/Math.PI;
  }

  // <div id="dialog-backdrop" style="display: none">
  //   <div id="dialog-frame">
  //     <div id="dialog-content">Hallo</div>
  //     <input type="text" id="dialog-input" style="display: none"></input>
  //     <div class="dialog-footer" id="dialog-footer-alert" style="display: none">
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('alert')">OK</button>
  //     </div>
  //     <div class="dialog-footer" id="dialog-footer-confirm" style="display: none">
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('yes')">Ja</button>
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('no')">Nein</button>
  //     </div>
  //     <div class="dialog-footer" id="dialog-footer-prompt" style="display: none">
  //       <button class="dialog-footer-button" onclick="$clickDialogButton('prompt')">OK</button>
  //     </div>
  //   </div>
  // </div>
  function $setupDialog(){
    if($App.customDialog) return;
    $App.customDialog={
      backdrop: document.createElement("div"),
      frame: document.createElement("div"),
      content: document.createElement("div"),
      input: document.createElement("input"),
      footerAlert: document.createElement("div"),
      footerPrompt: document.createElement("div"),
      footerConfirm: document.createElement("div"),
      resolve: null
    };
    let ui=$App.customDialog;
    ui.backdrop.style="display: none";
    ui.backdrop.id="dialog-backdrop";
    ui.frame.id="dialog-frame";
    ui.backdrop.appendChild(ui.frame);
    ui.content.id="dialog-content";
    ui.frame.appendChild(ui.content);
    ui.input.id="dialog-input";
    ui.input.style="display: none";
    ui.frame.appendChild(ui.input);
    ui.footerAlert.className="dialog-footer";
    ui.footerAlert.id="dialog-footer-alert";
    let button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('alert')};
    button.innerHTML="OK";
    ui.footerAlert.appendChild(button);
    ui.frame.appendChild(ui.footerAlert);
    
    ui.footerConfirm.id="dialog-footer-confirm";
    ui.footerConfirm.className="dialog-footer";
    button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('yes')};
    button.innerHTML="Ja";
    ui.footerConfirm.appendChild(button);
    button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('no')};
    button.innerHTML="Nein";
    ui.footerConfirm.appendChild(button);
    ui.frame.appendChild(ui.footerConfirm);

    ui.footerPrompt.id="dialog-footer-prompt";
    ui.footerPrompt.className="dialog-footer";
    button=document.createElement("button");
    button.className="dialog-footer-button";
    button.onclick=function(){$clickDialogButton('prompt')};
    button.innerHTML="OK";
    ui.footerPrompt.appendChild(button);
    ui.frame.appendChild(ui.footerPrompt);
    document.body.appendChild(ui.backdrop);
  }

  $clickDialogButton=function(button){
    if(button==="alert"){
      $App.customDialog.resolve();
    }else if(button==="yes"){
      $App.customDialog.resolve(true);
    }else if(button==="no"){
      $App.customDialog.resolve(false);
    }else if(button==="prompt"){
      $App.customDialog.resolve($App.customDialog.input.value);
    }
  }

  function $dataURLtoBlob(dataURL) {
    var mime = dataURL.split(',')[0].split(':')[1].split(';')[0];
    var binary = window.atob(dataURL.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: mime});
  }

  $getAssetObjectURL=function(assetName){
    let asset=$App.assets[assetName];
    if(!asset) return assetName;
    if(!asset.objectURL){
      asset.objectURL=URL.createObjectURL($dataURLtoBlob(asset.url));
    }
    return asset.objectURL;
  }

  $revokeAllAssetObjectURLs=function(){
    for(let a in $App.assets){
      let asset=$App.assets[a];
      if(!asset.objectURL) continue;
      URL.revokeObjectURL(asset.objectURL);
    }
    console.log("all revoked");
  }

  window.onbeforeunload=function(){
    $revokeAllAssetObjectURLs();
  }

  $handleAssetsInCSSCode=function(cssCode){
    return $handleAssetsInString(cssCode,"url(",")");
  }

  $handleAssetsInString=function(code,before,after){
    if(!code || !code.split) return code;
    if(!before) before="";
    if(!after) after="";
    let s=code.split("asset(");
    let t="";
    for(let i=0;i<s.length;i++){
      if(i===0){
        t+=s[i];
      }else{
        let pos=s[i].indexOf(")");
        let assetName=s[i].substring(0,pos);
        t+=before+$getAssetObjectURL(assetName)+after;
        t+=s[i].substring(pos+1);
      }
    }
    let pos=code.indexOf("<img");
    while(pos>=0){
      let pos2=code.indexOf(">",pos);
      if(pos2>=0){
        let part=code.substring(pos+4,pos2).trim();
        let res=/src\s*=\s*["']([^ '"]*)/.exec(part);
        if(res && res[1]){
          let assetName=res[1].trim();
          let asset=$getAssetObjectURL(assetName);
          if(asset!==assetName){
            let rep=before+asset+after;
            pos=code.indexOf(res[1],pos);
            t=t.substring(0,pos)+rep+t.substring(pos+res[1].length);
            console.log(t);
          }
        }
      }
      pos=code.indexOf("<img",pos+1);
    }
    return t;
  }

  $showDialog=function(message,input,footerAlert,footerPrompt,footerConfirm){
    $App.handleModalDialog();
    $App.customDialog.input.value=null;
    $App.customDialog.content.innerHTML=$handleAssetsInString(message);
    $App.customDialog.input.style.display=input;
    $App.customDialog.footerAlert.style.display=footerAlert;
    $App.customDialog.footerPrompt.style.display=footerPrompt;
    $App.customDialog.footerConfirm.style.display=footerConfirm;
    $App.customDialog.backdrop.style.display="";
    $App.customDialog.frame.style.transition="";
    $App.customDialog.frame.style.opacity=0;
    $App.customDialog.frame.style.transition="opacity 0.5s";
    setTimeout(()=>{
      $App.customDialog.frame.style.opacity=1;
    },10);
  }

  App.alert=async function(message){
    $setupDialog();
    $showDialog(message,"none","","none","none");
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
  };

  App.prompt=async function(message,defaultValue){
    $setupDialog();
    $App.customDialog.input.type="text";
    $showDialog(message,"","none","","none");
    if(defaultValue!==undefined){
      $App.customDialog.input.value=defaultValue;
    }
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
    return q;
  };

  App.promptNumber=async function(message,defaultValue){
    $setupDialog();
    $App.customDialog.input.type="number";
    $showDialog(message,"","none","","none");
    if(defaultValue!==undefined){
      $App.customDialog.input.value=defaultValue;
    }
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
    return q;
  };

  App.confirm=async function(message){
    $setupDialog();
    $App.handleModalDialog();
    $showDialog(message,"none","none","none","");
    let p=new Promise((resolve,reject)=>{
      $App.customDialog.resolve=resolve;
    });
    let q=await p;
    $App.customDialog.backdrop.style.display="none";
    return q;
  };

  function $StringFormat(StringClazz,format,object){
    let v=format;
    if(!format) return format;
    let pos=format.indexOf("%s");
    if(pos>=0){
      return format.substring(0,pos)+object+format.substring(pos+2);
    }
    let m=/%.(\d+)f/.exec(format);
    if(m){
      let z=object*1;
      if(isNaN(z)){
        return format;
      }
      z=z.toFixed(m[1]*1);
      return format.replace("%."+m[1]+"f",z);
    }
    
    return format;
  }

  function $StringCharAtChar(string,index){
    let s=$StringCharAtString(string,index);
    return new $Char(s);
  }

  function $StringCharAtString(string,index){
    let s=string.charAt(index);
    return s;
  }

  function $StringReplaceAll(string,s,r){
    var regexp=new RegExp(s,"g");
    return string.replace(regexp,r);
  }
  
  function $StringReplaceFirst(string,s,r){
    var regexp=new RegExp(s);
    return string.replace(regexp,r);
  }

  function $StringSplit(string,regexp,limit){
    var r=new RegExp(regexp);
    var s=string.split(r,limit);
    var a=$createArray("String",s.length,s);
    return a;
  }

  function $StringContains(string,string2){
    return string.indexOf(string2)>=0;
  }

  function $StringApplyRegExp(string,regexp,flags){
    if(!flags) flags="";
    try{
      var r=new RegExp(regexp,flags);
    }catch(e){
      throw $new(Exception,"Dieser reguläre Ausdruck ist syntaktisch nicht korrekt: \n"+e);
      throw new Exception("Dieser reguläre Ausdruck ist syntaktisch nicht korrekt: \n"+e);
    }
    var res=r.exec(string);
    if(res){
      if(flags.indexOf("g")>=0){
        /**wiederhole, bis du alle matches hast */
        var match=res;
        while(match){
          match=r.exec(string);
          if(!match) break;
          for(let i=0;i<match.length;i++){
            res.push(match[i]);
          }
        }
      }
      for(let i=0;i<res.length;i++){
        if(res[i]===undefined){
          res[i]=null;
        }
      }
      return res;
    }else{
      return null;
    }
  }

  function $StringCompareTo(string1,string2){
    var l1=string1.length;
    var l2=string2.length;
    for(var i=0;i<l1;i++){
      if(i>=l2){
        return l1-l2;
      }
      var c1=string1.codePointAt(i);
      var c2=string2.codePointAt(i);
      if(c1!==c2){
        return c1-c2;
      }
    }
    return l2-l1;
  }

  function $StringCompareToIgnoreCase(string1,string2){
    return $StringCompareTo(string1.toLowerCase(),string2.toLowerCase());
  }

  function $StringEquals(string1,string2){
    return string1===string2;
  }

  function $StringEqualsIgnoreCase(string1,string2){
    return $StringEquals(string1.toLowerCase(),string2.toLowerCase());
  }

  function $StringMatches(string,regexp){
    var r=new RegExp(regexp);
    return r.test(string);
  }

  function onAction(element){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onAction){
      $main.onAction(element.component);
    }
  }

  function onNextFrame(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onNextFrame){
      $main.onNextFrame();
    }else{
      delete window.onNextFrame;
    }
  }

  function onMouseDown(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onMouseDown){
      $main.onMouseDown();
    }
  }

  function onMouseUp(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onMouseUp){
      $main.onMouseUp();
    }
  }

  function onMouseMove(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onMouseMove){
      $main.onMouseMove();
    }
  }

  function onTimeout(name){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onTimeout){
      $main.onTimeout(name);
    }
  }
  
  function onGamepadDown(button){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onGamepad){
      $main.onGamepad(button);
    }
  }

  function onGamepadUp(button){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onGamepadRelease){
      $main.onGamepadRelease(button);
    }
  }

  window.onTileDraw=async function onTileDraw(x,y,type){
    if($main && $main.onTileDraw){
      await $main.onTileDraw(x,y,type);
    }else{
      delete window.onTileDraw;
    }
  }

  window.onMessage=function onMessage(sender,message){
    if($main && $main.onMessage){
      $main.onMessage(sender,message);
    }else{
      delete window.onMessage;
    }
  }

  class ActionListener{
    onAction(){}
  }

  class Integer{
    constructor(v){
      this.value=v;
    }
    static parseInt(s, radix){
      if(!radix) radix=10;
      let v=s*1;
      if(v+""===s+""){
        return parseInt(s,radix);
      }else{
        throw $new(Exception,"Dieser String kodiert keine ganze Zahl:\n"+s);
      }
    }
    static valueOf(v){
      return new Integer(v);
    }
    compareTo(a){
      if(!a) throw $new(Exception,"compareTo darf nicht auf null angewendet werden");
      return this.value-a.value;
    }
  }

  class Double{
    constructor(v){
      this.value=v;
    }
    static parseDouble(s){
      let v=s*1;
      if(v+""===s+""){
        return v;
      }else{
        throw $new(Exception,"Dieser String kodiert keine Kommazahl:\n"+s);
      }
    }
    static valueOf(v){
      return new Double(v);
    }
  }

  class Boolean{
    constructor(v){
      this.value=v;
    }
    static parseBoolean(s){
      if(s==="true"){
        this.value=true;
      }else if(s==="false"){
        this.value=false;
      }else{
        throw $new(Exception,"Dieser String kodiert keinen Wahrheitswert:\n"+s);
      }
    }
    static valueOf(v){
      return new Boolean(v);
    }
  }

  class Char{
    constructor(v){
      this.value=v;
    }
    static parseChar(s){
      let v=s+"";
      if(v.length===1){
        this.value=v;
      }else{
        throw $new(Exception,"Dieser String kodiert keinen Character:\n"+s);
      }
    }
    static valueOf(v){
      return new Char(v);
    }
  }

  class PrintStream{
    $constructor(){}
    async println(text){
      console.println(text);
      await $Exercise.sleep(1);
    }
    async print(text){
      console.print(text);
      await $Exercise.sleep(1);
    }
  }

  class InputStream{
    $constructor(){}
    async read(){
      return await $App.console.read();
    }
  }

  class Storage{
    constructor(name,db){
      this.name=name;
      this.db=db;
    }
    static async getStorageNames(){
      if(!window.indexedDB) return null;
      let bases=await indexedDB.databases();
      let array=[];
      for(let i=0;i<bases.length;i++){
        array.push(bases[i].name);
      }
      return $createArray("String",array.length,array);
    }
    static deleteStorage(name){
      if(!window.indexedDB) return;
      indexedDB.deleteDatabase(name);
    }
    static async create(name){
      if(!window.indexedDB) return;
      let openRequest= window.indexedDB.open(name, 1);
      // Register two event handlers to act on the database being opened successfully, or not
      let p=new Promise((fulfill,reject)=>{
        
        openRequest.onerror = (event) => {
          throw $new(Exception,"Datenbank konnte nicht geladen werden");
        };

        openRequest.onsuccess = (ev) => {
          let db = ev.target.result;
          fulfill(db);
        };

        // This event handles the event whereby a new version of the database needs to be created
        // Either one has not been created before, or a new version number has been submitted via the
        // window.indexedDB.open line above
        //it is only implemented in recent browsers
        openRequest.onupgradeneeded = (event) => {
          let db = event.target.result;
          db.onerror = (event) => {
            throw $new(Exception,"Datenbank konnte nicht geladen werden");
          };
          let objectStore=db.createObjectStore('items', { keyPath: null });
        }; 
      });
      let db=await p;
      return new Storage(name,db);
    }
    async getKeys(){
      let keys;
      if(!window.indexedDB){
        keys=[];
        for (let i = 0; i < localStorage.length; i++) {
          keys.push(localStorage.key(i));
        }
      }else{
        const transaction = this.db.transaction(['items']);
        let p=new Promise((fulfill,reject)=>{
          const objectStore = transaction.objectStore('items');
          let request=objectStore.getAllKeys();
          request.onsuccess=(ev)=>{
            fulfill(ev.target.result);
          };
          request.onerror=(ev)=>{
            throw $new(Exception,"Die Keys konnten nicht abgerufen werden.");
          };
        });
        keys=await p;
      }
      return $createArray("String",1,keys);
    }
    async load(key){
      let item=await this.getItem(key);
      return item+"";
    }
    async loadObject(key){
      let item=await this.getItem(key);
      return item;
    }
    async save(key, value){
      return await this.setItem(key,value+"");
    }
    async saveObject(key, value){
      await this.setItem(key,value);
    }
    async getItem(key){
      if(!window.indexedDB) return localStorage.getItem(key);
      const transaction = this.db.transaction(['items']);
      let p=new Promise((fulfill,reject)=>{
        const objectStore = transaction.objectStore('items');
        let request=objectStore.get(key,"key");
        request.onsuccess=(ev)=>{
          fulfill(ev.target.result);
        };
      });
      let q=await p;
      return q;
    }
    remove(key){
      if(!window.indexedDB){
        localStorage.removeItem(key);
      }else{
        const transaction = this.db.transaction(['items'],'readwrite');
        const objectStore = transaction.objectStore('items');
        objectStore.delete(key);
      }
    }
    removeAll(){
      if(!window.indexedDB){
        localStorage.clear();
      }else{
        const transaction = this.db.transaction(['items'],'readwrite');
        const objectStore = transaction.objectStore('items');
        objectStore.clear();
      }
    }
    async setItem(key,item){
      if(!window.indexedDB) {
        try{
          localStorage.setItem(key,item);
          return true;
        }catch(e){
          return false;
        }
      }
      const transaction = this.db.transaction(['items'], 'readwrite');
      let p=new Promise((fulfill,reject)=>{
      
        // Report on the success of the transaction completing, when everything is done
        transaction.oncomplete = () => {
          fulfill();
        };

        // Handler for any unexpected error
        transaction.onerror = (ev) => {
          throw $new(Exception,"Datenbank-Fehler set item");
        };

        // Call an object store that's already been added to the database
        const objectStore = transaction.objectStore('items');

        // Make a request to add our newItem object to the object store
        const objectStoreRequest = objectStore.put(item,key);
        objectStoreRequest.onsuccess = (event) => {
          fulfill(true);
        };
        objectStoreRequest.onerror = (event) => {
          fulfill(false);
        };
      });
      //await p;
    }
  }

  class System{
    $constructor(){}
    static out=$new(PrintStream);
    static in=$new(InputStream);
    static storage=null;
    static time=App.time;
    static console(){
      return $App.console;
    }
    static setFPS(fps){
      if(fps<=0) return;
      $App.gameloop.FPS=fps;
    }
    static setNextFrameListener(listener){
      $App.gameloop.customHandler=listener;
    }
    static isMousePressed(){
      return window.mousePressed;
    }
    static isKeyPressed(key){
      return window.isKeyDown(key);
    }
    static async alert(message){
      await App.alert(message);
    }
    static async prompt(message, defaultValue){
      return await App.prompt(message, defaultValue);
    }
    static async confirm(message){
      return await App.confirm(message);
    }
    static async toast(message, position, duration){
      return await App.toast(message, position, duration);
    }
  }

  window.$asyncInitFunctions.push(async ()=>{
    System.storage=await Storage.create("javaapp-standard-storage");
  });

  class JComponent{
    $constructor(){
      this.x=0;
      this.y=0;
      this.width=1;
      this.height=1;
      this.$el=null;
      this.actionCommand="";
      this.$eventListeners={};
      this.$triggerOnAction=false;
      this.$triggerOnMouseDown=false;
      this.$triggerOnMouseUp=false;
      this.$triggerOnMouseMove=false;
      this.$standardCSSClasses="__jcomponent";
      this.$actionListeners=[];
      this.transform={
        rotation: 0,
        flippedH: false,
        flippedV: false
      }
      this.sizeChanged=true;
      this.setDirection(0);

    }
    flip(){
      this.transform.flippedH=true;
      this.updateTransform();
    }
    unflip(){
      this.transform.flippedH=false;
      this.updateTransform();
    }
    isFlipped(){
      return this.transform.flippedH;
    }
    addEventListener(type, listener){
      this.$el.addEventListener(type,listener.actionPerformed,false);
    }
    getMouseX(){
      return 0;
    }
    getMouseY(){
      return 0;
    }
    getDistance(comp){
      let dx=comp.getX()-this.getX();
      let dy=comp.getY()-this.getY();
      return Math.sqrt(dx*dx+dy*dy);
    }
    getPixelWidth(){
      return this.$el.clientWidth;
    }
    getPixelHeight(){
      return this.$el.clientHeight;
    }
    $updateMousePosition(ev){}
    querySelector(selector){
      try{
        let e=this.$el.querySelector(selector);
        if(!e) return null;
        if(!e.component) e.component=$new(HTMLElement,e);
        return e.component;
      }catch(e){
        throw $new(Exception,"Fehlerhafter Selektor\n"+e);
      }
    }
    querySelectorAll(selector){
      try{
        let es=this.$el.querySelectorAll(selector);
        if(!es) return null;
        let comps=[];
        for(let i=0;i<es.length;i++){
          let e=es[i];
          if(!e.component) e.component=$new(HTMLElement,e)
          comps.push(e.component);
        }
        return $createArray("HTMLElement",1,comps);
      }catch(e){
        throw $new(Exception,"Fehlerhafter Selektor\n"+e);
      }
    }
    getElementById(id){
      return this.querySelector("[id='"+id+"']");
    }
    getScrollPosition(){
      return this.$el.scrollTop;
    }
    setScrollPosition(top){
      this.$el.scrollTop=top;
    }
    setActionCommand(ac){
      this.actionCommand=ac;
    }
    getActionCommand(){
      if(this.actionCommand){
        return this.actionCommand;
      }else{
        return this.$el.textContent;
      }
    }
    isCollidingWith(comp){
      let r1=this.$el.getBoundingClientRect();
      let r2=comp.$el.getBoundingClientRect();
      if(r1.width===0 || r2.width===0 || r1.height===0|| r2.height===0) return false;
      return !(r1.left+r1.width<r2.left || r2.left+r2.width<r1.left || r1.top+r1.height<r2.top || r2.top+r2.height<r1.top);
    }
    isCollidingWithAny(array){
      if(!array) return null;
      let r1=this.$el.getBoundingClientRect();
      if(r1.width===0 || r1.height===0) return false;
      for(let i=0;i<array.length;i++){
        let e=array[i];
        let e1=e.$el? e.$el:e;
        let r2=e1.getBoundingClientRect();
        if(r2.width===0 || r2.height===0) continue;
        if(!(r1.left+r1.width<r2.left || r2.left+r2.width<r1.left || r1.top+r1.height<r2.top || r2.top+r2.height<r1.top)) return e;
      }
      return null;
    }
    show(){
      this.setVisible(true);
    }
    hide(){
      this.setVisible(false);
    }
    setVisible(v){
      if(!v){
        this.$lastDisplayValue=this.$el.style.display;
        this.$el.style.display="none";
      }else{
        this.$el.style.display=this.$lastDisplayValue;
      }
    }
    isVisible(){
      return this.$el.style.display!=="none";
    }
    setEnabled(v){
      this.$el.disabled=!v;
    }
    isEnabled(){
      return this.$el.disabled;
    }
    setValue(v){
      this.value=v;
      v=$handleAssetsInString(v);
      this.$el.value=v;
    }
    getValue(){
      return this.value+"";
    }
    setDirection(dir){
      if(dir>0) dir%=360;
      this.direction={
        angle: dir,
        dx: dir<0? 0: Math.cos(dir*Math.PI/180),
        dy: dir<0? 0: Math.sin(dir*Math.PI/180),
      };
    }
    getDirection(){
      return this.direction? this.direction.angle:0;
    }
    setDirectionTowards(comp){
      let x=comp.x-this.x;
      let y=comp.y-this.y;
      let a=180/Math.PI*Math.atan2(y,x);
      if(a<0) a+=360;
      this.setDirection(a);
    }
    setRotation(angle){
      this.transform.rotation=angle;
      this.updateTransform();
    }
    updateTransform(){
      let parts=[];
      let angle=this.transform.rotation;
      if(angle!==0){
        parts.push("rotate("+(-angle)+"deg)");
      }
      if(this.transform.flippedH){
        parts.push("scaleX(-1)");
      }
      if(this.transform.flippedV){
        parts.push("scaleY(-1)");
      }
      if(this.parent instanceof Canvas){
        if(this.parent.pixelWidth>0 && this.sizeChanged){
          this.parent.applyDimensions(this.$el,this.width,this.height);
          this.sizeChanged=false;
        }
        parts.push(this.parent.getTranslation(this.x,this.y,this.width,this.height));
      }
      this.$el.style.transform=parts.join(" ");
    }
    move(d){
      this.changeX(d*this.direction.dx);
      this.changeY(d*this.direction.dy);
    }
    moveTo(comp){
      this.setX(comp.getX());
      this.setY(comp.getY());
    }
    setPosition(x,y){
      this.setX(x);
      this.setY(y);
    }
    isAtPosition(x,y){
      let dx=this.getX()-x;
      let dy=this.getY()-y;
      return dx*dx+dy*dy<0.000001;
    }
    setX(v){
      this.x=v;
      this.$el.cx=v;
      this.updateTransform();
    }
    getX(){
      return this.x;
    }
    changeX(dx){
      this.setX(this.getX()+dx);
    }
    changeY(dy){
      this.setY(this.getY()+dy);
    }
    setY(v){
      this.y=v;
      this.$el.cy=v;
      this.updateTransform();
    }
    getY(){
      return this.y;
    }
    setBounds(x,y,width,height){
      this.setX(x+width/2);
      this.setY(y+width/2);
      this.setWidth(width);
      this.setHeight(height);
    }
    setWidth(v){
      if(v!==this.width) this.sizeChanged=true;
      this.width=v;
      this.$el.width=v;
      this.updateTransform();
    }
    getWidth(){
      return this.$el.width;
    }
    setHeight(v){
      if(v!==this.height) this.sizeChanged=true;
      this.height=v;
      this.$el.height=v;
    }
    getHeight(){
      return this.$el.height;
    }
    setSize(w,h){
      this.setWidth(w);
      this.setHeight(h);
    }
    changeWidth(dw){
      this.setWidth(this.getWidth()+dw);
    }
    changeHeight(dh){
      this.setHeight(this.getHeight()+dh);
    }
    getStyle(name){
      return this.$el.style[name];
    }
    setStyle(name, value){
      this.$el.style[name]=value;
    }
    setCSS(css){
      css=$handleAssetsInCSSCode(css);
      this.$el.style=css;
    }
    setCSSClass(className){
      this.$el.className=this.$standardCSSClasses+" "+className;
    }
    getCSSClass(){
      return this.$el.className;
    }
    toggleCSSClass(className){
      return this.$el.classList.toggle(className);
    }
    addCSSClass(className){
      this.$el.classList.add(className);
    }
    removeCSSClass(className){
      this.$el.classList.remove(className);
    }
    hasCSSClass(className){
      return this.$el.classList.contains(className);
    }
    setAlignment(v){
      if(!v) v="";
      v=v.trim().toLowerCase();
      let parts=v.split(" ");
      if(parts.indexOf("left")>=0){
        this.$el.style.justifySelf="safe start";
        //this.$el.style.textAlign="left";
      }else if(parts.indexOf("right")>=0){
        this.$el.style.justifySelf="safe end";
        //this.$el.style.textAlign="right";
      }else{
        this.$el.style.justifySelf="safe center";
        //this.$el.style.textAlign="center";
      }
      if(parts.indexOf("top")>=0){
        this.$el.style.alignSelf="safe start";
      }else if(parts.indexOf("bottom")>=0){
        this.$el.style.alignSelf="safe end";
      }else{
        this.$el.style.alignSelf="safe center";
      }
    }
    getPanel(){
      let p=this.$el.parentNode;
      if(p && p.component){
        return p.component;
      }else{
        return null;
      }
    }
    getIndex(){
      let p=this.getPanel();
      if(p && p.getIndexOf){
        return p.getIndexOf(this);
      }else{
        return -1;
      }
    }
    getRow(){
      let p=this.getPanel();
      if(p && p.getRowOf){
        return p.getRowOf(this);
      }else{
        return -1;
      }
    }
    getColumn(){
      let p=this.getPanel();
      if(p && p.getColumnOf){
        return p.getColumnOf(this);
      }else{
        return -1;
      }
    }
    addActionListener(al){
      this.$actionListeners.push(al);
    }
    removeActionListener(al){
      let index=this.$actionListeners.indexOf(al);
      if(index<0) return;
      this.$actionListeners.splice(index,1);
    }
    getActionListeners(){
      let a=$createArray("ActionListener",this.$actionListeners.length,[]);
      for(let i=0;i<this.$actionListeners.length;i++){
        a[i]=this.$actionListeners[i];
      }
      return a;
    }
    setOnAction(listener){
      if(!listener) throw $new(Exception,"Das Listener-Objekt ist null.");
      if(!listener.onAction) throw $new(Exception,"Das Listener-Objekt besitzt keine onAction-Methode.");
      this.$triggerOnAction=listener;
    }
    setTriggerOnAction(t){
      this.$triggerOnAction=t;
    }
    setTriggerOnMouseUp(t){
      this.$triggerOnMouseUp=t;
      if(t){
        this.$el.onpointerup=$handleOnPointerUp;
      }else{
        this.$el.onpointerup=null;
      }
    }
    setTriggerOnMouseDown(t){
      this.$triggerOnMouseDown=t;
      if(t){
        this.$el.onpointerdown=$handleOnPointerDown;
      }else{
        this.$el.onpointerdown=null;
      }
    }
    focus(){
      this.$el.focus();
    }
  }


  class JButton extends JComponent{
    $constructor(label){
      super.$constructor();
      this.$standardCSSClasses+=" __jbutton";
      if(!label) label="";
      this.$el=document.createElement("button");
      this.$el.component=this;
      this.$triggerOnAction=true;
      this.$el.onclick = $handleOnAction;
      this.setCSSClass("");
      this.setValue(label)
    }
    setValue(text){
      this.value=text;
      let v=$handleAssetsInString(text);
      this.$el.innerHTML=v;
    }
  }

  class JImage extends JComponent{
    async $constructor(url){
      super.$constructor();
      this.$standardCSSClasses+=" __jimage";
      let asset=$App.assets[url];
      this.$img=null;
      if(asset){
        this.url=$getAssetObjectURL(url);
        this.$img=asset.object;
      }else{
        if(url instanceof File){
          this.url=url.getContentAsString();
        }else{
          this.url=url;
        }
      }
      this.$el=document.createElement("div");
      this.$el.style.backgroundSize="100% 100%";
      this.$el.style.backgroundRepeat="no-repeat";
      this.$imageData=null;
      this.$el.component=this;
      this.$el.onclick = $handleOnAction;
      this.dimension={
        width: "100%",
        height: "100%",
        translate: {
          x: "0%",
          y: "0%"
        }
      }
      this.setCSSClass("");
      if(!this.$img){
        this.$img=new Image();
        let p=new Promise((resolve,reject)=>{
          this.$img.onload=(ev)=>{
            resolve();
          };
          this.$img.onerror=(ev)=>{
            let message="Bild '"+url+"' konnte nicht geladen werden";
            $App.handleError({
              message: message,
              line: $App.debug.lastLine,
              name: $App.debug.lastName
            });
            throw message;
          }
        });
        this.$img.src=this.url;
        await p;
      }
      this.setValue(this.url);
      return this;
    }
    setValue(v){
      this.value=v;
      let asset=$App.assets[v];
      let url;
      if(asset){
        url=asset.url;
        if(!url.startsWith("data:")){
          url=(new URL(asset.url,document.baseURI)).href;
        }
      }else{
        url=v;
      }
      this.$el.style.backgroundImage="url("+url+")";
    }
    setFlippedV(flip){
      this.transform.flippedV=flip;
      this.updateTransform();
    }
    getPixelWidth(){
      return this.$img.naturalWidth;
    }
    getPixelHeight(){
      return this.$img.naturalHeight;
    }
    getPixelData(left,top){
      let w=this.getPixelWidth();
      let h=this.getPixelHeight();
      if(left>=w) return null;
      if(top>=h) return null;
      if(!this.$imageData){
        let canvas=document.createElement("canvas");
        
        canvas.width=w;
        canvas.height=h;
        let c=canvas.getContext("2d");
        c.drawImage(this.$img,0,0);
        this.$imageData=c.getImageData(0,0,w,h);
      }
      let index=top*w+left;
      let intsPerPixel=4;
      let array=$createArray("int",1,[this.$imageData.data[index*intsPerPixel],this.$imageData.data[index*intsPerPixel+1], this.$imageData.data[index*intsPerPixel+2], this.$imageData.data[index*intsPerPixel+3] ]);
      return array;

    }
    toDataURL(){
      let w=this.getPixelWidth();
      let h=this.getPixelHeight();
      let canvas=document.createElement("canvas");
      canvas.width=w;
      canvas.height=h;
      let c=canvas.getContext("2d");
      c.drawImage(this.$img,0,0);
      return canvas.toDataURL();
    }
    setZoom(z){
      // let w=z*100+"%";
      // this.setImageWidth(w);
      // this.setImageHeight(w);
      this.$el.style.backgroundSize=z;
    }
    setImageWidth(w){
      this.dimension.width=w;
      this.$el.style.backgroundSize=this.dimension.width+" "+this.dimension.height;
    }
    setImageHeight(h){
      this.dimension.height=h;
      this.$el.style.backgroundSize=this.dimension.width+" "+this.dimension.height;
    }
    setImageTranslationX(x){
      this.dimension.translate.x=x;
      this.$el.style.backgroundPosition="calc(50% + "+this.dimension.translate.x+") calc(50% - "+this.dimension.translate.y+")";
    }
    setImageTranslationY(y){
      this.dimension.translate.y=y;
      this.$el.style.backgroundPosition="calc(50% + "+this.dimension.translate.x+") calc(50% - "+this.dimension.translate.y+")";
    }
    // setSizePolicy(policy){
    //   let c;
    //   if(policy==="fit"){
    //     c="contain";
    //   }else{
    //     c="";
    //   }
    //   this.$el.style.backgroundSize=c;
    // }
  }

  class JPanel extends JComponent{
    $constructor(template){
      super.$constructor();
      this.$standardCSSClasses+=" __jpanel";
      this.template=template;
      this.$el=document.createElement("div");//ui.panel(template,x,y,width,height);
      this.$el.component=this;
      this.$el.onclick = $handleOnAction;
      this.lastRowAndColumnCount=null;
      this.setCSSClass("");
      this.setLayout(template);
    }
    setLayout(template){
      if(!template){
        this.$el.style.overflow="auto";
        this.$el.style.display="";
        return;
      }
      this.$el.style.display="grid";
      this.$el.style.overflow="";
      let teile=template.split("/");
      for(let i=0;i<teile.length;i++){
        var t=teile[i].trim();
        if(/^\d+$/.test(t)){
          teile[i]="repeat("+t+",minmax(0,1fr))";
        }
      }
      if(teile.length===2){
        this.$el.style.gridTemplateRows=teile[0];
        this.$el.style.gridTemplateColumns=teile[1];
      }else{
        this.$el.style.gridTemplateColumns=teile[0];
      }
      this.$el.style.gridAutoRows="minmax(0,1fr)";
      this.$el.style.display="grid"; 
      this.$el.style.alignItems="stretch";
      this.$el.style.justifyItems="stretch";
      this.$el.style.gridColumnGap=0;
      this.$el.style.gridRowGap=0;
      this.$el.style.columnGap=0;
      this.$el.style.rowGap=0;
      this.$el.style.overflow="auto";
    }
    async add(comp,index){
      let el;
      if(comp instanceof Canvas){
        el=comp.wrapper;
        setTimeout(()=>{
          comp.resize(comp.wrapper.clientWidth,comp.wrapper.clientHeight);
        },10);
      }else{
        el=comp.$el;
      }
      if(index>=0 && index<this.$el.childNodes.length){
        this.$el.insertBefore(el,this.$el.childNodes[index]);
      }else{
        this.$el.appendChild(el);
      }
    }
    remove(comp){
      let el;
      if(comp instanceof Canvas){
        el=comp.wrapper;
      }else{
        el=comp.$el;
      }
      try{
        this.$el.removeChild(el);
      }catch(e){
        return false;
      }
      return true;
    }
    removeAll(){
      if(this.$el.replaceChildren){
        this.$el.replaceChildren();
      }else{
        this.$el.innerHTML="";
      }
    }
    getChildCount(){
      let count=0;
      let n=this.$el.children.length;
      for(let i=0;i<n;i++){
        let c=this.$el.children[i];
        if(c.component){
          count++;
        }
      }
      return count;
    }
    getChild(index){
      let realIndex=-1;
      let n=this.$el.children.length;
      for(let i=0;i<n;i++){
        let c=this.$el.children[i];
        if(c.component){
          realIndex++;
        }
        if(realIndex===index){
          return c.component;
        }
      }
      return null;
    }
    getChildInGrid(row,col,colCount){
      if(row<0 || col<0) return null;
      if(colCount===undefined){
        colCount=this.getRowAndColumnCount().cols;
      }
      if(col>=colCount) return null;
      return this.getChild(row*colCount+col);
    }
    _getPositionOf(child,rowAndColCount){
      let rc=rowAndColCount? rowAndColCount : this.getRowAndColumnCount();
      for(let i=0;i<rc.rows;i++){
        for(let j=0;j<rc.cols;j++){
          let c=this.getChildInGrid(i,j,rc.cols);
          if(c===child){
            return [i,j];
          }
        }
      }
      return null;
    }
    getIndexOf(child){
      let n=this.getChildCount();
      let index=0;
      for(let i=0;i<n;i++){
        let c=this.getChild(i);
        if(c===child){
          return index;
        }
      }
      return -1;
    }
    getRowOf(child){
      let rc=this.getRowAndColumnCount();
      let p=this._getPositionOf(child,rc);
      if(p){
        return p[0];
      }else{
        return -1;
      }
    }
    getColumnOf(child){
      let rc=this.getRowAndColumnCount();
      let p=this._getPositionOf(child,rc);
      if(p){
        return p[1];
      }else{
        return -1;
      }
    }
    getRowAndColumnCount(){
      let cs=getComputedStyle(this.$el);
      let values=[cs.getPropertyValue("grid-template-rows"), cs.getPropertyValue("grid-template-columns")];
      if(values[0]==="none" || values[1]==="none"){
        if(this.lastRowAndColumnCount){
          return this.lastRowAndColumnCount;
        }else{
          throw $new(Exception,"Aus irgendeinem Grund kann die Zeilen- bzw. Spaltenanzahl nicht bestimmt werden.");
        }
      }
      /**ersetze repeats durch atomare werte; dürfte eigentlich gar nicht auftreten??? */
      for(let i=0;i<values.length;i++){
        let v=values[i];
        let pos=v.indexOf("repeat");
        if(pos<0) continue;
        let newV=v.substring(0,pos);
        while(pos>=0){
          let pos2=v.indexOf(",",pos);
          let pos3=v.indexOf(")",pos2);
          let c=v.substring(pos+7,pos2)*1;
          let array=[];
          for(let j=0;j<c;j++){
            array.push("1");
          }
          newV+=array.join(" ");
          pos=v.indexOf("repeat",pos3);
        }
        values[i]=newV;
      }
      this.lastRowAndColumnCount={
        rows: values[0].split(" ").length,
        cols: values[1].split(" ").length
      };
      return this.lastRowAndColumnCount;
    }
    getRowCount(){
      return this.getRowAndColumnCount().rows;
    }
    getColumnCount(){
      return this.getRowAndColumnCount().cols;
    }
  }

  class JFrame extends JPanel{
    $constructor(template){
      super.$constructor(template);
      this.$standardCSSClasses+=" __jframe";
      this.$el.style.position="absolute";
      this.$el.style.left="0";
      this.$el.style.right="0";
      this.$el.style.top="0";
      this.$el.style.bottom="0";
      $App.ui.appendChild(this.$el);
      $App.console.adaptSize();
      this.setCSSClass("");
      if($App.hideConsoleIfUIPresentAfterSetup){
        //hide console because of ui
        $App.console.setVisible(false);
      }
    }
  }

  class UIClazz extends JFrame{
    $constructor(template){
      super.$constructor(template);
    }
    static setVisible(v){
      
      if(v){
        let el=this.$self.$el;
        let parent=el.parentNode;
        for(let i=0;i<parent.children.length;i++){
          let c=parent.children[i];
          if(c===el){
            c.style.zIndex=1;
          }else{
            c.style.zIndex=0;
          }
        }
      }
      this.$self.setVisible(v);
    }
    static show(){
      this.setVisible(true);
    }
    static hide(){
      this.setVisible(false);
    }
    static isVisible(){
      let el=this.$self.$el;
      let parent=el.parentNode;
      let maxZIndex=parent.children[parent.children.length-1];
      for(let i=0;i<parent.children.length-1;i++){
        let c=parent.children[i];
        if(c.style.zIndex*1>maxZIndex.style.zIndex*1){
          maxZIndex=c;
        }
      }
      return (maxZIndex===el);
    }
    static getChildCount(){
      return this.$self.getChildCount();
    }
    static getChild(index){
      return this.$self.getChild(index);
    }
  }

  class HtmlPage{
    $constructor(){
      this.$el=document.createElement("iframe");
      this.$el.$HtmlPage=this;
      $App.ui.appendChild();
      this.$el.style="background-color: white; left: 0; top: 0; width: 100%; height: 100%; position: absolute;border: none;margin:0;padding:0;";
      $App.console.adaptSize();
    }
    static async setVisible(v){
      if(v){
        let el=this.$self.$el;
        //entferne die UI-Klasse und füge sie als oberstes Kind wieder ein, sodass sie sichtbar ist
        let parent=el.parentNode;
        for(let i=0;i<parent.children.length;i++){
          let c=parent.children[i];
          if(c===el){
            c.style.zIndex=1;
          }else{
            c.style.zIndex=0;
          }
        }
      }
      
    }
    querySelectorAll(selector,filter){
      let els=this.$el.contentWindow.document.querySelectorAll(selector);
      let res=[];
      for(let i=0;i<els.length;i++){
        let e=els[i];
        if(!filter || filter(e)){
          res.push(e);
        }
      }
      return res;
    }
    querySelector(selector,filter){
      let els=this.querySelectorAll(selector,filter);
      if(els.length>0) return els[0];
      return null;
    }
    static async javascript(functionName,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9){
      return await this.$self.$el.contentWindow[functionName].call(this.$self.$el.contentWindow,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8,arg9);
    }
    static querySelector(selector){
      try{
        let e = this.$self.$el.contentWindow.document.querySelector(selector);
        if(!e) return null;
        if(!e.component) e.component=$new(HTMLElement,e);
        return e.component;
      }catch(e){
        throw $new(Exception,"Fehlerhafter Selektor\n"+e);
      }
    }
    static querySelectorAll(selector){
      try{
        let es=this.$self.$el.contentWindow.document.querySelectorAll(selector);
        if(!es) return null;
        let array=[];
        for(let i=0;i<es.length;i++){
          let e=es[i];
          if(!e.component) e.component=$new(HTMLElement,e)
          array[i]=e.component;
        }
        return $createArray("HTMLElement",1,array);
      }catch(e){
        throw $new(Exception,"Fehlerhafter Selektor\n"+e);
      }
    }
    static async show(){
      await this.setVisible(true);
    }
    static async hide(){
      await this.setVisible(false);
    }
    static isVisible(){
      return this.$self.isVisible();
    }
  }

  class JLabel extends JComponent{
    $constructor(text){
      super.$constructor();
      this.$standardCSSClasses+=" __jlabel";
      this.$el=document.createElement("span");
      this.setValue(text);
      this.$el.component=this;
      this.$el.onclick = $handleOnAction;
      this.setCSSClass("");
      this.setAlignment("center");
    }
    setValue(text){
      let v=$handleAssetsInString(text);
      this.$el.innerHTML=v;
    }
  }

  class HTMLElement{
    $constructor(tag){
      //super.$constructor(0,0,0,0);
      if(tag && tag.substring){
        tag=document.createElement(tag);
      }
      this.$el=tag;
      this.$el.appJSData={};
      this.$lastDisplayValue=this.$el.style.display;
      this.$el.component=this;
      if('selectedIndex' in this.$el || 'checked' in this.$el || 'value' in this.$el){
        this.$el.onchange = $handleOnAction;
      }else{
        this.$el.onclick = $handleOnAction;
      }
    }
    addEventListener(type, listener){
      this.$el.addEventListener(type,listener.actionPerformed,false);
    }
    getChildElements(){

    }
    
    add(comp,index){
      let el;
      if(comp instanceof Canvas){
        el=comp.wrapper;
      }else{
        el=comp.$el;
      }
      if(index===undefined){
        this.$el.appendChild(el);
      }else{
        let ref=this.$el.children[index];
        this.$el.insertBefore(el,ref);
      }
      comp.parent=this;
    }
    setInnerHTML(html){
      this.$el.innerHTML=html;
    }
    setTextContent(text){
      this.$el.textContent=text;
    }
    getAttribute(name){
      return this.$el.getAttribute(name);
    }
    setAttribute(name, value){
      this.$el.setAttribute(name,value);
    }
    setAttributes(namesValues){
      for(let i=0;i<namesValues.length;i++){
        let c=namesValues[i];
        let pos=c.indexOf("=");
        if(pos<1) continue;
        let name=c.substring(0,pos);
        let value=c.substring(pos+1);
        value=JSON.parse(value);
        this.setAttribute(name,value);
      }
    }
    getValue(){
      if(!this.$el) return null;
      if('selectedIndex' in this.$el){
        return this.$el.selectedIndex;
      }else if('checked' in this.$el){
        return this.$el.checked; 
      }else if('value' in this.$el){
        return this.$el.value;
      }
      return this.$el.innerHTML;
    }
    setValue(v){
      if(!this.$el) return;
      if('selectedIndex' in this.$el){
        this.$el.selectedIndex=v;
      }else if('checked' in this.$el){
        this.$el.checked=v;
      }else{
        v=$handleAssetsInString(v);
        if('value' in this.$el){
          this.$el.value=v;
        }else{
          this.$el.innerHTML=v;
        }
      }
    }
    setVisible(v){
      if(!v){
        this.$lastDisplayValue=this.$el.style.display;
        this.$el.style.display="none";
      }else{
        this.$el.style.display=this.$lastDisplayValue;
      }
    }
    isVisible(){
      return this.$el.style.display!=="none";
    }
  }

  class Circle extends JComponent{
    x;
    y;
    r;
    $constructor(x,y,r){
      super.$constructor();
      this.$el=document.createElement("div");
      this.$standardCSSClasses+=" __circle";
      this.x=x;
      this.y=y;
      this.r=r;
      this.$el.style.borderRadius="100%";
      this.$el.style.backgroundColor="gray";
      this.setWidth(r);
      this.setHeight(r);
    }
  }

  class Canvas extends JPanel{
    $constructor(minX,maxX,minY,maxY){
      super.$constructor();
      //this.$standardCSSClasses="_java-app-canvas __jcomponent";
      this.$standardCSSClasses+=" __canvas";
      //if(this.$el && this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
      let wrapper=document.createElement("div");
      this.wrapper=wrapper;
      wrapper.className="__canvas-wrapper";
      wrapper.style.touchAction="none";
      // let canvas=document.createElement("canvas");
      // this.canvas=canvas;
      // wrapper.appendChild(this.canvas);
      this.container=document.createElement("div");
      wrapper.appendChild(this.container);
      this.$el=this.container;
      //this.$el=ui.canvas(maxX-minX,maxY-minY,x,y,width,height);
      this.$el.component=this;
      this.pixelWidth=-1;
      this.pixelHeight=-1;
      this.axes={
        x: {
          min: minX, max: maxX
        },
        y: {
          min: minY, max: maxY
        }
      };
      this.lenX=this.axes.x.max-this.axes.x.min;
      this.lenY=this.axes.y.max-this.axes.y.min;
      this.fit={
        left: 0,
        bottom: 0,
        width: 0,
        height: 0,
        sx: 1,
        sy: 1
      };

      wrapper.resize=(ev)=>{
        this.resize(wrapper.clientWidth,wrapper.clientHeight);

      }
      $App.resizeObserver.observe(wrapper);


      this.setCSSClass("");
      //this.setOrigin(-minX,-minY);
      this.$el.onclick = $handleOnAction;
      this.$triggerOnMouseMove=true;
      this.$triggerOnMouseDown=true;
      this.$triggerOnMouseUp=true;
      // let comp=$new(Circle,0,0,0.01);
      // this.mouse={
      //   x: -1,
      //   y: -1,
      //   over: false,
      //   comp
      // };
      // // this.add(this.mouse.comp,0);
      // //this.$el.onpointermove=$handleOnPointerMove;
      // this.setTriggerOnMouseDown(true);
      // this.setTriggerOnMouseUp(true);
      // this.$el.addEventListener("pointerenter",(ev)=>{
      //   try{
      //     ev.target.releasePointerCapture(ev.pointerId);
      //   }catch(e){}
      //   this.mouse.over=true;
      //   window.mousePressed=ev.buttons>0;
      //   this.$updateMousePosition(ev);
      // },false);
      // this.$el.addEventListener("pointerdown",(ev)=>{
      //   try{
      //     ev.target.releasePointerCapture(ev.pointerId);
      //   }catch(e){}
      //   this.mouse.over=true;
      //   window.mousePressed=true;
      //   this.$updateMousePosition(ev);
      // },false);
      // this.$el.addEventListener("pointermove",(ev)=>{
      //   try{
      //     ev.target.releasePointerCapture(ev.pointerId);
      //   }catch(e){}
      //   this.mouse.over=true;
      //   window.mousePressed=ev.buttons>0;
      //   this.$updateMousePosition(ev);
      // },false);
      // this.$el.addEventListener("pointerup",(ev)=>{
      //   this.mouse.over=true;
      //   window.mousePressed=false;
      //   this.$updateMousePosition(ev);
      // },false);
      // this.$el.addEventListener("pointerleave",(ev)=>{
      //   try{
      //     ev.target.releasePointerCapture(ev.pointerId);
      //   }catch(e){}
      //   this.mouse.over=false;
      //   this.$updateMousePosition(ev);
      // },false);
    }
    resize(w,h){
      if(w===undefined){
        w=this.pixelWidth;
        h=this.pixelHeight;
      }
      console.log("resize",w,h);
      this.pixelWidth=w;
      this.pixelHeight=h;
      let dpr=window.devicePixelRatio||1;
      if(this.sizePolicy==="stretch"){
        this.fit.left=0;
        this.fit.bottom=0;
        this.fit.width=w;
        this.fit.height=h;
        this.fit.sx=w/this.lenX;
        this.fit.sy=h/this.lenY;
      }else{
        if(w*this.lenY>=h*this.lenX){
          let s=h/this.lenY;
          let realW=this.lenX*s;
          this.fit.left=(w-realW)/2;
          this.fit.width=realW;
          this.fit.height=h;
          this.fit.sy=s;
          this.fit.sx=s;
        }else{
          let s=w/this.lenX;
          let realH=this.lenY*s;
          this.fit.bottom=(h-realH)/2;
          this.fit.height=realH;
          this.fit.width=w;
          this.fit.sy=s;
          this.fit.sx=s;
        }
      }
      
      this.container.style.left=this.fit.left+"px";
      this.container.style.bottom=this.fit.bottom+"px";
      this.container.style.width=this.fit.width+"px";
      this.container.style.height=this.fit.height+"px";

      for(let i=0;i<this.container.childNodes.length;i++){
        let c=this.container.childNodes[i];
        c.component?.updateTransform();
      }
    }
    applyDimensions(el,w,h){
      let rw=w*this.fit.sx;
      let rh=h*this.fit.sy;
      el.style.width=rw+"px";
      el.style.height=rh+"px";
    }
    getTranslation(x,y,w,h){
      let rx=(x-this.axes.x.min-w/2)*this.fit.sx;
      let ry=-(y-this.axes.y.min-h/2)*this.fit.sy;
      return "translate("+rx+"px,"+ry+"px)";
    }
    add(comp,index){
      let el;
      if(comp instanceof Canvas){
        el=comp.wrapper;
      }else{
        el=comp.$el;
      }
      if(index>=0 && index<this.container.childNodes.length){
        this.container.insertBefore(el,this.container.childNodes[index]);
      }else{
        this.container.appendChild(el);
      }
      comp.parent=this;
    }
    remove(comp){
      try{
        this.container.removeChild(comp.$el);
      }catch(e){
        return false;
      }
      return true;
    }
    removeAll(){
      if(this.container.replaceChildren){
        this.container.replaceChildren();
      }else{
        this.container.innerHTML="";
      }
    }
    setAxisX(min,max){
      this.$el.canvas.setAxisX(min,max);
    }
    setAxisY(min,max){
      this.$el.canvas.setAxisY(min,max);
    }
    $updateMousePosition(ev){
      let canvas=this.$el.canvas;
      let x = ev.offsetX;
      let y = ev.offsetY;
      let el=ev.srcElement;
      if(el.isCanvas) el=el.parentElement;
      let brCanvas=this.$el.getBoundingClientRect();
      let brTarget=el.getBoundingClientRect();
      x+=brTarget.left-brCanvas.left;
      y+=brTarget.top-brCanvas.top;
      x=canvas.getCanvasX(x);
      y=canvas.getCanvasY(y);
      this.mouse.x=x;
      this.mouse.y=y;
      this.mouse.comp.setX(x);
      this.mouse.comp.setY(y);
    }
    setSizePolicy(policy){
      this.sizePolicy=policy;
      this.resize();
    }
    getSizePolicy(){
      return this.sizePolicy;
    }
    isMouseOver(){
      return this.mouse.over;
    }
    isMousePressed(){
      return window.mousePressed;
    }
    getMouse(){
      return this.mouse.comp;
    }
    getMouseX(){
      return this.mouse.x;
    }
    getMouseY(){
      return this.mouse.y;
    }
    getChildAtPoint(x, y){
      let br=this.$el.getBoundingClientRect();
      let rx=this.$el.canvas.getRawX(x);
      let ry=this.$el.canvas.getRawY(y);
      rx+=br.left;
      ry+=br.top;
      let els=document.elementsFromPoint(rx,ry);
      for(let i=0;i<els.length;i++){
        let e=els[i];
        if(e===this.$el || e===this.$el.canvas.el) return null;
        if(this.$el.contains(e) && e.component){
          return e.component;
        }
      }
      return null;
    }
    save(){
      this.$el.canvas.save();
    }
    restore(){
      this.$el.canvas.restore();
    }
    reset(){
      this.$el.canvas.reset();
    }
    rotate(angle,x,y){
      this.$el.canvas.rotate(angle,x,y);
    }
    translate(x,y){
      this.$el.canvas.translate(x,y);
    }
    shear(sx,sy){
      this.$el.canvas.shear(sx,sy);
    }
    scale(sx,sy,x,y){
      this.$el.canvas.scale(sx,sy,x,y);
    }
    setTransform(m00,m10,m01,m11,m02,m12){
      this.$el.canvas.setTransform(m00,m10,m01,m11,m02,m12);
    }
    redraw(){
      this.$el.canvas.redraw();
    }
    setOrigin(x,y){
      this.$el.canvas.setOrigin(x,y);
    }
    setSize(internalWidth,internalHeight,width,height){
      this.$el.setSize(internalWidth,internalHeight,width,height);
    }

    setMirrored(m){
      this.$el.canvas.setMirrored(m);
    }
    setRotation(angle){
      this.$el.canvas.setRotation(angle);
    }
    setOpacity(o){
      this.$el.canvas.setOpacity(o);
    }
    clear(){
      this.$el.canvas.clear();
    }
    clearRect(cx,cy,w,h){
      this.$el.canvas.clearRect(cx,cy,w,h);
    }
    setFontsize(s){
      this.$el.canvas.setFontsize(s);
    }
    setFont(fontName){
      this.$el.canvas.setFont(fontName);
    }
    setLinewidth(w){
      this.$el.canvas.setLinewidth(w);
    }
    write(text,x,y,align){
      this.$el.canvas.write(text,x,y,align);
    }
    drawCircle(x,y,r){
      this.$el.canvas.drawCircle(x,y,r);
    }
    fillCircle(x,y,r){
      this.$el.canvas.fillCircle(x,y,r);
    }
    drawRect(cx,cy,w,h){
      this.$el.canvas.drawRect(cx,cy,w,h);
    }
    fillRect(cx,cy,w,h){
      this.$el.canvas.fillRect(cx,cy,w,h);
    }
    drawLine(x1,y1,x2,y2){
      this.$el.canvas.drawLine(x1,y1,x2,y2);
    }
    beginPath(x,y){
      this.$el.canvas.beginPath(x,y);
    }
    lineTo(x,y){
      this.$el.canvas.lineTo(x,y);
    }
    closePath(){
      this.$el.canvas.closePath();
    }
    drawPath(){
      this.$el.canvas.drawPath();
    }
    fillPath(){
      this.$el.canvas.fillPath();
    }
    isPointInPath(x,y){
      return this.$el.canvas.isPointInPath(x,y);
    }
    setColor(c){
      this.$el.canvas.setColor(c);
    }
    drawImage(image,cx,cy,w,h,angle,mirrored){
      this.$el.canvas.drawImage(image,cx,cy,w,h,angle,mirrored);
    }
    drawImagePart(image,cx,cy,width,height,scx,scy,swidth,sheight,rotation,mirrored){
      this.$el.canvas.drawImage(image,cx,cy,width,height,rotation,mirrored,{cx: scx, cy: scy, w: swidth, h: sheight});
    }
  }

  class JComboBox extends JComponent{
    $constructor(options){
      super.$constructor();
      this.$standardCSSClasses+=" __jcombobox";
      if(!options){
        options=[];
      }
      this.$el=document.createElement("select");
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
      this.setCSSClass("");
      this.setOptions(options);
    }
    getSelectedIndex(){
      return this.$el.selectedIndex;
    }
    setSelectedIndex(index){
      this.$el.selectedIndex=index;
    }
    setValue(text){
      for(let i=0;i<this.$el.childNodes.length;i++){
        let o=this.$el.childNodes[i];
        if(o.innerHTML===text){
          this.$el.selectedIndex=i;
          return;
        }
      }
    }
    getValue(){
      if(!this.$el.firstChild) return null;
      return this.$el.childNodes[this.$el.selectedIndex]?.innerHTML+"";
    }
    setOptions(options){
      this.removeAllItems();
      if(!options) return;
      for(let i=0;i<options.length;i++){
        this.addItem(options[i]);
      }
    }
    addItem(item){
      let o=document.createElement("option");
      o.innerHTML=item;
      this.$el.appendChild(o);
    }
    removeItemAt(index){
      let o=this.$el.children(index);
      if(!o) return;
      this.$el.removeChild(o);
    }
    removeAllItems(){
      this.$el.replaceChildren();
    }
  }

  class JCheckBox extends JComponent{
    $constructor(label){
      super.$constructor();
      this.$standardCSSClasses+=" __jcheckbox";
      this.$el=document.createElement("div");
      let cb=document.createElement("input");
      cb.type="checkbox";
      var id=Math.floor(Math.random()*100000000);
      cb.id="checkbox-"+id;
      this.$el.style="display: inline-flex; text-align: center;align-items: center;justify-content: center;";
      this.$el.appendChild(cb);
      this.box=cb;
      let lab=document.createElement("label");
      lab.htmlFor=cb.id;
      this.label=lab;
      this.$el.appendChild(lab);
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
      this.setCSSClass("");
      this.setValue(label);
    }
    isChecked(){
      return this.box.checked;
    }
    setChecked(v){
      this.box.checked=v;
    }
    setValue(v){
      this.value=v;
      this.label.innerHTML=v;
    }
    getValue(){
      return this.value;
    }
  }

  class JTextComponent extends JComponent{
    $constructor(){
      super.$constructor();
      this.$standardCSSClasses+=" __jtextcomponent";
    }
    getSelectionStart(){
      return this.$el.selectionStart;
    }
    getSelectionEnd(){
      return this.$el.selectionEnd;
    }
    setSelection(start,end){
      this.$el.setSelectionRange(start,end);
      this.focus();
    }
    setPlaceholder(text){
      this.$el.placeholder=text;
    }
    getPlaceholder(){
      return this.$el.placeholder;
    }
    setValue(v){
      this.$el.value=v;
    }

    getValue(){
      return this.$el.value;
    }
  }

  class JTextField extends JTextComponent{
    $constructor(placeholder,type){
      if(!type) type="text";
      if(!placeholder) placeholder="";
      super.$constructor();
      this.$standardCSSClasses+=" __jtextfield";
      this.$el=document.createElement("input");
      this.$el.type=type;
      this.$el.placeholder=placeholder;
      this.$el.spellCheck=false;
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
      this.setCSSClass("");
      this.setAlignment("left");
    }
  }

  class JTextArea extends JTextComponent{
    $constructor(placeholder){
      super.$constructor();
      this.$standardCSSClasses+=" __jtextarea";
      this.$el=document.createElement("textarea");//ui.textarea(placeholder,x,y,width,height);
      this.$el.placeholder=placeholder;
      this.setAlignment("top");
      this.$el.spellCheck=false;
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
      this.setCSSClass("");
    }
    append(s){
      this.setValue(this.getValue()+s);
    }
  }

  class DataTable extends JComponent{
    $constructor(){
      super.$constructor();
      this.$standardCSSClasses+=" __datatable";
      let b=document.createElement("div");
      let wrapper=document.createElement("div");
      wrapper.style.overflow="auto";
      wrapper.style.maxWidth="100%";
      b.style.overflow="hidden";
      wrapper.style.maxHeight="100%";
      this.table=document.createElement("table");
      this.table.className="__datatable_inner";
      this.table.style.minWidth="100%";
      this.table.style.minHeight="100%";
      b._showIndex=false;
        // Object.defineProperty(b, 'showIndex', {
        //   set: function(v){
        //     this._showIndex=v;
        //     this.table.className=v? "__datatable_inner show-index": "__datatable_inner";
        //   },
        //   get: function(){
        //     return this._showIndex;
        //   }
        // });
      wrapper.appendChild(this.table);
      b.appendChild(wrapper);
      this.array=null;
      this.rows=[];
      this.$el=b;
      this.$el.component=this;
      this.$el.onclick = $handleOnAction;
      this.setCSSClass("");
      this.value=-1;
    }
    setArray(array){
      this.value=-1;
      this.array=array;
      // if(array instanceof $App.Array){
      //   array=array.values;
      // } 
      while(this.table.firstChild){
        this.table.removeChild(this.table.firstChild);
      }
      this.rows=[];
      if(!array || array.length===0 || array[0]===null || array[0]===undefined) return;
      let stripQuotationMarks=true;
      let captions=document.createElement("tr");
      let th=document.createElement("th");
      th.textContent="INDEX";
      captions.appendChild(th);
      this.table.appendChild(captions);
      for(let i=0;i<array.length;i++){
        let obj=array[i];
        if(obj===null || obj===undefined){
          break;
        }
        if("$data" in obj){
          obj=obj.$data;
        }
        let tr=document.createElement("tr");
        this.rows.push(tr);
        tr.index=i;
        tr.onclick=()=>{
          if(this.value===tr.index){
            this.setSelectedIndex(-1);
          }else{
            this.setSelectedIndex(tr.index);
          }
        };
        let td=document.createElement("td");
        td.textContent=i;
        tr.appendChild(td);
        for(let a in obj){
          let attr=obj[a];
          if(!a || typeof attr==="function" || a.startsWith("$")){
            continue;
          }
          if(i===0){
            let captionTD=document.createElement("th");
            if(stripQuotationMarks && a.charAt(0)==="'" && a.charAt(a.length-1)==="'"){
              a=a.substring(1,a.length-1);
            }
            captionTD.innerHTML=(a+"").toUpperCase();
            captions.appendChild(captionTD);
          }
          td=document.createElement("td");
          td.innerHTML=attr+"";
          tr.appendChild(td);
        }
        this.table.appendChild(tr);
      }
    }
    getArray(){
      return this.array;
    }
    getValue(){
      return this.value+"";
    }
    setValue(v){
      this.setSelectedIndex(v*1);
    }
    setSelectedIndex(index){
      if(this.value>=0){
        var tr=this.rows[this.value];
        if(tr){
         tr.classList.remove("selected");
        }
      }
      this.value=index;
      if(index>=0){
        var tr=this.rows[this.value];
        if(tr){
         tr.classList.add("selected");
        }
      }
    }
    getSelectedIndex(){
      return this.value;
    }
  }

  class Matrix{
    $constructor(rows,cols){
      this.rows=[];
      this.rowCount=rows;
      this.colCount=cols;
      for(let i=0;i<rows;i++){
        let z=[];
        for(let j=0;j<cols;j++){
          z.push(0);
        }
        this.rows.push(z);
      }
    }
    getRowCount(){
      return this.rowCount;
    }
    getColCount(){
      return this.colCount;
    }
    set(r,c,value){
      if(r<1 ||r>this.rowCount){
        throw $new(Exception,"Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      if(c<1 ||c>this.colCount){
        throw $new(Exception,"Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      this.rows[r-1][c-1]=value;
    }
    get(r,c){
      if(r<1 ||r>this.rowCount){
        throw $new(Exception,"Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      if(c<1 ||c>this.colCount){
        throw $new(Exception,"Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      if(!this.rows[r-1]){
        console.log("fehler");
      }
      return this.rows[r-1][c-1];
    }
    getRow(r){
      if(r<1 ||r>this.rowCount){
        throw $new(Exception,"Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      let array=$createArray("double",[this.colCount]);
      let row=this.rows[r-1];
      for(let i=0;i<this.colCount;i++){
        array.set(i,row[i]);
      }
      return row;
    }
    setRow(r,values){
      if(r<1 ||r>this.rowCount){
        throw $new(Exception,"Diese Matrix hat keine "+r+"-te Zeile, sondern nur die Zeilen 1 bis "+this.rowCount+".");
      }
      if(values.length!==this.colCount){
        throw $new(Exception,"Die neue Zeile muss genau "+this.colCount+" Einträge haben. Sie hat aber "+values.length+".");
      }
      let row=this.rows[r-1];
      for(let i=0;i<this.colCount;i++){
        row[i]=values[i];
      }
    }
    getColumn(c){
      if(c<1 ||c>this.colCount){
        throw $new(Exception,"Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      let col=$createArray("double",[this.rowCount]);
      for(let i=0;i<this.rowCount;i++){
        col.set(i,this.rows[i][c-1]);
      }
      return col;
    }
    setColumn(c,values){
      if(c<1 ||c>this.colCount){
        throw $new(Exception,"Diese Matrix hat keine "+c+"-te Spalte, sondern nur die Spalten 1 bis "+this.colCount+".");
      }
      if(values.length!==this.rowCount){
        throw $new(Exception,"Die neue Spalte muss genau "+this.rowCount+" Einträge haben. Sie hat aber "+values.length+".");
      }
      for(let i=0;i<this.rowCount;i++){
        this.rows[i][c-1]=values[i];
      }
    }
    multiply(m){
      if(m.rowCount!==this.colCount){
        throw $new(Exception,"Die Matrix hat "+m.rowCount+" Zeilen, sie muss aber "+this.colCount+" Zeilen haben.");
      }
      let res=$new(Matrix,this.rowCount,m.colCount);
      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<m.colCount;j++){
          let e=0;
          for(let k=0;k<this.colCount;k++){
            e+=this.rows[i][k]*m.rows[k][j];
          }
          res.rows[i][j]=e;
        }
      }
      return res;
    }
    multiplyVector(v){
      if(v.size!==this.colCount){
        throw $new(Exception,"Der Vektor hat "+v.rowCount+" Zeilen, er muss aber "+this.colCount+" Zeilen haben.");
      }
      let res=$new(Vector,this.rowCount);
      for(let i=0;i<this.rowCount;i++){
        let e=0;
        let row=this.rows[i];
        for(let k=0;k<this.colCount;k++){
          e+=row[k]*v.components[k];
        }
        res.components[i]=e;
      }
      return res;
    }
    add(m){
      if(m.rowCount!==this.rowCount || m.colCount!==this.colCount){
        throw $new(Exception,"Die Matrix hat "+m.rowCount+" Zeilen und "+m.colCount+" Spalten, sie muss aber "+this.rowCount+" Zeilen und "+this.colCount+" Spalten haben.");
      }
      let res=$new(Matrix,this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        let row2=m.rows[i];
        for(let j=0;j<this.colCount;j++){
          res.rows[i][j]=row[j]+row2[j];
        }
      }
      return res;
    }
    sub(m){
      if(m.rowCount!==this.rowCount || m.colCount!==this.colCount){
        throw $new(Exception,"Die Matrix hat "+m.rowCount+" Zeilen und "+m.colCount+" Spalten, sie muss aber "+this.rowCount+" Zeilen und "+this.colCount+" Spalten haben.");
      }
      let res=$new(Matrix,this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        let row2=m.rows[i];
        for(let j=0;j<this.colCount;j++){
          res.rows[i][j]=row[j]-row2[j];
        }
      }
      return res;
    }
    scale(s){
      let res=$new(Matrix,this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        for(let j=0;j<this.colCount;j++){
          res.rows[i][j]=s*this.rows[i][j];
        }
      }
      return res;
    }
    toString(){
      let t="(";
      for(let i=0;i<this.rowCount;i++){
        if(i>0){
          t+=" | ";
        }
        for(let j=0;j<this.colCount;j++){
          if(j>0) t+=" ";
          t+=this.rows[i][j].toFixed(2);
        }
      }
      t+=")";
      return t;
    }
    lengthSquared(){
      let s=0;
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        for(let k=0;k<this.colCount;k++){
          s+=row[k]*row[k];
        }
      }
      return s;
    }
    length(){
      return Math.sqrt(this.lengthSquared());
    }
    getCopy(){
      let M=$new(Matrix,this.rowCount,this.colCount);
      for(let i=0;i<this.rowCount;i++){
        let row=this.rows[i];
        for(let j=0;j<this.colCount;j++){
          M.rows[i][j]=row[j];
        }
      }
      return M;
    }
  }

  class Vector{
    $constructor(size){
      if(size<1){
        throw $new(Exception,"Die Länge des neuen Vektors muss mindestens 1 betragen.");
      }
      this.components=[];
      this.size=size;
      for(let i=0;i<size;i++){
        this.components.push(0);
      }
    }
    getSize(){
      return this.size;
    }
    set(pos,value){
      if(pos<1 || pos>this.size){
        throw $new(Exception,"Vector.set: Position "+pos+" gibt es nicht in einem Vektor der Länge "+this.size+".");
      }
      this.components[pos-1]=value;
    }
    get(pos){
      if(pos<1 || pos>this.size){
        throw $new(Exception,"Vector.get: Position "+pos+" gibt es nicht in einem Vektor der Länge "+this.size+".");
      }
      return this.components[pos-1];
    }
    setFromVector(vector){
      if(vector.getSize()!==this.size){
        throw $new(Exception,"Die beiden Vektoren haben unterschiedliche Länge.");
      }
      for(let i=0;i<this.size;i++){
        this.components[i]=vector.components[i];
      }
    }
    getMaxComponent(){
      let max=-1;
      let pos=-1;
      for(let i=0;i<this.size;i++){
        let c=this.components[i];
        if(pos<0 || c>max){
          pos=i;
          max=c;
        }
      }
      return pos;
    }
    getMinComponent(){
      let min=-1;
      let pos=-1;
      for(let i=0;i<this.size;i++){
        let c=this.components[i];
        if(pos<0 || c<min){
          pos=i;
          max=c;
        }
      }
      return pos;
    }
    getMax(){
      let m=this.components[0];
      for(let i=1;i<this.size;i++){
        let c=this.components[i];
        if(c>m){
          m=c;
        }
      }
      return m;
    }
    getMin(){
      let m=this.components[0];
      for(let i=1;i<this.size;i++){
        let c=this.components[i];
        if(c<m){
          m=c;
        }
      }
      return m;
    }
    getAsArray(){
      let array=$createArray("double",[this.size]);
      for(let i=0;i<this.size;i++){
        array[i]=this.components[i];
      }
      return array;
    }
    setFromArray(array){
      if(array.length!==this.size){
        throw $new(Exception,"Das Array hat "+array.length+" Einträge, er muss aber "+this.size+" Einträge haben.");
      }
      for(let i=0;i<array.length;i++){
        this.components[i]=array[i];
      }
    }
    toString(){
      let t="[";
      for(let i=0;i<this.size;i++){
        if(i>0){
          t+=" ";
        }
        t+=this.components[i].toFixed(2);
      }
      t+="]";
      return t;
    }
    mul(v){
      if(v.getSize()!==this.size){
        throw $new(Exception,"Die beiden Vektoren haben unterschiedliche Länge.");
      }
      //let res=$new(Vector,this.size);
      for(let i=0;i<this.size;i++){
        this.components[i]*=v.components[i];
      }
      return this;
    }
    applyMatrix(m){
      if(m.colCount!==this.size || m.rowCount!==this.size){
        throw $new(Exception,"Nur quadratische Matrizen können auf diesen Vektor angewendet werden.");
      }
      for(let i=0;i<m.rowCount;i++){
        let e=0;
        let row=m.rows[i];
        for(let k=0;k<m.colCount;k++){
          e+=row[k]*this.components[k];
        }
        this.components[i]=e;
      }
      return this;
    }
    scalarProduct(v){
      if(v.getSize()!==this.size){
        throw $new(Exception,"Die beiden Vektoren haben unterschiedliche Länge.");
      }
      let s=0;
      for(let i=0;i<this.size;i++){
        s+=this.components[i]*v.components[i];
      }
      return s;
    }
    scale(s){
      for(let i=0;i<this.size;i++){
        this.components[i]*=s;
      }
      return this;
    }
    async applyFunction(func){
      for(let i=0;i<this.size;i++){
        this.components[i]=await func.apply(this.components[i]);
      }
      return this;
    }
    add(v){
      if(v.size!==this.size){
        throw $new(Exception,"Der Vektor hat "+v.size+" Zeilen, er muss aber "+this.size+" Zeilen haben.");
      }
      for(let i=0;i<this.size;i++){
        this.components[i]+=v.components[i];
      }
      return this;
    }
    sub(v){
      if(v.size!==this.size){
        throw $new(Exception,"Der Vektor hat "+v.size+" Zeilen, er muss aber "+this.size+" Zeilen haben.");
      }
      for(let i=0;i<this.size;i++){
        this.components[i]-=v.components[i];
      }
      return this;
    }
    lengthSquared(){
      let s=0;
      for(let i=0;i<this.size;i++){
        s+=this.components[i]*this.components[i];
      }
      return s;
    }
    length(){
      return Math.sqrt(this.lengthSquared());
    }
    copy(){
      let v=$new(Vector,this.size);
      for(let i=0;i<this.size;i++){
        v.components[i]=this.components[i];
      }
      return v;
    }
  }

  class $IndexedDB{

    constructor(indexedDB){
      this.indexedDB=indexedDB;
    }
    static async create(name,version){
      let req = indexedDB.open(name,version);
      req.onupgradeneeded=(ev)=>{
        let db=ev.target.result;
        db.createObjectStore("data");
      };
      let db=null;
      let p=new Promise((resolve,reject)=>{
        req.onsuccess=(ev)=>{
          resolve(req.result);
        };
        req.onerror=(ev)=>{
          reject();
        }
      });
      db=await p;
      
      let idb=new $IndexedDB(db);
      
      return idb;
    }
    async deleteDatabase(){
      let p=new Promise((resolve,reject)=>{
        let req=this.indexedDB.deleteDatabase();
        req.onsuccess=(ev)=>{
          resolve(true);
        };
        req.onerror=(ev)=>{
          resolve(false);
        }
      });
      let q=await p;
      return q;
    }
    async clear(){
      let t=this.indexedDB.transaction("data","readwrite");
      let os=t.objectStore("data");
      let req=os.clear();
      let p=new Promise((resolve,reject)=>{
        req.onsuccess=(ev)=>{
          resolve(true);
        };
        req.onerror=(ev)=>{
          resolve(false);
        }
      });
      let d=await p;
      return d;
    }
    setItem(key, value){
      let t=this.indexedDB.transaction("data","readwrite");
      let os=t.objectStore("data");
      os.put(value,key);
    }
    async getAllKeys(){
      let t=this.indexedDB.transaction("data","readonly");
      let os=t.objectStore("data");
      let req=os.getAllKeys();
      let p=new Promise((resolve,reject)=>{
        req.onsuccess=(ev)=>{
          resolve(ev.target.result);
        };
        req.onerror=(ev)=>{
          resolve(null);
        }
      });
      let d=await p;
      return d;
    }
    async getAllItems(){
      let keys=await this.getAllKeys();
      if(!keys || keys.length===0) return null;
      let t=this.indexedDB.transaction("data","readonly");
      let os=t.objectStore("data");
      let req=os.getAll();
      let p=new Promise((resolve,reject)=>{
        req.onsuccess=(ev)=>{
          resolve(ev.target.result);
        };
        req.onerror=(ev)=>{
          resolve(null);
        }
      });
      let d=await p;
      if(!d) return null;
      let obj={};
      for(let i=0;i<keys.length;i++){
        obj[keys[i]]=d[i];
      }
      return obj;
    }
    async getItem(key){
      let t=this.indexedDB.transaction("data","readonly");
      let os=t.objectStore("data");
      let req=os.get(key);
      let p=new Promise((resolve,reject)=>{
        req.onsuccess=(ev)=>{
          resolve(ev.target.result);
        };
        req.onerror=(ev)=>{
          resolve(null);
        }
      });
      let d=await p;
      return d;
    }
  }

  class Database{
    $constructor(name){
      
    }
    
    static async create(name){
      let db=new Database();
      if(name){
        db.$db=new alasql.Database(name);
        db.$indexedDB=await $IndexedDB.create(name,1);
        //await db.load();
      }else{
        db.$db=alasql;
      }
      db.version=1;
      return db;
    }
    setVersion(v){
      this.version=v;
    }
    getVersion(){
      return this.version;
    }
    saveTable(tablename,table){
      this.$indexedDB.setItem(tablename,{cols: table.columns, data: table.data});
    }
    save(){
      if(!this.$indexedDB) return;
      this.$indexedDB.setItem("$version$",this.version);
      let tables=this.$db.tables;
      for(let a in tables){
        this.saveTable(a,tables[a]);
      }
    }
    exportTableDataAsCSVString(tablename,separator){
      let table=this.$db.tables[tablename.toLowerCase()];
      if(!table) return null;
      if(!separator){
        separator=";";
      }
      let r=this.sql("select * from "+tablename);
      
      let cols=[];
      for(let i=0;i<table.columns.length;i++){
        cols.push(table.columns[i].columnid);
      }
      let text=cols.join(separator);
      for(let i=0;i<r.length;i++){
        let data=[];
        let row=r[i];
        for(let i=0;i<table.columns.length;i++){
          let c=table.columns[i].columnid;
          data.push(row[c]);
        }
        text+="\n"+data.join(";");
      }
      return text;
    }
    importTableDataFromCSVString(tablename,s,separator){
      let table=this.$db.tables[tablename.toLowerCase()];
      if(!table) return false;
      if(!separator){
        separator=";";
      }
      let rows=s.split("\n");
      let cmd="";
      let stringTypes=["VARCHAR","STRING","CHAR"];
      for(let i=1;i<rows.length;i++){
        let row=rows[i];
        let data=row.split(separator);
        let values=[];
        for(let j=0;j<table.columns.length;j++){
          let col=table.columns[j];
          let val=data[j];
          if(stringTypes.indexOf(col.dbtypeid.toUpperCase())>=0){
            val=JSON.stringify(val);
          }
          values.push(val);
        }
        values=values.join(",");
        cmd+="insert into "+tablename+" values ("+values+");\n";
      }
      this.sql(cmd);
      return true;
    }
    getDatatypeString(col){
      let t=col.dbtypeid;
      let add=[];
      if(col.dbsize!==undefined){
        add.push(col.dbsize);
      }
      if(col.dbprecision!==undefined){
        add.push(col.dbprecision);
      }
      if(add.length>0){
        t+="("+add.join(",")+")";
      }
      if(col.notnull){
        t+=" NOT NULL";
      }
      return t;
    }
    loadFromObject(tables){
      console.log("load",tables);
      if(!tables) return false;
      //let tables=this.$db.tables;
      for(let a in tables){
        if(a==="$version$"){
          this.version=tables[a]*1;
          continue;
        }
        let tab=tables[a];
        //if(tables[a].length<=0 || a.endsWith("-$cols$")) continue;
        let t=this.$db.tables[a];
        if(t){
          this.$db.exec("drop table "+a);
        }
        let cols=[];
        for(let i=0;i<tab.cols.length;i++){
          let c=tab.cols[i];
          cols.push(c.columnid+" "+this.getDatatypeString(c));
        }
        this.$db.exec("create table "+a+" ("+cols.join(",")+")");
        t=this.$db.tables[a];
        t.data=tables[a].data;
      }
      return true;
    }
    async load(){
      if(!this.$indexedDB) return false;
      let tables=await this.$indexedDB.getAllItems();
      return this.loadFromObject(tables);
    }
    tableCount(){
      let tables=this.$db.tables;
      let s=0;
      for(let a in tables){
        s++;
      }
      return s;
    }
    isEmpty(){
      let tables=this.$db.tables;
      for(let a in tables){
        return false;
      }
      return true;
    }
    prepareStatement(sqlSource){
      return sqlSource;
      //dieses Vorgehen ist zu riskant. Problem: Doppelte Spalten kollabieren zu einer, müssen also manuell umbenannt werden. Beim Programmieren sollte das aber ein untergeordnetes Problem sein.
      /**muss kopiert werden in additionalJScode! */
      let ast=alasql.parse(sqlSource);
      /**untersucht die statements darauf, ob mehr als eine Tabelle abgefragt wird
       * falls ja, werden alle mehrfach vorkommenden Spaltennamen per 'as' in 'Tabelle.Spalte' umbenannt
       * Sinn: doppelt vorkommende Spaltennamen kollabieren ansonsten
       * damit StringValue erzeugt werden kann, musste in alasql.min.ja folgender Code eingefügt werden:
       * window.alasqlX=X;
       * an der Stelle:
       * X=(T.Recordset=function(e){q(this,e)},y.yy=T.yy={});window.alasqlX=X;X.extend=
       */
      let sql="";
      for(let i=0;i<ast.statements.length;i++){
        let s=ast.statements[i];
        if(!(s instanceof alasqlX.Select)){
          continue;
        }
        if(!s || !s.columns || !s.from || s.from.length===0) continue;
        let tables={};
        for(let j=0;j<s.from.length;j++){
          let t=s.from[j];
          let label=t.as? t.as:t.tableid;
          tables[label]=t.tableid;
        }
        /**spezialfall 'select *': * durch alle Spalten ersetzen: */
        if(s.columns.length===1 && s.columns[0].columnid==='*'){
          let spalten=[];
          for(let j=0;j<s.from.length;j++){
            let t=s.from[j];
            let label=t.as? t.as:t.tableid;
            let table=this.$db.tables[t.tableid];
            if(!table) continue;
            for(let k=0;k<table.columns.length;k++){
              let c=table.columns[k];
              let spalte=label+"."+c.columnid;
              spalten.push({
                spalte, columnid: c.columnid, tableid: label
              });
            }
          }
          for(let j=0;j<spalten.length;j++){
            let spalte=spalten[j];
            s.columns[j]=new alasqlX.Column({columnid: spalte.columnid, tableid: spalte.tableid});
          }
        }
        /**finde doppelte spalten: */
        for(let j=0;j<s.columns.length;j++){
          let c=s.columns[j];
          if(c.as) continue;
          let changeC=false;
          for(let k=j+1;k<s.columns.length;k++){
            let c2=s.columns[k];
            if(c2.as) continue;
            if(c2.columnid===c.columnid){
              changeC=true;
              let tableid=tables[c2.tableid];
              c2.as=new window.alasqlX.StringValue({value: tableid+"."+c2.columnid});
            }
          }
          if(changeC){
            let tableid=tables[c.tableid];
            c.as=new window.alasqlX.StringValue({value: tableid+"."+c.columnid});
          }
        }
      }
      return ast;
    }
    query(sqlSource){
      try{
        let prep;
        prep=this.prepareStatement(sqlSource);
        var r=this.$db.exec(prep.toString());
        // if(this.$indexedDB){
        //   this.$indexedDB.reflectSQL(prep);
        // }
        return r;
      }catch(e){
        console.log(e.message);
        throw e;
      }
    }
    sql(cmd){
      try{
        var result=this.query(cmd);
        var records=[];
        if(result){
          for(var i=0;i<result.length;i++){
            var r=result[i];
            records.push(r);
          }
        }
        var a=$createArray("JSON",records.length,records);
        return a;
      }catch(e){
        return null;
      }
    }
    sqlError(cmd){
      try{
        this.$db.exec(cmd);
        return null;
      }catch(e){
        return e.message;
      }
    }
    areResultsEqualIgnoreOrder(array1,array2){
      if(!array1 || !array2) return false;
      if(array1.length===0){
        if(array2.length===0){
          return true;
        }else{
          return false;
        }
      }else{
        if(array2.length===0 || array2.length!==array1.length){
          return false;
        }
      }
      var r1=array1[0];
      var r2=array2[0];
      var attributes=[];
      var sortFunc=(r,s)=>{
        for(var attr in r1){
          if(r[attr]<s[attr]){
            return -1;
          }else if(r[attr]>s[attr]){
            return 1;
          }
        }
        return -1;
      };
      array1.sort(sortFunc);
      array2.sort(sortFunc);
      return this.areResultsEqual(array1,array2);
    }
    areResultsEqual(array1,array2){
      if(!array1 || !array2) return false;
      if(array1.length!==array2.length){
        return false;
      }
      if(array1.length===0){
        return true;
      }
      var n1=0;
      var r1=array1[0];
      for(var a in r1){
        n1++;
      }
      var r2=array2[0];
      var n2=0;
      for(var a in r2){
        n2++;
      }
      if(n1!==n2) return false;
      for(var i=0;i<n1;i++){
        var r1=array1[i];
        var s1=0;
        for(var a in r1){
          s1++;
        }
        var s2=0;
        for(var a in r2){
          s2++;
        }
        if(s1!==s2) return false;
        var r2=array2[i];
        for(var a in r1){
          if(a in r2){
            if(r1[a]!==r2[a]) return false;
          }else{
            return false;
          }
        }
      }
      return true;
    }
  }

  function $clearAlaSQL(){
    var tables=Object.keys(alasql.tables);
    if(tables){
      for(var i=0;i<tables.length;i++){
        var c="drop table "+tables[i];
        try{
          alasql(c);
        }catch(e){
          console.log(e);
        }
      }
    }
  }

  class Exception{
    $constructor(message,line){
      this.message=message;
      this.line=line;
    }
    toString(){
      return this.message;
    }
    getMessage(){
      return this.message;
    }
  }

  class Pattern{
    static CASE_INSENSITIVITY=1;
    static MULTI_LINE=2;
    static DOT_ALL=4;
    $constructor(regex, flags){
      if(!flags){
        flags=0;
      }
      this._regex=regex;
      this._flags=flags;
      let flagInfos=["i","m","s"];
      let index=0;
      this._jsFlags="";
      while(flags>0 && index<flagInfos.length){
        if(flags%2 === 1){
          this._jsFlags+=flagInfos[index];
          flags=(flags-1)/2;
        }else{
          flags=flags/2;
        }
        index++;
      }
      this._jsRegexp=new RegExp(regex,this._jsFlags);
      this._jsRegexpGlobal=new RegExp(regex,this._jsFlags+"g");
    }
    static compile(regex, flags){
      let p=$new(Pattern,regex, flags);
      return p;
    }
    flags(){
      return this._flags;
    }
    pattern(){
      return this._regex;
    }
    split(input){
      return input.split(this._jsRegexp);
    }
    matcher(input){
      return $new(Matcher,this,input)
    }
  }

  class Matcher{
    $constructor(pattern,input){
      this.usePattern(pattern);
      this.reset(input);
    }
    find(start){
      let text=this._input;
      if(start!==undefined){
        this.reset(this._input);
        text=text.substring(start);
      }else{
        start=0;
      }
      this._findOffset=start;
      this._groups=this._regexpGlobal.exec(text);
      return (this._groups!==null);
    }
    group(group){
      if(!group) group=0;
      if(group<0 || !this._groups || group>=this._groups.length){
        throw $new(Exception,"Index außerhalb der Array-Grenzen");
      }
      return this._groups[group];
    }
    groupCount(){
      return this._groupCount;
    }
    hitEnd(){

    }
    matches(){
      let lastIndex=this._regexpGlobal.lastIndex;
      this._regexpGlobal.lastIndex=0;
      let b=this.find();
      this._regexpGlobal.lastIndex=lastIndex;
      if(!b){
        return false;
      }
      if(this._groups[0].length===this._input.length){
        return true;
      }else{
        return false;
      }
    }
    pattern(){
      return this._pattern;
    }
    region(start,end){

    }
    regionStart(){

    }
    regionEnd(){

    }
    replaceAll(replacement){
      return this._input.replace(this._pattern._jsRegexpGlobal,replacement);
    }
    replaceFirst(replacement){
      return this._input.replace(this._pattern._jsRegexp,replacement);
    }
    requiresEnd(){

    }
    reset(input){
      this._input=input;
      this._regionStart=-1;
      this._regionEnd=-1;
      this._findOffset=0;
      this._regexp.lastIndex=0;
      this._regexpGlobal.lastIndex=0;
    }
    _bounds(group){
      if(!group){
        group=0;
      }
      if(!this._groups || group>=this._groups.length){
        throw $new(Exception,"Diese Gruppe gibt es nicht.");
      }
      group=this._groups[group];
      let all=this._groups[0];
      let pos=all.indexOf(group);
      let start=this._groups.index+pos+this._findOffset;
      let end=start+group.length;
      return [start,end];
    }
    start(group){
      return this._bounds(group)[0];
    }
    end(group){
      return this._bounds(group)[1];
    }
    usePattern(pattern){
      this._pattern=pattern;
      this._regexp=new RegExp(pattern._regex,pattern._jsFlags);
      this._regexpGlobal=new RegExp(pattern._regex,pattern._jsFlags+"g");
      this._groupCount=(new RegExp(pattern._regex+"|")).exec('').length-1;
    }
  }

  class Arrays{
    static asList(array){

    }
    static sort(array, from, to){

    }
    static binarySearch(){
      
    }
  }

  class ArrayList{
    $constructor(typeArguments,initialCapacity){
      this.$elementType=typeArguments["T"];
      if(initialCapacity===undefined){
        initialCapacity=10;
      }
      this.capacity=initialCapacity;
      this.elements=$createArrayValues(this.$elementType,1);//new Array(initialCapacity);
      this.$size=0;
    }
    $isIndexOutOfBounds(index){
      return (index<0 || index>this.$size);
    }
    $getIndexOutOfBoundsException(index){
      return $new(Exception,"IndexOutOfBoundsException: Der Index "+index+" liegt außerhalb der Grenzen von 0 bis "+this.$size+".");
    }
    $grow(){
      if(this.$size>=this.capacity){
        this.capacity*=2;
        return true;
      }
      return false;
    }
    add(index,element){
      if(element===undefined){
        this.elements.push(index);
      }else{
        if(this.$isIndexOutOfBounds(index)){
          throw this.$getIndexOutOfBoundsException(index);
        }
        this.elements.splice(index,0,element);
      }
      this.$size++;
      this.$grow();
      return true;
    }
    remove(index){
      if(typeof index===this.$elementType.name){
        index=this.elements.indexOf(index);
        if(index<0){
          return false;
        }
      }else{
        if(this.$isIndexOutOfBounds(index)){
          throw this.$getIndexOutOfBoundsException(index);
        }
      }
      this.elements.splice(index,1);
      this.$size--;
      return true;
    }
    clear(){
      this.elements=[];
      this.$size=0;
    }
    addAll(index,collection){
      let append=false;
      if(collection===undefined){
        collection=index;
        append=true;
      }
      if(collection===null){
        throw $new(Exception,"NullPointerException: Die übergebene Kollektion ist null.");
      }
      if(collection.elements.length===0) return false;
      this.$size+=collection.elements.length;
      if(append){
        this.elements=this.elements.concat(collection.elements);
      }else{
        this.elements.splice.apply(this.elements,[index,0].concat(collection.elements));
      }
      while(this.$grow()){};
      return true;
    }
    get(index){
      if(this.$isIndexOutOfBounds(index)){
        throw this.$getIndexOutOfBoundsException(index);
      }
      return this.elements[index];
    }
    set(index,element){
      if(this.$isIndexOutOfBounds(index)){
        throw this.$getIndexOutOfBoundsException(index);
      }
      this.elements[index]=element;
    }
    toArray(){
      let array=[];
      for(let i=0;i<this.$size;i++){
        array.push(this.elements[i]);
      }
      return $createArray(this.$elementType,1,array);
    }
    size(){
      return this.$size;
    }
    isEmpty(){
      return this.$size===0;
    }
    contains(element){
      return (this.indexOf(element)>=0);
    }
    indexOf(element){
      return this.elements.indexOf(element);
    }
    lastIndexOf(element){
      return this.elements.lastIndexOf(element);
    }
    removeRange(fromIndex,toIndex){
      if(this.$isIndexOutOfBounds(fromIndex)){
        throw this.$getIndexOutOfBoundsException(fromIndex);
      }
      if(this.$isIndexOutOfBounds(toIndex)){
        throw this.$getIndexOutOfBoundsException(toIndex);
      }
      if(fromIndex>toIndex){
        throw $new(Exception,"IndexOutOfBoundsException: Der erste Index darf nicht größer sein als der zweite.");
      }
      this.elements.splice(fromIndex,toIndex-fromIndex);
      this.$size-=toIndex-fromIndex;
    }
    removeAll(collection){
      let changed=false;
      for(let i=0;i<this.elements.length;i++){
        let e=this.elements[i];
        if(collection.contains(e)){
          this.elements.splice(i,1);
          changed=true;
          this.$size--;
          i--;
        }
      }
      return changed;
    }
    async sort(comparator){
      comparator=comparator.compare;
      let f=comparator.toString();
      f=f.replace(/\$scope\.(?:push|pop)Layer\(\);/g,"");
      f=f.replace(/\$App.debug.line\(\d+,"[^"]+",\$scope\);/g,"");
      comparator=$Exercise.convertAsyncArrowFunction(f);
      // let n=this.size();
      // for(let i=0;i<n;i++){
      //   for(let j=0;j<n-i-1;j++){
      //     let c=this.get(j);
      //     if(await comparator.compare(c,this.get(j+1))>0){
      //       this.set(j,this.get(j+1));
      //       this.set(j+1,c);
      //     }
      //   }
      // }
      this.elements.sort((a,b)=>comparator(a,b));
    }
  }

  class Queue{
    $constructor(){
      this.start=null;
      this.end=null;
    }
    isEmpty(){
      return this.start===null;
    }
    add(w){
      let n={
        v: w,
        n: null
      }
      if(this.end===null){
        this.start=n;
      }else{
        this.end.n=n;
      }
      this.end=n;
    }
    remove(){
      if(this.start==null) return null;
      let s=this.start;
      this.start=this.start.n;
      if(this.end===s){
        this.end=this.start;
      }
      return s.v;
    }
    peek(){
      if(this.start===null) return null;
      return this.start.v;
    }
  }

  class Stack{
    $constructor(){
      this.start=null;
    }
    isEmpty(){
      return this.start===null;
    }
    push(w){
      let n={
        v: w,
        n: this.start
      }
      this.start=n;
    }
    pop(){
      if(this.start==null) return null;
      let s=this.start;
      this.start=this.start.n;
      return s.v;
    }
    top(){
      if(this.start===null) return null;
      return this.start.v;
    }
  }

  class HashMap{
    $constructor(){
      this.data={};
      this.$count=0;
    }
    put(k,v){
      if(!(k in this.data)) this.$count++;
      this.data[k]=v;
    }
    get(k){
      if(!(k in this.data)) return null;
      return this.data[k];
    }
    remove(k){
      if(!(k in this.data)) return;
      this.$count--;
      delete this.data[k];
    }
    containsKey(k){
      return (k in this.data);
    }
    isEmpty(){
      return this.$count===0;
    }
    size(){
      return this.$count;
    }
    keys(){
      let k=[];
      for(let a in this.data){
        k.push(a);
      }
      return k;
    }
    values(){
      let k=[];
      for(let a in this.data){
        k.push(this.data[a]);
      }
      return k;
    }
  }

  class ActionEvent{
    $constructor(source,id,command,when){
      this.source=source;
      this.id=id;
      this.command=command;
      this.when=when;
      if(!this.command){
        this.command=null;
      }
    }
    getActionCommand(){
      return this.command;
    }
    getWhen(){
      return this.when;
    }
    getSource(){
      return this.source;
    }
  }

  /**mimics javax.swing.timer-class */
  class Timer{
    $constructor(delay,actionListener){
      this.initialDelay=delay;
      this.delay=delay;
      this.repeats=true;
      this.$actionListeners=[actionListener];
      this.actionCommand=null;
      this.$timer_id=null;
      this.$running=false;
    }
    addActionListener(al){
      this.$actionListeners.push(al);
    }
    removeActionListener(al){
      let index=this.$actionListeners.indexOf(al);
      if(index<0) return;
      this.$actionListeners.splice(index,1);
    }
    setActionCommand(command){
      this.actionCommand=command;
    }
    getActionCommand(){
      return this.actionCommand;
    }
    setRepeats(v){
      this.repeats=v;
    }
    isRepeats(){
      return this.repeats;
    }
    setDelay(delay){
      this.delay=delay;
      if(!this.isRunning()) return;
      this.restart(this.delay);
    }
    getDelay(){
      return this.delay;
    }
    isRunning(){
      return this.$running;
    }
    start(){
      if(this.$running) return;
      this.restart();
    }
    restart(delay){
      if(this.$running) this.stop();
      this.$running=true;
      let handler=()=>{
        if($App.debug.paused) return;
        for(let i=0;i<this.$actionListeners.length;i++){
          let al=this.$actionListeners[i];
          let ev=$new(ActionEvent,this,0,this.actionCommand,Date.now());
          al.actionPerformed(ev);
        };
      };
      let timeoutHandler=()=>{
        if(this.repeats){
          this.$timer_id=setInterval(()=>{
            if(!this.repeats){
              clearInterval(this.$timer_id);
            }
            handler();
          },this.delay);
        }
        handler();
      };
      this.$timer_id=setTimeout(timeoutHandler,delay!==undefined? delay:this.initialDelay);
    }
    stop(){
      clearTimeout(this.$timer_id);
      clearInterval(this.$timer_id);
      this.$running=false;
    }
  }
  $App.$gamepads=[];

  $App.getGamepadByIndex=function(index){
    for(let i=0;i<$App.$gamepads.length;i++){
      let g=$App.$gamepads[i];
      if(!g.physicalGamepad) continue;
      if(g.physicalGamepad.index===index){
        return g;
      }
    }
    return null;
  };
  $App.getGamepadWithoutPhysicalGamepad=function(index){
    for(let i=0;i<$App.$gamepads.length;i++){
      let g=$App.$gamepads[i];
      if(!g.physicalGamepad) return g;
    }
    return null;
  };

  window.addEventListener("gamepadconnected", function(e) {
    console.log("gamepad connect",e.gamepad.index);
  });
  
  window.addEventListener("gamepaddisconnected", function(e) {
    console.log("gamepad disconnect",e.gamepad.index);
  });

  $App.$onGamepadButtonPress=function(gamepad,buttonNr){
    if(!$App.gamepadSettingsDialog.isWaitingFor || gamepad!==$App.gamepadSettingsDialog.gamepad) return;
    $App.gamepadSettingsDialog.capturePress(buttonNr);
  };

  $App.gamepadSettingsDialog={
    STORAGE: "JAVA-APP-GAMEPAD-MAPPINGS",
    allMappings: null,
    ui: null,
    id: null,
    isWaitingFor: null,
    pressKeyDialog: null,
    mapping: [],
    axisLR: null,
    axisUD: null,
    buttonIndices: null,
    gamepad: null,
    create(gamepad){
      this.pressKeyDialog=document.createElement("div");
      this.pressKeyDialog.style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; opacity: 0.7";
      let div=document.createElement("div");
      div.textContent="Drücke eine Taste auf dem Gamepad...";
      this.pressKeyDialog.appendChild(div);
      let b=document.createElement("button");
      b.textContent="Abbrechen";
      b.onclick=()=>{
        this.ui.removeChild(this.pressKeyDialog);
        this.isWaitingFor=null;
      };
      let bRemove=document.createElement("button");
      bRemove.textContent="Belegung entfernen";
      bRemove.onclick=()=>{
        this.capturePress(-1);
      };
      this.pressKeyDialog.appendChild(b);
      this.pressKeyDialog.appendChild(bRemove);
      this.ui=document.createElement("div");
      let cap=document.createElement("h2");
      cap.textContent="Gamepad-Einstellungen";
      this.ui.appendChild(cap);
      this.id=document.createElement("div");
      this.ui.appendChild(this.id);
      
      div=document.createElement("div");
      cap=document.createElement("h3");
      cap.textContent="Analog-Stick";
      this.ui.appendChild(cap);
      cap=document.createElement("span");
      cap.textContent="Horizontal:";
      this.axisLR=document.createElement("select");
      div.appendChild(cap);
      div.appendChild(this.axisLR);
      this.ui.appendChild(div);

      div=document.createElement("div");
      cap=document.createElement("span");
      cap.textContent="Vertikal:";
      this.axisUD=document.createElement("select");
      div.appendChild(cap);
      div.appendChild(this.axisUD);
      this.ui.appendChild(div);

      this.axisLR.onchange=(ev)=>{
        this.mapping.leftRight=this.axisLR.selectedIndex;
      };

      this.axisUD.onchange=(ev)=>{
        this.mapping.upDown=this.axisUD.selectedIndex;
      };

      cap=document.createElement("h3");
      cap.textContent="Tastenbelegung";
      this.ui.appendChild(cap);
      let table=document.createElement("div");
      table.className="java-app-gamepad-settings-dialog-table";
      this.ui.appendChild(table);
      this.buttonIndices={};
      let buttons=["Left", "Right", "Up", "Down","A","B","X","Y"]
      for(let i=0;i<buttons.length;i++){
        let b=buttons[i];
        let row=document.createElement("div");
        table.appendChild(row);
        let l=document.createElement("span");
        l.textContent=b;
        row.appendChild(l);
        let td2=document.createElement("span");
        td2.textContent=gamepad.getMappingIndex(b);
        this.buttonIndices[b]=td2;
        row.appendChild(td2);
        row.onclick=()=>{
          this.ui.appendChild(this.pressKeyDialog);
          this.isWaitingFor={
            el: td2,
            button: b
          };
        };
      }
      this.ui.className="java-app-gamepad-settings-dialog";

      div=document.createElement("div");
      div.style="margin-top: 0.5rem";
      this.ui.appendChild(div);
      let bSave=document.createElement("button");
      bSave.textContent="Speichern";
      div.appendChild(bSave);
      let bCancel=document.createElement("button");
      bCancel.textContent="Abbrechen";
      div.appendChild(bCancel);
      bCancel.onclick=()=>{
        document.body.removeChild(this.ui);
        this.isWaitingFor=null;
      };
      bSave.onclick=()=>{
        document.body.removeChild(this.ui);
        this.isWaitingFor=null;
        this.gamepad.mapping=JSON.parse(JSON.stringify(this.mapping));
        if(!this.allMappings) this.allMappings={};
        this.allMappings[this.gamepad.physicalGamepad.id]=JSON.parse(JSON.stringify(this.mapping));
        System.storage.saveObject(this.STORAGE,this.allMappings);
      };
    },
    capturePress(buttonNr){
      let oldIndex=this.mapping.action.indexOf(this.isWaitingFor.button);
      if(oldIndex>=0) delete this.mapping.action[oldIndex];
      this.mapping.action[buttonNr]=this.isWaitingFor.button;
      this.ui.removeChild(this.pressKeyDialog);
      this.isWaitingFor=null;
      this.updateUI();
    },
    updateUI(){
      for(let a in this.buttonIndices){
        let td=this.buttonIndices[a];
        td.textContent=this.mapping.action.indexOf(a);
      }
      let axes=this.gamepad.physicalGamepad.axes;
      while(this.axisLR.firstChild) this.axisLR.removeChild(this.axisLR.firstChild);
      while(this.axisUD.firstChild) this.axisUD.removeChild(this.axisUD.firstChild);
      for(let i=0;i<axes.length;i++){
        let o=document.createElement("option");
        o.textContent=i;
        o.value=i;
        this.axisLR.appendChild(o);
        o=document.createElement("option");
        o.textContent=i;
        o.value=i;
        this.axisUD.appendChild(o);
      }
      this.axisLR.selectedIndex=this.mapping.leftRight;
      this.axisUD.selectedIndex=this.mapping.upDown;
    },
    initUI(){
      this.id.textContent=this.gamepad.physicalGamepad.id;
      this.mapping=JSON.parse(JSON.stringify(this.gamepad.mapping));
      for(let a in this.buttonIndices){
        let td=this.buttonIndices[a];
        td.textContent=this.gamepad.getMappingIndex(a);
      }
      this.updateUI();
    },
    show(gamepad){
      this.isWaitingFor=null;
      if(!this.ui) this.create(gamepad);
      this.gamepad=gamepad;
      this.initUI();
      document.body.appendChild(this.ui);
    },
    hide(){
      document.body.removeChild(this.ui);
      this.isWaitingFor=null;
    }
  };

  $App.$gamepadMappingsLoaded=-1;

  class Gamepad{
    $constructor(){
      if($App.$gamepadMappingsLoaded<0){
        $App.$gamepadMappingsLoaded=0;
        let timer=setInterval(async ()=>{
          if(System.storage){
            $App.$gamepadMappingsLoaded=1;
            clearInterval(timer);
            $App.gamepadSettingsDialog.allMappings=await System.storage.loadObject($App.gamepadSettingsDialog.STORAGE);
            //console.log("gamepad mapping loaded",$App.gamepadSettingsDialog.allMappings);
            for(let i=0;i<$App.$gamepads.length;i++){
              let gp=$App.$gamepads[i];
              if(gp.physicalGamepad){
                let map=$App.gamepadSettingsDialog.allMappings[gp.physicalGamepad.id];
                if(map && map.action){
                  gp.mapping=JSON.parse(JSON.stringify(map));
                }
              }
            }
          }
        },100);
      }
      $App.$gamepads.push(this);
      this.rootElement=document.body;
      this.mapping={
        action: ["A","B","X","Y"],
        upDown: 1,
        leftRight: 0
      };
      this.physicalGamepadState=[];
      this.buttonHandlers={};
      this.padding="0.5cm";
      this.width="100%";
      this.buttonSize=1;
      this.dpad=new DPad(this);
      this.$timeouts={};
      this.settingsButton=document.createElement("div");
      this.settingsButton.className="gamepad-button-settings java-app-unselectable";
      this.settingsButton.style="position: absolute;";
      this.settingsButton.innerHTML="&#9881;";
      this.settingsButton.onclick=()=>{
        $App.gamepadSettingsDialog.show(this);
      };
      this.rootElement.appendChild(this.settingsButton);
      this.buttons={
        B: new GamepadButton(this,"B","B","yellow","black"),
        A: new GamepadButton(this,"A","A","red","black"),
        Y: new GamepadButton(this,"Y","Y","green","white"),
        X: new GamepadButton(this,"X","X","blue","white"),
        // SELECT: new GamepadButton(this,"SELECT","Select","grey","black"),
        // START: new GamepadButton(this,"START","Start","grey","black")
      };
      this.setPosition("0cm","0cm");
      this.setKey("up",38);
      this.setKey("down",40);
      this.setKey("left",37);
      this.setKey("right",39);
      this.setKey("B","B");
      this.setKey("A","A");
      this.setKey("X","X");
      this.setKey("Y","Y");
      this.setKey("Start","P");
      this.setKey("Select","O");
      this.keydownListener=(ev)=>{
        let k=ev.keyCode;
        k=String.fromCodePoint(k).toLowerCase().codePointAt(0);
        for(let a in this.buttons){
          let b=this.buttons[a];
          if(b.keyDown(k)){
          }
        }
        this.dpad.keyDown(k,true);

      };
      window.addEventListener("keydown",this.keydownListener);
      this.keyupListener=(ev)=>{
        let k=ev.keyCode;
        k=String.fromCodePoint(k).toLowerCase().codePointAt(0);
        for(let a in this.buttons){
          let b=this.buttons[a];
          b.keyUp(k);
        }
        this.dpad.keyUp(k);
      };
      window.addEventListener("keyup",this.keyupListener);
      let keys=["left","right","up","down","A","B","X","Y"];
      if(!$main) return;
      if($main.onGamepad){
        for(let i=0;i<keys.length;i++){
          let k=keys[i];
          this.setEventListener(k,"press",{
            actionPerformed(ev){
              window.onGamepadDown(k);
            }
          });
        }
      }
      if($main.onGamepadRelease){
        for(let i=0;i<keys.length;i++){
          let k=keys[i];
          this.setEventListener(k,"release",{
            actionPerformed(ev){
              window.onGamepadUp(k);
            }
          });
        }
      }
      this.setPhysicalGamepad(null);
    }
    setMappingIndex(name,index){
      let indexOld=this.getMappingIndex(name);
      if(indexOld>=0) delete this.mapping.action[indexOld];
      this.mapping.action[index]=name;
    }
    getMappingIndex(name){
      return this.mapping.action.indexOf(name);
    }
    updatePhysicalGamepad(gamepad){
      this.setPhysicalGamepad(gamepad);

      /*
      g.axes: Array mit double:
      oben/unten: 1: -1/1
      links/rechts: 0: -1/1
      */

      if(gamepad.axes[this.mapping.leftRight]<-0.4){
        this.dpad.buttons.w.setPressed(true);
        this.dpad.buttons.e.setPressed(false);
        this.physicalGamepadState.lr=-1;
      }else if(gamepad.axes[this.mapping.leftRight]>0.4){
        this.dpad.buttons.w.setPressed(false);
        this.dpad.buttons.e.setPressed(true);
        this.physicalGamepadState.lr=1;
      }else{
        if(this.physicalGamepadState.lr!==0){
          this.dpad.buttons.w.setPressed(false);
          this.dpad.buttons.e.setPressed(false);
          this.physicalGamepadState.lr=0;
        }
      }
      if(gamepad.axes[this.mapping.upDown]<-0.4){
        this.dpad.buttons.n.setPressed(true);
        this.dpad.buttons.s.setPressed(false);
        this.physicalGamepadState.ud=-1;
      }else if(gamepad.axes[this.mapping.upDown]>0.4){
        this.dpad.buttons.n.setPressed(false);
        this.dpad.buttons.s.setPressed(true);
        this.physicalGamepadState.ud=1;
      }else{
        if(this.physicalGamepadState.ud!==0){
          this.dpad.buttons.n.setPressed(false);
          this.dpad.buttons.s.setPressed(false);
          this.physicalGamepadState.ud=0;
        }
      }

      let left=0,right=0,up=0,down=0;
      for(let i=0;i<gamepad.buttons.length;i++){
        let m=this.mapping.action[i];
        //physical and virtual buttons:
        let pb=gamepad.buttons[i];
        if(!this.physicalGamepadState[i] && pb.pressed){
          $App.$onGamepadButtonPress(this,i);
        }
        let vb;
        if(m==="Left") vb=this.dpad.buttons.w;
        else if(m==="Right") vb=this.dpad.buttons.e;
        else if(m==="Up") vb=this.dpad.buttons.n;
        else if(m==="Down") vb=this.dpad.buttons.s;
        else vb=this.buttons[m];
        if(pb.pressed){
          if(vb){
            vb.setPressed(true);
          }
        }else{
          if(this.physicalGamepadState[i] && vb){
            vb.setPressed(false);
          }
        }
        this.physicalGamepadState[i]=pb.pressed;
      }

      
    }
    setPhysicalGamepad(gamepad){
      if(this.physicalGamepad===gamepad) return;
      this.physicalGamepad=gamepad;
      if(this.physicalGamepad){
        this.settingsButton.style.display="";
      }else{
        this.settingsButton.style.display="none";
      }
      if($App.gamepadSettingsDialog.allMappings){
        let map=$App.gamepadSettingsDialog.allMappings[gamepad.id];
        if(map && map.action){
          this.mapping=JSON.parse(JSON.stringify(map));
        }
      }
    }
    setKey(button,key){
      if(key.toLowerCase){
        key=key.toLowerCase();
        let dirs={
          left: 13,
          right: 14,
          up: 18,
          down: 19
        };
        if(key in dirs){
          key=dirs[key];
        }
        key=key.codePointAt(0);
      }
      if(button in this.buttons){
        let b=this.buttons[button];
        b.setKey(key);
        return;
      }
      this.dpad.setKey(button,key);
    }
    getActionButtonByName(button){
      if(button in this.buttons){
        return this.buttons[button];
      }
      return null;
    }
    setPosition(x,y){
      this.x=x;
      this.y=y;
      this.updateLayout();
    }
    updateLayout(){
      let x=this.x;
      let y=this.y;
      this.dpad.setPosition(x,y);
      this.dpad.setPadding(this.padding);
      this.buttons.B.setBounds(x+" + "+this.width+" - "+this.padding,y+" + "+this.padding,this.buttonSize,-2.2,0);
      this.buttons.A.setBounds(x+" + "+this.width+" - "+this.padding,y+" + "+this.padding,this.buttonSize,-1,1);
      this.buttons.Y.setBounds(x+" + "+this.width+" - "+this.padding,y+" + "+this.padding,this.buttonSize,-3.4,1);
      this.buttons.X.setBounds(x+" + "+this.width+" - "+this.padding,y+" + "+this.padding,this.buttonSize,-2.2,2);
      this.settingsButton.style.left="calc( "+x+" + "+this.width+" / 2 "+")";
      this.settingsButton.style.bottom="calc( "+y+" + "+this.padding+" )";
    }
    setWidth(w){
      this.width=w;
      this.updateLayout();
    }
    setDirectionButtonsSize(size){
      this.dpad.setSize(size);
      this.updateLayout();
    }
    setActionButtonsSize(size){
      this.buttonSize=size;
      this.updateLayout();
    }
    setEventListener(button, event, handler){
      event=event.toLowerCase();
      button=button.toLowerCase();
      this.buttonHandlers[button+":"+event]=handler;
    }
    onButtonEvent(button,event,eventData){
      //$App.$gamepadButtonEvent(button,event,eventData);
      event=event.toLowerCase();
      button=button.toLowerCase();
      let key=button+":"+event;
      if(this.$timeouts[key]) return;
      let handler=this.buttonHandlers[key];
      if(!handler) return;
      this.$timeouts[key]=true;
      setTimeout(()=>{
        delete this.$timeouts[key];
      },10);
      handler.actionPerformed(eventData);
    }
    getDirection(){
      return this.dpad.getAngle();
    }
    isAnyDirectionPressed(){
      return this.getDirection()>=0;
    }
    isUpPressed(){
      return this.dpad.isPressed("n");
    }
    isDownPressed(){
      return this.dpad.isPressed("s");
    }
    isRightPressed(){
      return this.dpad.isPressed("e");
    }
    isLeftPressed(){
      return this.dpad.isPressed("w");
    }
    isAPressed(){
      // if(this.physicalGamepadIndex>=0){
      //   let g=navigator.getGamepads()[this.physicalGamepadIndex];
      //   if(g.buttons[0].pressed){
      //     return true;
      //   }
      // }
      return this.buttons.A.isPressed;
    }
    isBPressed(){
      return this.buttons.B.isPressed;
    }
    isXPressed(){
      return this.buttons.X.isPressed;
    }
    isYPressed(){
      return this.buttons.Y.isPressed;
    }
    setButtonVisible(button,visible){
      let b=this.getActionButtonByName(button);
      if(b){
        b.setVisible(visible);
      }else{
        this.dpad.setButtonVisible(button,visible);
      }

    }
  }

  class DPad{
    constructor(gamepad){
      this.gamepad=gamepad;
      this.buttons={
        center: null,
        s: "n",
        n: "s",
        w: "e",
        e: "w",
        ne: null,
        nw: null,
        se: null,
        sw: null,
      };
      
      for(let a in this.buttons){
        this.buttons[a]=new DPadButton(this,a,this.buttons[a]);
      }
      for(let a in this.buttons){
        if(a.length===2){
          this.buttons[a].setToDiagonal(this.buttons[a.charAt(0)],this.buttons[a.charAt(1)]);
        }
      }
      this.scaling=1;
      this.setPosition("1cm","1cm");
      this.buttons.center.hide();
    }
    handleEvent(dir,eventName,eventData){
      let translation={
        s: "down",
        n: "up",
        e: "right",
        w: "left"
      };
      if(!(dir in translation)) return;
      dir=translation[dir];
      this.gamepad.onButtonEvent(dir,eventName,eventData);
    }
    keyDown(key){
      for(let a in this.buttons){
        let b=this.buttons[a];
        b.keyDown(key);
      }
    }
    keyUp(key){
      for(let a in this.buttons){
        let b=this.buttons[a];
        b.keyUp(key);
      }
    }
    setKey(button,key){
      button=button.toLowerCase();
      let translation={
        up: "n",
        down: "s",
        right: "e",
        left: "w"
      };
      if(button in translation){
        button=translation[button];
      }
      if(!this.buttons[button]) return;
      this.buttons[button].setKey(key);
    }
    isPressed(dir){
      if(!this.buttons[dir]) return false;
      return this.buttons[dir].isPressed;
    }
    getAngle(){
      let n=this.buttons.n.isPressed;
      let s=this.buttons.s.isPressed;
      let e=this.buttons.e.isPressed;
      let w=this.buttons.w.isPressed;
      if(n && s){
        n=false;
        s=false;
      }
      if(w && e){
        w=false;
        e=false;
      }
      if(n && w) return 135;
      if(n && e) return 45;
      
      if(s && w) return 225;
      if(s && e) return 315;
      if(n) return 90;
      if(s) return 270;
      if(w) return 180;
      if(e) return 0;
      return -1;

    }
    getDirection(){
      let dir="";
      for(let a in this.buttons){
        let b=this.buttons[a];
        if(a.length===1 && b.isPressed){
          dir+=a;
        }
      }
      return dir;
    }
    getButtonByName(name){
      let button=name.toLowerCase();
      let translation={
        up: "n",
        down: "s",
        right: "e",
        left: "w"
      };
      if(button in translation){
        button=translation[button];
      }
      if(button in this.buttons){
        return this.buttons[button];
      }else{
        return null;
      }
    }
    setButtonVisible(button,v){
      let b=this.getButtonByName(button);
      if(b){
        b.setVisible(v);
      }
    }
    setSize(size){
      this.scaling=size;
      this.updateLayout();
    }
    setPadding(p){
      this.padding=p;
      this.updateLayout();
    }
    setPosition(left, bottom){
      this.left=left;
      this.bottom=bottom;
      this.updateLayout();
    }
    updateLayout(){
      let left=this.left;
      let bottom=this.bottom;
      let padding=this.padding;
      this.buttons.nw.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,0,2);
      this.buttons.n.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,1,2);
      this.buttons.ne.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,2,2);
      this.buttons.w.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,0,1);
      this.buttons.e.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,2,1);
      this.buttons.sw.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,0,0);
      this.buttons.s.setBounds(left+ " + "+padding,bottom+" + "+padding,this.scaling,1,0);
      this.buttons.se.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,2,0);
      this.buttons.center.setBounds(left+" + "+padding,bottom+" + "+padding,this.scaling,1,1);
    }
  }

  class GamepadButton{
    constructor(gamepad,name,label,background,foreground){
      this.gamepad=gamepad;
      this.name=name;
      this.ui=document.createElement("div");
      this.ui.innerHTML=label;
      this.ui.style="z-index: 100;border-radius: 100%; border: 1pt solid black; opacity: 0.5; position: fixed; aspect-ratio: 1;touch-action: none; display: flex;justify-content: center; align-items: center; font-weight: bold,user-select: none;overflow: hidden";
      this.ui.className="java-app-unselectable";
      this.setColor(background,foreground);
      this.gamepad.rootElement.appendChild(this.ui);
      this.isPressed=false;
      this.ui.addEventListener("pointerenter",(ev)=>{
        let wasPressed=this.isPressed;
        this.isPressed=ev.buttons>0;
        this.updateHover();
        if(this.isPressed && !wasPressed){
          this.gamepad.onButtonEvent(this.name,"press",ev);
        }
      });
      this.ui.addEventListener("pointerdown",(ev)=>{
        try{
          ev.target.releasePointerCapture(ev.pointerId);
        }catch(e){}
        this.isPressed=ev.buttons>0;
        this.updateHover();
        if(this.isPressed){
          this.gamepad.onButtonEvent(this.name,"press",ev);
        }
      });
      this.ui.addEventListener("pointerup",(ev)=>{
        this.isPressed=false;
        this.updateHover();
        this.gamepad.onButtonEvent(this.name,"release",ev);
      });
      this.ui.addEventListener("pointerout",(ev)=>{
        let wasPressed=this.isPressed;
        this.isPressed=false;
        this.updateHover();
        if(wasPressed) this.gamepad.onButtonEvent(this.name,"release",ev);
      });
      this.ui.addEventListener("click",(ev)=>{
        this.gamepad.onButtonEvent(this.name,"click",ev);
      });
    }
    setVisible(v){
      if(v){
        this.ui.style.display="";
      }else{
        this.ui.style.display="none";
      }
    }
    setKey(key){
      this.key=key;
    }
    setPressed(pressed){
      let wasPressed=this.isPressed;
      if(wasPressed===pressed) return false;
      this.isPressed=pressed;
      this.updateHover();
      this.gamepad.onButtonEvent(this.name,pressed?"press":"release",{});
      return true;
    }
    keyDown(key){
      if(this.key===key){
        this.setPressed(true);
        // let wasPressed=this.isPressed;
        // this.isPressed=true;
        // this.updateHover();
        // if(!wasPressed){
        //   this.gamepad.onButtonEvent(this.name,"press",{});
        // }
        
        return true;
      }
      return false;
    }
    keyUp(key){
      if(this.key===key){
        this.setPressed(false);
        // let wasPressed=this.isPressed;
        // this.isPressed=false;
        // this.updateHover();
        // if(wasPressed){
        //   this.gamepad.onButtonEvent(this.name,"release",{});
        // }
        return true;
      }
      return false;
    }
    updateHover(){
      if(this.isPressed){
        this.ui.style.opacity=0.8;
      }else{
        this.ui.style.opacity=0.4;
      }
    }
    setColor(background,foreground){
      this.ui.style.backgroundColor=background;
      this.ui.style.color=foreground;
    }
    setBounds(left, bottom, scaling, offsetX,offsetY){
      this.ui.style.left="calc("+left+" + "+offsetX*scaling+"cm)";
      this.ui.style.bottom="calc("+bottom+" + "+offsetY*scaling+"cm)";
      this.ui.style.width=scaling+"cm";
    }
  }

  class DPadButton{
    constructor(dpad,dir,oppositeDir){
      this.key=null;
      this.dpad=dpad;
      this.dir=dir;
      this.oppositeDir=oppositeDir;
      this.diagonal=false;
      this.mainNeighbors=null;
      this.hidden=false;
      this.listeners={
        click: [],
        down: [],
        up: []
      };
      this.isPressed=false;
      this.ui=document.createElement("div");
      this.ui.style="z-index: 100; opacity: 0.5; position: fixed; aspect-ratio: 1; background-color: grey;touch-action: none;user-select: none;";
      this.ui.className="java-app-unselectable";
      this.ui.addEventListener("pointerenter",(ev)=>{
        let wasPressed=this.isPressed;
        this.isPressed=ev.buttons>0;
        this.updateHover();
        if(wasPressed && !this.isPressed){
          this.dpad.handleEvent(this.dir,"release",ev);
        }
        if(!wasPressed && this.isPressed){
          this.dpad.handleEvent(this.dir,"press",ev);
        }
      });
      this.ui.addEventListener("pointerdown",(ev)=>{
        try{
          ev.target.releasePointerCapture(ev.pointerId);
        }catch(e){}
        this.isPressed=ev.buttons>0;
        this.updateHover();
        this.dpad.handleEvent(this.dir,"press",ev);
      });
      this.ui.addEventListener("pointerup",(ev)=>{
        this.isPressed=false;
        this.updateHover();
        this.dpad.handleEvent(this.dir,"release",ev);
      });
      this.ui.addEventListener("pointerout",(ev)=>{
        let wasPressed=this.isPressed;
        this.isPressed=false;
        this.updateHover();
        if(wasPressed){
          this.dpad.handleEvent(this.dir,"release",ev);
        }
      });
      this.ui.addEventListener("click",(ev)=>{
        this.dpad.handleEvent(this.dir,"click",ev);
      });
      this.dpad.gamepad.rootElement.appendChild(this.ui);
    }
    setKey(key){
      this.key=key;
    }
    setPressed(pressed){
      let wasPressed=this.isPressed;
      if(wasPressed===pressed) return false;
      this.isPressed=pressed;
      this.updateHover();
      this.dpad.handleEvent(this.dir,pressed? "press":"release",{});
      return true;
    }
    keyDown(key){
      if(this.key===key){
        this.setPressed(true);
      }
    }
    keyUp(key){
      if(this.key===key){
        this.setPressed(false);
      }
    }
    hide(){
      this.hidden=true;
      this.ui.style.opacity=0;
    }
    setToDiagonal(mainAxis1,mainAxis2){
      this.diagonal=true;
      let dir={
        nw: "top-left",
        ne: "top-right",
        sw: "bottom-left",
        se: "bottom-right"
      }[this.dir];
      if(dir){
        this.ui.style["border-"+dir+"-radius"]="100%";
      }
      this.hide();
      this.mainNeighbors=[mainAxis1,mainAxis2];
    }
    setVisible(v){
      if(v){
        this.ui.style.display="";
      }else{
        this.ui.style.display="none";
      }
    }
    updateHover(){
      if(this.diagonal){
        for(let i=0;i<this.mainNeighbors.length;i++){
          let n=this.mainNeighbors[i];
          n.isPressed=this.isPressed;
          n.updateHover();
        }
      }
      if(this.hidden) return;
      if(this.isPressed){
        this.ui.style.opacity=0.8;
      }else{
        this.ui.style.opacity=0.4;
      }
    }

    setBounds(left, bottom, scaling, offsetX,offsetY){
      this.ui.style.left="calc("+left+" + "+offsetX*scaling+"cm)";
      this.ui.style.bottom="calc("+bottom+" + "+offsetY*scaling+"cm)";
      this.ui.style.width=scaling+"cm";
    }
  }

  class World{
    $constructor(description){
      this.tiles=null;
      this.scrollTo(0,0);
      this.setDescription(description);
    }
    getWorldX(x){
      return x+this.scroll.x;
    }
    getWorldY(y){
      return y+this.scroll.y;
    }
    getType(x,y){
      if(!this.tiles) return null;
      y=Math.round(y);
      let line=this.tiles[y];
      if(!line) return null;
      x=Math.round(x);
      if(!line[x]) return null;
      return line[x];
    }
    setType(x,y,type){
      if(!this.tiles) return;
      y=Math.round(y);
      let line=this.tiles[y];
      if(!line) return;
      x=Math.round(x);
      if(!line[x]) return;
      line[x]=type;
    }
    scrollTo(x,y){
      
      this.scroll={
        x: x, y: y
      };
    }
    scrollBy(x,y){
      this.scroll.x+=x;
      this.scroll.y+=y;
    }
    setDescription(s){
      if(!s) return;
      let lines=s.trim().split("\n");
      this.tiles=[];
      for(let i=0;i<lines.length;i++){
        let l=lines[i];
        let row=[];
        this.tiles[lines.length-1-i]=row;
        for(let j=0;j<l.length;j++){
          row.push(l.charAt(j));
        }
      }
    }
    forEachTile(tileHandler){
      if(!this.tiles) return;
      for(let i=0;i<this.tiles.length;i++){
        let l=this.tiles[i];
        for(let j=0;j<l.length;j++){
          let x=j-this.scroll.x//+cx;
          let y=i-this.scroll.y//+cy;
          tileHandler.handleTile(x,y,l[j]);
        }
      }
    }
  }

  class Sound{
    $constructor(url){
      this.setSource(url);
    }
    setSource(url){
      this.url=url;
      let asset=$App.assets[url];
      if(asset){
        this.audio=new Audio($getAssetObjectURL(url));
      }else{
        this.audio=new Audio(this.url);
      }
    }
    play(loop){
      this.stop();
      this.audio.loop=loop;
      this.audio.play();
    }
    pause(){
      if(!this.audio) return;
      this.audio.pause();
    }
    stop(){
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    getDuration(){
      return this.audio.duration;
    }
    getCurrentTime(){
      return this.audio.currentTime;
    }
    setCurrentTime(time){
      this.audio.currentTime=time;
    }
    isEnded(){
      return this.audio.ended;
    }
  }

  function $getData(vname,v,template){
    
    let dim=[];
    if(v.dimension>0){
      if(v.value){
        dim.push(v.value.length);
      }else{
        dim.push(0);
      }
    }

    let type=v.type;
    let isPrimitive=true;
    let constructorName=null;
    if(v && v.value && v.value.constructor) constructorName=v.value.constructor.name;
    if(!type){
      type=constructorName;
      if(type==="Number"){
        type="double";
      }else if(type==="Boolean"){
        type="boolean";
      }
    }
    if(type){
      isPrimitive=type.charAt(0);
      isPrimitive=isPrimitive===isPrimitive.toLowerCase();
    }
    if(!isPrimitive &&  v.value && v.value.constructor){
      type=v.value.constructor.name
    }
    if(vname==="components" && template){
      console.log("components 2",vname,v,type);
    }
    let d={
      n: vname,
      t: type,
      d: dim
    };
    
    if(v.value===null||v.value===undefined || v.dimension===0 && (type==="String" || isPrimitive)){
      d.v=v.value;
      // if(typeof d.v==="string"){
      //   d.v="\""+d.v+"\"";
      //   console.log("string");
      // }
    }else if(template){
      if(v.dimension>0){
        d.v=[];
        let length=v.value.length;
        let elType=type==="Array"? null: type;
        for(let i=0;i<length;i++){
          //name, dimension, type, value
          let value=v.value[i];
          let name="["+i+"]";

          d.v[i]=$getData(name,{dimension:v.dimension-1,elType,value}, name);
        }
      }else{
        d.v={};
        let infos=$clazzRuntimeInfos[d.t];
        // if(type==="ArrayList"){
        //   console.log("ArrayList",v)
        //   d.t+="<"+v.value.$elementType.name+">";
        //   d.v["array"]=$getData("array",{dimension: 1,type: v.value.$elementType.name,value: v.value.elements}, template["array"]);
          
        // }
        for(let name in v.value){
          if(name.startsWith("$")) continue;
          //name, dimension, type, value
          let value=v.value[name];
          let type=null;
          let dimension=0;
          if(infos){
            let attr=infos.attributes[name];
            if(attr && attr.type){
              type=attr.type.baseType;
              dimension=attr.type.dimension;
              d.v[name]=$getData(name,{dimension,type,value}, template[name]);
            }
            
          }else{
            dimension=Array.isArray(value)? 1:0;
            d.v[name]=$getData(name,{dimension,type,value}, template[name]);
          }
          
        }
      }
    }
    return d;
  }
  
  function $getMainData(template){
    if(template) $App.debug.mainTemplate=template;
    let obj=$App.watchedObject;
    if(obj){
      
      let type=obj.constructor.name;
      if(Array.isArray(obj)){

      }
      let global=$getData("main",{type: type,dimension: 0, value: obj}, $App.debug.mainTemplate);
      return global;
    }
    return undefined;
  }

  class JavaApp{
    constructor(){
      if(!window.$main){
        window.$main=this;
        JavaApp.setWatchedObject(this);
        setTimeout(()=>{
          if($main && $main.onStart){
            $main.onStart();
          }
        },10);
      }else{
        throw $new(Exception,"Es darf nur eine Instanz einer JavaApp-Klasse existieren.");
      }
    }
    static setWatchedObject(object){
      $App.setWatchedObject(object);
    }
  }

  class Random{
    $constructor(seed){
      if(seed===undefined){
        seed=Math.floor(Math.random()*36223827);
      }
      this.seed=seed;
    }

    setSeed(seed){
      this.seed=seed;
    }

    static testInts(bound,count){
      let results=[];
      for(let i=0;i<bound;i++){
        results.push(0);
      }
      let r=$new(Random);
      let mu=count/bound;
      let s=Math.sqrt(count*(1/bound)*(1-1/bound));
      for(let i=0;i<count;i++){
        let z=r.nextInt(bound);
        results[z]++;
      }
      console.log(results,mu,s,2*s,3*s);
      for(let i=0;i<bound;i++){
        let c=results[i];
        if(Math.abs(c-mu)>s*2){
          console.error(i,c,count,c/count*100);
        }else{
          console.log(i,c,count,c/count*100);
        }
      }
      
    }

    nextDouble(){
      this.seed++;
      var z=Math.sin(this.seed)*100;
      return z-Math.floor(z);
    }

    nextInt(bound){
      return Math.floor(this.nextDouble()*(bound));
    }
  }
  
  $jstoJSON=async function(obj){
    if(obj===null || obj===undefined) return null;
    if(obj.toJSON){
      obj=await obj.toJSON();
    }
    if(typeof obj!=='object'){
      return obj;
    }
    let json={};
    for(let a in obj){
      if(a.startsWith("$")) continue;
      let b=obj[a];
      json[a]=await $jstoJSON(b);
    }
    return json;
  }

  $jsputData=function(json,target){
    if(!target || !target.constructor) return;
    let infos=$clazzRuntimeInfos[target.constructor.name];
    if(!infos) return;
    jsonFields={};
    for(a in json){
      jsonFields[a.toLowerCase()]=a;
    }
    for(a in infos.attributes){
      let aLow=a.toLowerCase();
      if(!(aLow in jsonFields)) continue;
      let v=json[jsonFields[aLow]];
      
      let attr=infos.attributes[a];
      if(attr.static) continue;

      if(v===null){
        target[a]=null;
        continue;
      }
      
      let m=target[a];
      if(attr.type.dimension>0){
        target[a]=$createArray(attr.type.baseType,attr.type.dimension,v);
        continue;
      }
      console.log(attr);
      let c=attr.type.baseType.charAt(0);
      if(attr.type.baseType==="String" || c.toLowerCase()===c){
        target[a]=v;
      }else{
        target[a]=null;
      }
    }
    return a;
  };
  $jsstringify=async function(json,obj){
    if(obj===null || obj===undefined) return null;
    let jo=await $jstoJSON(obj);
    let s=JSON.stringify(jo);
    return s;
  };
  $jsparse=function(json,str){
    let j=JSON.parse(str);
    return j;
  };
  $jsgetKeys=function(obj){
    return Object.keys(obj);
  };
  $jshasKey=function(obj,key){
    return (key in obj);
  };
  $js$get=function(obj,key){
    try{
      if(key in obj){
        let v=obj[key];
        if(v===undefined||v===null) return null;
        return v;  
      }
    }catch(e){
      
    }
    return null;
  };
  $jsgetString=function(obj,key){
    let v=$js$get(obj,key);
    if(v===null) return null;
    return v+"";
  };
  $jstoString=function(obj){
    return obj+"";
  };
  $jstoInt=function(obj){
    if(typeof obj==="number"){
      return Math.floor(obj);
    }else{
      return 0;
    }
  };
  $jstoDouble=function(obj){
    if(typeof obj==="number"){
      return obj;
    }else{
      return 0;
    }
  };
  $jstoBoolean=function(obj){
    if(this.json){
      return true;
    }else{
      return false;
    }
  };
  $jstoArray=function(obj){
    if(obj && Array.isArray(obj)){
      return $createArray("JSON",1,obj);;
    }else{
      return $createArray("JSON",1,[obj]);
    }
  };
  $jsgetInt=function(obj,key){
    let v=$js$get(obj,key);
    if(v===null || (typeof v!=="number")) return 0;
    return Math.floor(v);
  };
  $jsgetDouble=function(obj,key){
    let v=$js$get(obj,key);
    if(v===null || (typeof v!=="number")) return 0;
    return v;
  };
  $jsgetBoolean=function(obj,key){
    let v=$js$get(obj,key);
    if(!v) return false;
    return true;
  };
  $jsget=function(obj,key){
    let v=$js$get(obj,key);
    if(v===null) return null;
    return v;
  };
  $jsgetArray=function(obj,key){
    let v=$js$get(obj,key);
    if(v===null) return null;
    let array;
    if(Array.isArray(v)){
      array=$createArray("JSON",1,v);
    }else{
      array=$createArray("JSON",1,[v]);
    }
    return array;
  };
  $jsset=function(obj,key,v){
    obj[key]=v;
  };

  class $Scope{
    constructor(thisObject){
      this.stack=[];
      if(thisObject instanceof Function){
        //static context
        this.thisObject=null;
      }else{
        this.thisObject=thisObject;
      }
      this.pushLayer();
    }
    getData(template){
      let local={};
      if(template.local){
        let typeVariables;
        if(this.thisObject && this.thisObject.$typeArguments){
          typeVariables={};
          for(let a in this.thisObject.$typeArguments){
            if(a.startsWith("$")) continue;
            typeVariables[a]=this.thisObject.$typeArguments[a].name;
          }
        }
        for(let i=this.stack.length-1;i>=0;i--){
          let layer=this.stack[i];
          for(let a in layer){
            if(a in local) continue;
            let v=layer[a];   
            let d=$getData(a,v,template.local[a],typeVariables);
            local[a]=d;
          }
        }
      }
      let that=undefined;
      if(this.thisObject && template.that){
        let type=this.thisObject.constructor.name;
        that=$getData("this",{type: type,dimension: 0, value: this.thisObject}, template.that["this"]);
      }
      let main=$getMainData(template.main.main);
      
      let res={
        local, that, main
      };
      return res;
    }
    pushLayer(){
      let layer={};
      this.stack.push(layer);
    }
    pushVariable(name, type, dimension, value){
      let layer=this.stack[this.stack.length-1];
      layer[name]={
        type, dimension, value
      }
    }
    popLayer(){
      return this.stack.pop();
    }
    getVariable(name){
      for(let i=this.stack.length-1;i>=0;i--){
        let layer=this.stack[i];
        if(layer[name]){
          return layer[name];
        }
      }
      return null;
    }
    setVariable(name,value){
      let v=this.getVariable(name);
      if(!v) return;
      v.value=value;
    }
  }

  /**Reflection API */
  function $object_getClass(obj){
    let name=obj.constructor?.name;
    let infos=$clazzRuntimeInfos[name];
    if(!infos){
      return null;
    }
    if(!(infos instanceof Class)){
      let c=new Class();
      c.name=name;
      for(let a in infos){
        c[a]=infos[a];
      }
      $clazzRuntimeInfos[name]=c;
      return c;
    }else{
      return infos;
    }
  }
  
  class Class{
    getDeclaredFields(){
      let array=[];
      for(let a in this.attributes){
        let at=this.attributes[a];
        let f=new Field();
        f.attribute=at;
        f.name=a;
        array.push(f);
      }
      let fields=$createArray("Field",1,array);
      return fields;
    }
    getDeclaredField(name){
      for(let a in this.attributes){
        let at=this.attributes[a];
        if(a===name){
          let f=new Field();
          f.attribute=at;
          f.name=a;
          return f;
        }
      }
      return null;
    }
    getFields(){
      let array=[];
      for(let a in this.attributes){
        let at=this.attributes[a];
        if(at.vis==="private") continue;
        let f=new Field();
        f.attribute=at;
        f.name=a;
        array.push(f);
      }
      let fields=$createArray("Field",[array.length],array);
      return fields;
    }
    getField(name){
      for(let a in this.attributes){
        let at=this.attributes[a];
        if(a===name){
          if(at.vis==="private") return null;
          let f=new Field();
          f.attribute=at;
          f.name=a;
          return f;
        }
      }
      return null;
    }
    getDeclaredMethods(){
      let array=[];
      for(let a in this.methods){
        let met=this.methods[a];
        let m=new Method();
        m.method=met;
        m.name=a;
        array.push(m);
      }
      let methods=$createArray("Method",1,array);
      return methods;
    }
    getDeclaredMethod(name){
      for(let a in this.methods){
        if(a===name){
          let met=this.methods[a];
          let m=new Method();
          m.method=met;
          m.name=a;
          return m;
        }
      }
      return null;
    }
    getMethods(){
      let array=[];
      for(let a in this.methods){
        let met=this.methods[a];
        if(met.vis==="private") continue;
        let m=new Method();
        m.method=met;
        m.name=a;
        array.push(m);
      }
      let methods=$createArray("Method",1,array);
      return methods;
    }
    getMethod(name){
      for(let a in this.methods){
        if(a===name){
          let met=this.methods[a];
          if(met.vis==="private") return null;
          let m=new Method();
          m.method=met;
          m.name=a;
          return m;
        }
      }
      return null;
    }
  }

  class Field{
    get(object){
      return object[this.attribute.name];
    }
    getName(){
      return this.name;
    }
  }

  class Method{
    getName(){
      return this.name;
    }
  }

  

  class Voice{
    static $voices=null;
    $constructor(){
      const synth = window.speechSynthesis;
      if(!synth) throw $new(Exception,"Dieses System unterstützt kein SpeechSynthesis.");
      this.pitch=1;
      this.rate=1;
      this.language="de";
      this.voice=null;
      this.volume=1.0;
    }
    static $loadVoices(){
      if(Voice.$voices) return;
      const synth = window.speechSynthesis;
      Voice.$voices = synth.getVoices();
    }
    static getVoiceByName(name){
      for (const voice of Voice.$voices) {
        if (voice.name === name) {
          return voice;
        }
      }
      return null;
    }
    setLanguage(lang){
      this.language=lang;
    }
    setPitch(p){
      this.pitch=p;
    }
    setRate(r){
      this.rate=r;
    }
    setVolume(v){
      this.volume=v;
    }
    setName(names){
      this.names=names;
      for(let i=0;i<names.length;i++){
        let v=Voice.getVoiceByName(names[i]);
        if(v){
          this.voice=v;
          break;
        }
      }
      this.voice=null;
    }
    speak(text){
      const utterThis = new SpeechSynthesisUtterance(text);
      if(this.voice){
        utterThis.voice = this.voice;
      }
      utterThis.lang=this.language;
      utterThis.pitch = this.pitch;
      utterThis.rate = this.rate;
      utterThis.volume=this.volume;
      window.speechSynthesis.speak(utterThis);
    }
  }

  if(window.speechSynthesis){
    const synth = window.speechSynthesis;
    Voice.$loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = ()=>{
        Voice.$loadVoices();
      }
    }
  }

  class Thread{
    static async sleep(millis){
      await $Exercise.sleep(millis);
    }
  }

  class $Exercise{
    static convertAsyncArrowFunction(arrowFunc){
      let arrow;
      if(arrowFunc.substring){
        arrow=arrowFunc;
      }else{
        arrow=arrowFunc.toString();
      }
      if(!arrow.startsWith("async ")) return arrowFunc;
      arrow=arrow.substring(6);
      let pos=arrow.indexOf("{");
    
      let func=arrow.substring(pos).replace(/await /g," ");
      let params=arrow.substring(0,pos-1).trim();
      params=params.replace(/[^a-zA-Z0-9_$,]/g,"").trim().split(",");
      let f;
      if(params.length===0){
        f=Function(func);
      }else if (params.length===1){
        f=Function(params[0],func);
      }else if(params.length===2){
        f=Function(params[0],params[1],func);
      }else if(params.length===3){
        f=Function(params[0],params[1],params[2],func);
      }else if(params.length===4){
        f=Function(params[0],params[1],params[2],params[3],func);
      }else if(params.length===5){
        f=Function(params[0],params[1],params[2],params[3],params[4],func);
      }
      return f;
    }
    static mergeSort(array,comp,helpArray,from,toExclusive){
      if(!helpArray){
        helpArray=new Array(array.length);
        from1=0;
        toExclusive=array.length;
      }
      if(from>=toExclusive){
        return;
      }
      let middle=Math.floor((from+toExclusive)/2);
      this.mergeSort(array,comp,helpArray,from,middle);
      this.mergeSort(array,comp,helpArray,middle,toExclusive);
      this.merge()
    }
    static merge(array,comp,helpArray,from,from1,toExclusive){
      let i1=from;
      let i2=from1;
      for(let i=from;i<toExclusive;i++){
        //if(comp(i1,i2))
      }
    }
    static doubleEquals(a,b){
      return Math.abs(a-b)<0.0000001;
    }
    static getHtmlPage(name){
      let elements=document.querySelectorAll("iframe");
      for(let i=0;i<elements.length;i++){
        let e=elements[i];
        if(e.$HtmlPage){
          return e.$HtmlPage;
        }
      }
      return null;
    }
    static getHtmlPages(){
      let elements=document.querySelectorAll("iframe");
      let pages=[];
      for(let i=0;i<elements.length;i++){
        let e=elements[i];
        if(e.$HtmlPage){
          pages.push(e.$HtmlPage);
        }
      }
      return pages;
    }
    static getSingleHtmlPage(){
      let pages=$Exercise.getHtmlPages();
      if(pages.length===1) return pages[0];
      return null;
    }
    static isComponentBeforeComponent(comp1,comp2){
      let z1=comp1.$el.style.zIndex;
      let z2=comp2.$el.style.zIndex;
      z1*=1;
      z2*=1;
      if(z1<z2) return true;
      if(z1>z2) return false;
      let node=comp1.$el.nextSibling;
      while(node){
        if(node===comp2.$el){
          return true;
        }
        node=node.nextSibling;
      }
      return false;
    }
    static isLeftRight(){
      for(let i=1;i<arguments.length;i++){
        let e1=arguments[i-1];
        let e2=arguments[i];
        if(!e1||!e2) return false;
        if(e1.$el) e1=e1.$el;
        if(e2.$el) e2=e2.$el;
        let r1=e1.getBoundingClientRect();
        let r2=e2.getBoundingClientRect();
        if(r1.right>r2.left+1) return false;
      }
      return true;
    }
    static isTopBottom(e1,e2){
      for(let i=1;i<arguments.length;i++){
        let e1=arguments[i-1];
        let e2=arguments[i];
        if(!e1||!e2) return false;
        if(e1.$el) e1=e1.$el;
        if(e2.$el) e2=e2.$el;
        let r1=e1.getBoundingClientRect();
        let r2=e2.getBoundingClientRect();
        
        if(r1.bottom>r2.top+1){ 
          return false;

        }
      }
      return true;
    }
    static getComputedStyle(el){
      return window.getComputedStyle(el.$el);
    }
    static compareStyles(el1,el2,keysArray){
      let cs1=$Exercise.getComputedStyle(el1);
      let cs2=$Exercise.getComputedStyle(el2);
      let res=[];
      let ok=true;
      for(let i=0;i<keysArray.length;i++){
        let keyOK=cs1[keysArray[i]]===cs2[keysArray[i]];
        if(!keyOK){
          res.push(keysArray[i]);
        }
        if(!keyOK) ok=false;
      }
      return {
        ok,
        keys: res
      };
    }
    static setUIBlocked(b){
      if(b){
        if($Exercise.blocker) return;
        //blocke UI mit overlay
        let blocker=document.createElement("div");
        blocker.style.background="blue";
        blocker.style.opacity=0.5;
        blocker.style.position="fixed";
        blocker.style.top=0;
        blocker.style.left=0;
        blocker.style.right=0;
        blocker.style.bottom=0;
        blocker.style.zIndex=20000;
        blocker.innerHTML='<span class="animation-pulse" style="color: white">Wird überprüft</span>'
        $Exercise.blocker=blocker;
        document.body.appendChild(blocker);
      }else{
        //entblocke UI
        if(!$Exercise.blocker) return;
        document.body.removeChild($Exercise.blocker);
        delete $Exercise.blocker;
      }
    }
    static getCopy(array){
      return JSON.parse(JSON.stringify(array));
    }
    static deleteMain(){
      $App.console.clear();
      if($main){
        delete window.$main;
      }
    }
    static async sleep(millis){
      let p=new Promise((resolve,reject)=>{
        setTimeout(()=>{
          resolve();
        },millis);
      });
      await p;
    }
    static error(message){
      return {
        message
      }
    }
    static async checkTestCases(initData,testcases,applyTestFunc){
      let resArray=[];
      $Exercise.setUIBlocked(true);
      for(let i=0;i<testcases.length;i++){
        let tc=testcases[i];
        let count=1;
        if(tc.count) count=tc.count;
        let res=true;
        for(let j=0;j<count;j++){
          let data;
          if(tc.data){
            if(typeof tc.data==="function"){
              data=tc.data(initData);
            }else{
              data=tc.data;
            }
            data.$run={
              index: j,
              count: count
            };
          }else{
            data=null;
          }
          
          try{
            $Exercise.clearConsole();
            res=await applyTestFunc(data,initData);
          }catch(e){
            console.log("check test cases exception",e);
            res=e;
          }
          $Exercise.clearConsole();
          if(res!==true){
            break;
          }
        }
        resArray.push(res);
      }
      $Exercise.setUIBlocked(false);
      $Exercise.sendFeedback(resArray);
      //$Exercise.sendCompleted(max,infos);
    }
    static areTypesEqual(type1,type2){
      return ($Exercise.typeToString(type1)===$Exercise.typeToString(type2));
    }
    static typeToString(type){
      if(!type) return null;
      if(type.substring){
        type={
          baseType: type,
          dimension: 0
        };
      }

      return type.baseType+type.dimension>0? "[]":"";
    }
    static compareAttributes(c,obj){
      let errors=[];
      if(!c.attributes){
        errors.push("Die Klasse deklariert keine Attribute.");
        return errors;
      }
      for(let a in obj.attributes){
        let atIst=c.attributes[a];
        let atSoll=obj.attributes[a];
        if(!atIst){
          errors.push("Die Klasse deklariert kein Attribut namens '"+a+"'.");
          continue;
        }
        if(atIst.vis!==atSoll.vis){
          errors.push("Das Attribut '"+a+"' ist "+atIst.vis+", es soll aber "+atSoll.vis+" sein.");
        }
        if(!$Exercise.areTypesEqual(atIst.type, atSoll.type)){
          errors.push("Das Attribut '"+a+"' hat den falschen Datentyp.");
        }
      }
      return errors;
    }
    static compareMethods(c,obj){
      let errors=[];
      if(!c.methods){
        errors.push("Die Klasse deklariert keine Methoden.");
        return errors;
      }
      for(let a in obj.methods){
        let mIst=c.methods[a];
        let mSoll=obj.methods[a];
        if(!mIst){
          errors.push("Die Klasse deklariert keine Methode namens '"+a+"'.");
          continue;
        }
        if(mSoll.vis && mIst.vis!==mSoll.vis){
          errors.push("Die Methode '"+a+"' ist "+mIst.vis+", es soll aber "+mSoll.vis+" sein.");
        }
        if(!$Exercise.areTypesEqual(mIst.type, mSoll.type)){
          errors.push("Die Methode '"+a+"' hat den falschen Rückgabetyp.");
        }
        let paramsIst=mIst.args? mIst.args: [];
        let paramsSoll=mSoll.args? mSoll.args: [];
        if(paramsIst.length!==paramsSoll.length){
          errors.push("Die Methode '"+a+"' hat eine falsche Anzahl von Parametern.");
        }else{
          for(let i=0;i<paramsSoll.length;i++){
            let pSoll=paramsSoll[i];
            let pIst=paramsIst[i];
            if(pSoll.name!==pIst.name){
              errors.push("Der Parameter '"+pIst.name+"' der Methode '"+a+"' soll '"+pSoll.name+"' heißen.");
            }
            if(!$Exercise.areTypesEqual(pSoll.type,pIst.type)){
              errors.push("Der Parameter '"+pIst.name+"' der Methode '"+a+"' hat den falschen Datentyp.");
            }
          }
        }
        
      }
      return errors;
    }
    static compareClass(c, obj){
      let errors=$Exercise.compareAttributes(c,obj);
      errors=errors.concat($Exercise.compareMethods(c,obj));
      return errors;
    }
    static async createInstance(constructor){
      let args=[null];
      for(let i=1;i<arguments.length;i++){
        args.push(arguments[i]);
      }
      return await $App.asyncFunctionCall(new constructor(), "$constructor",args);
    }
    static async createInstanceWithTypeParameters(constructor,typeParams){
      let args=[typeParams];
      for(let a in typeParams){
        let t=typeParams[a];
        typeParams[a]={
          name: t,
          initialValue: null
        };
        
      }
      for(let i=2;i<arguments.length;i++){
        args.push(arguments[i]);
      }
      return await $App.asyncFunctionCall(new constructor(), "$constructor",args);
    }
    static clearConsole(){
      $App.console.clear();
    }
    static getConsoleContent(){
      let array=$App.console.getTextContent();
      return array.join("\n").split("\n");
    }
    static showCheckButton(){
      $Exercise.sendMessage("show-check-exercise-button");
    }
    /**
     * 
     * @param {*} type JLabel, JButton, ... 
     */
    static getComponent(type,filter){
      let root=$Exercise.getUIRoot();
      let elements=root.querySelectorAll(".__"+type.toLowerCase());
      for(let i=0;i<elements.length;i++){
        let e=elements[i].component;
        if(!e) continue;
        if(!filter || filter(e)){
          return e;
        }
      }
      return null;
    }
    static getComponents(type,filter){
      let root=$Exercise.getUIRoot();
      let elements=root.querySelectorAll(".__"+type.toLowerCase());
      let comps=[];
      for(let i=0;i<elements.length;i++){
        let e=elements[i].component;
        if(!e) continue;
        if(!filter || filter(e)){
          comps.push(e);
        }
      }
      return comps;
    }
    static getUIRoot(){
      return $App.canvas.container;
    }
    static sendMessage(type, data){
      if(window.parent){
        console.log("send message zu editor",type, data);
        window.parent.postMessage({type: type, data: data});
      }
    }
    static sendFeedback(resArray){
      //console.log("feedback",points,maxPoints);
      $Exercise.sendMessage("exercise-tested",{resArray});
    }
    static random(min,max){
      return Math.floor(Math.random()*(max-min+1))+min;
    }
    static swap(array, i1,i2){
      let c=array[i1];
      array[i1]=array[i2];
      array[i2]=c;
    }
    static randomize(array){
      for(let i=0;i<array.length;i++){
        let index=$Exercise.random(0,array.length-1);
        $Exercise.swap(array,i,index);
      }
    }
    static getRandomizedCopy(array){
      let copy=JSON.parse(JSON.stringify(array));
      $Exercise.randomize(copy);
      return copy;
    }
    static getRange(min,max,step){
      if(!step) step=1;
      let array=[];
      let i=min;
      while(i<max){
        array.push(i);
        i+=step;
      }
      return array;
    }
    static randomFrom(array,k){
      let r=$Exercise.getRandomizedCopy(array);
      let drawn=[];
      for(let i=0;i<k;i++){
        drawn.push(r[i]);
      }
      return drawn;
    }
    static getRandomInts(min,max,k){
      let r=$Exercise.getRange(min,max);
      return $Exercise.randomFrom(r,k);
    }
    static getRandomString(length){
      let t="";
      for(let i=0;i<length;i++){
        t+=String.fromCodePoint(48+$Exercise.random(0,72));
      }
      return t;
    }
    static getRandomObjectArray(attributes,length){
      let attributes2={};
      for(let a in attributes){
        let prop=$Exercise.getRandomizedCopy(attributes[a]);
        attributes2[a]=prop;
        if(prop.length<length){
          console.error("getRandomObjectArray","Dieses Array ist zu klein: ",attributes[a]);
        }
      }
      let array=[];
      for(let i=0;i<length;i++){
        let o={};
        for(let a in attributes2){
          o[a]=attributes2[a][i];
        }
        array.push(o);
      }
      return array;
    }
    static getRandomIntArray(length,options){
      let min,max,forbidMultiple, forceMultiple,sorted,maxStep,minStep;
      if(!options) options={};
      if(options.min!==undefined){
        min=options.min;
      }else{
        min=0;
      }
      if(options.max!==undefined){
        max=options.max;
      }else{
        max=min+1000*length;
      }
      if(options.forbidMultiple!==undefined){
        forbidMultiple=options.forbidMultiple;
      }else{
        forbidMultiple=false;
      }
      if(options.forceMultiple!==undefined){
        forceMultiple=options.forceMultiple;
      }else{
        forceMultiple=false;
      }
      if(options.sorted!==undefined){
        sorted=options.sorted;
      }else{
        sorted=false;
      }
      if(options.maxStep!==undefined){
        maxStep=options.maxStep;
      }else{
        maxStep=10;
      }
      if(options.minStep!==undefined){
        minStep=options.minStep;
      }else{
        if(forbidMultiple){
          minStep=1;
        }else{
          minStep=0;
        }
      }
      let array=[];
      let x=min;
      for(let i=0;i<length;i++){
        let sMax=Math.min(maxStep,max-x);
        let dx=$Exercise.random(minStep,maxStep);
        x+=dx;
        array.push(x);
      }
      if(forceMultiple){
        let index=$Exercise.random(1,length-1);
        array[index]=array[index-1];
      }
      if(!sorted){
        $Exercise.randomize(array);
      }
      return array;
    }
  }
}