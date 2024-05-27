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
  }, false);

  JSON.$constructor=function(){ };

  function $u(v){if(v===undefined){throw $new(Exception,"Undefinierter Wert.")} return v;}
  function $N(v,name){if(v===null){throw $new(Exception,"NullPointerException: Der Wert von '"+name+"' ist null, deshalb kannst du nicht auf Methoden oder Attribute zugreifen.")} return v;}
  function $v(v){if(Number.isNaN(v*1)){throw $new(Exception,"'"+v+"' ist keine Zahl.")}else{return v*1;}}
  function $i(v){if(Number.isNaN(v*1)){throw $new(Exception,"'"+v+"' ist keine Zahl.")}else{v*=1; return v>=0? Math.floor(v):Math.ceil(v);}}
  function $m(v,message,line){if(v===undefined){throw $new(Exception,message,line)}else{return v;}}
  function $n(a){return a;}
  Object.defineProperty(String.prototype,'len',{value: function(){return this.length;}, writeable: false});

  function $new(constructor){
    let o;
    try{
      o=new constructor();
    }catch(e){
      o=new constructor.constructor();
      return o;
    }
    if(!o.$constructor){
      console.error("error in $new!!!",constructor);
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
    if(comp.actionListeners && comp.actionListeners.length>0){
      for(let i=0;i<comp.actionListeners.length;i++){
        let al=comp.actionListeners[i];
        let event=$new(ActionEvent,comp,0,comp.actionCommand,Date.now());
        al.actionPerformed(event);
        //source,id,command,when
      }
      console.log("actionlistener handle");
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
      for(var i=0;i<dim[0];i++){
        array.push(type.initialValue!==undefined? type.initialValue:null);
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

  $createArray=function(type, dim, values){
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
      throw $new(Exception,"Das Array muss zunächst initalisiert werden.");
    }
    if(array.$type){
      return $arrayGet(array,index);
    }else{
      return array[index];
    }
  }

  function $setInArray(array,index,value,assignOp){
    if(!array){
      throw $new(Exception,"Das Array muss zunächst initalisiert werden.");
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
    //console.log("caste",object,"nach",destTypeName,destDimension,$clazzRuntimeInfos);
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
    var dest;
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
    return await objectWithMethod[methodname].apply(object,argumentsArray);
  };

  function $getFileName(obj){
    return obj.fileName;
  }

  function $getFileContentAsString(obj){
    return obj.data;
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
        console.log(assetName);
        t+=before+$getAssetObjectURL(assetName)+after;
        t+=s[i].substring(pos+1);
      }
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
    setTimeout(()=>{$App.customDialog.frame.style.opacity=1},10);
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
    if($main && $main.onGamepadDown){
      $main.onGamepadDown(button);
    }
  }

  function onGamepadUp(){
    if(window.$uiPreviewMode===true) return;
    if($main && $main.onGamepadUp){
      $main.onGamepadUp();
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
    println(text){
      console.println(text);
    }
    print(text){
      console.print(text);
    }
  }

  class InputStream{
    $constructor(){}
    async read(){
      return await $App.console.read();
    }
  }

  class System{
    $constructor(){}
    static out=$new(PrintStream);
    static in=$new(InputStream);
    static storage=App.storage;
    static time=App.time;
    static console(){
      return $App.console;
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

  class JComponent{
    $constructor(x,y,width,height){
      if(x===undefined) x=50;
      if(y===undefined) y=50;
      if(width===undefined) width=100;
      if(height===undefined) height=100;
      this.x=x;
      this.y=y;
      this.width=width;
      this.height=height;
      this.$el=null;
      this.actionCommand="";
      this.actionObject=null;
      this.$eventListeners={};
      this.$triggerOnAction=false;
      this.$triggerOnMouseDown=false;
      this.$triggerOnMouseUp=false;
      this.$triggerOnMouseMove=false;
      this.standardCSSClasses="__jcomponent";
      this.actionListeners=[];
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
        for(let i=0;i<es.length;i++){
          let e=es[i];
          if(!e.component) e.component=$new(HTMLElement,e)
          es[i]=e.component;
        }
        return $createArray("HTMLElement",1,es);
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
    setActionObject(object){
      this.actionObject=object;
    }
    getActionObject(){
      return this.actionObject;
    }
    collides(comp){
      
      let r1=this.$el.getBoundingClientRect();
      let r2=comp.$el.getBoundingClientRect();
      if(r1.width===0 || r2.width===0 || r1.height===0|| r2.height===0) return false;
      return !(r1.left+r1.width<r2.left || r2.left+r2.width<r1.left || r1.top+r1.height<r2.top || r2.top+r2.height<r1.top);
    }
    show(){
      this.setVisible(true);
    }
    hide(){
      this.setVisible(false);
    }
    setVisible(v){
      this.visible=v;
      this.$el.visible=v;
    }
    isVisible(){
      return this.$el.visible;
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
      return this.$el.value;
    }
    setX(v){
      this.x=v;
      this.$el.cx=v;
    }
    getX(){
      return this.$el.cx;
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
    }
    getY(){
      return this.$el.cy;
    }
    setBounds(x,y,width,height){
      this.setX(x);
      this.setY(y);
      this.setWidth(width);
      this.setHeight(height);
    }
    setWidth(v){
      this.width=v;
      this.$el.width=v;
    }
    getWidth(){
      return this.$el.width;
    }
    setHeight(v){
      this.height=v;
      this.$el.height=v;
    }
    getHeight(){
      return this.$el.height;
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
      this.$el.className=this.standardCSSClasses+" "+className;
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
    setAlign(a){
      this.$el.align=a;
    }
    setAlignContent(a){
      this.$el.alignContent=a;
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
      this.actionListeners.push(al);
    }
    removeActionListener(al){
      let index=this.actionListeners.indexOf(al);
      if(index<0) return;
      this.actionListeners.splice(index,1);
    }
    getActionListeners(){
      let a=$createArray("ActionListener",this.actionListeners.length,[]);
      for(let i=0;i<this.actionListeners.length;i++){
        a[i]=this.actionListeners[i];
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

  

  

  class UIControlStatement{
    $constructor(type){
      this.type=type;
      this.$el=document.createElement("span");
      this.$el.style.display="none";
      this.$el.component=this;
      this.$el.appJSData={};
      this.attachedComponents=[];
    }
    prepareForUpdate(){
      this.removeAll();
      window.$insertPosition=$getIndexOfComponentInParent(this.$el)+1;
    }
    attachComponent(c){
      this.attachedComponents.push(c);
    }
    removeAll(){
      for(var i=0;i<this.attachedComponents.length;i++){
        var parent=this.attachedComponents[i].$el.parentNode;
        parent.removeChild(this.attachedComponents[i].$el);
      }
      this.attachedComponents=[];
    }
  }

  class JButton extends JComponent{
    $constructor(label,x,y,width,height){
      super.$constructor(x,y,width,height);
      this.$el=ui.button(label,x,y,width,height);
      this.$el.component=this;
      this.$triggerOnAction=true;
      this.$el.onclick = $handleOnAction;
      this.setCSSClass("");
    }
  }

  class JImage extends JComponent{
    $constructor(url,x,y,width,height){
      super.$constructor(x,y,width,height);
      url=$getAssetObjectURL(url);
      this.$el=ui.image(url,x,y,width,height);
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
  }

  class JPanel extends JComponent{
    $constructor(template,x,y,width,height){
      super.$constructor(x,y,width,height);
      this.template=template;
      this.$el=ui.panel(template,x,y,width,height);
      this.$el.component=this;
      this.$el.onclick = $handleOnAction;
      this.lastRowAndColumnCount=null;
    }
    setLayout(layout){
      this.$el.setTemplate(layout);
    }
    add(comp,index){
      this.$el.add(comp.$el,index);
    }
    remove(comp){
      try{
        this.$el.removeChild(comp.$el);
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
        if(c.component && !(c.component instanceof UIControlStatement)){
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
        if(c.component && !(c.component instanceof UIControlStatement)){
          realIndex++;
        }
        if(realIndex===index){
          return c.component;
        }
      }
      return null;
      // let el=this.$el.children[index];
      // if(el && el.component){
      //   return el.component;
      // }else{
      //   return null;
      // }
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
        if(!(c instanceof UIControlStatement)){
          index++;
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
      this.$el.style="left: 0; right: 0; top: 0; bottom: 0; position: absolute;";
      $App.canvas.addElement(this.$el,50,50,100,100);
      $App.console.adaptSize();
    }
  }

  class JLabel extends JComponent{
    $constructor(text,x,y,width,height){
      super.$constructor(x,y,width,height);
      this.$el=ui.label(text,x,y,width,height);
      this.setValue(text);
      this.$el.component=this;
      this.$el.onclick = $handleOnAction;
      this.setCSSClass("");
    }
  }

  class HTMLElement extends JComponent{
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
    getChildElements(){

    }
    
    add(comp,index){
      if(index===undefined){
        this.$el.appendChild(comp.$el);
      }else{
        let ref=this.$el.children[index];
        this.$el.insertBefore(comp.$el,ref);
      }
    }
    setInnerHTML(html){
      this.$el.innerHTML=html;
    }
    setTextContent(text){
      this.$el.textContent=text;
    }
    getAttribute(name){
      return this.$el[name];
    }
    setAttribute(name, value){
      this.$el[name]=value;
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

  class Canvas extends JPanel{
    $constructor(minX,maxX,minY,maxY,x,y,width,height){
      super.$constructor(x,y,width,height);
      this.standardCSSClasses="_java-app-canvas __jcomponent";
      if(this.$el && this.$el.parentNode) this.$el.parentNode.removeChild(this.$el);
      this.$el=ui.canvas(maxX-minX,maxY-minY,x,y,width,height);
      this.$el.style.touchAction="none";
      this.$el.component=this;
      this.setCSSClass("");
      this.setOrigin(-minX,-minY);
      this.$el.onclick = $handleOnAction;
      this.$triggerOnMouseMove=true;
      this.$triggerOnMouseDown=true;
      this.$triggerOnMouseUp=true;
      this.mouse={
        x: -1,
        y: -1,
        over: false
      };
      //this.$el.onpointermove=$handleOnPointerMove;
      this.setTriggerOnMouseDown(true);
      this.setTriggerOnMouseUp(true);
      this.$el.addEventListener("pointerenter",(ev)=>{
        try{
          ev.target.releasePointerCapture(ev.pointerId);
        }catch(e){}
        this.mouse.over=true;
        window.mousePressed=ev.buttons>0;
        this.$updateMousePosition(ev);
      },false);
      this.$el.addEventListener("pointerdown",(ev)=>{
        try{
          ev.target.releasePointerCapture(ev.pointerId);
        }catch(e){}
        this.mouse.over=true;
        window.mousePressed=true;
        this.$updateMousePosition(ev);
      },false);
      this.$el.addEventListener("pointermove",(ev)=>{
        try{
          ev.target.releasePointerCapture(ev.pointerId);
        }catch(e){}
        this.mouse.over=true;
        window.mousePressed=ev.buttons>0;
        this.$updateMousePosition(ev);
      },false);
      this.$el.addEventListener("pointerup",(ev)=>{
        this.mouse.over=true;
        window.mousePressed=false;
        this.$updateMousePosition(ev);
      },false);
      this.$el.addEventListener("pointerleave",(ev)=>{
        try{
          ev.target.releasePointerCapture(ev.pointerId);
        }catch(e){}
        this.mouse.over=false;
        this.$updateMousePosition(ev);
      },false);
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
      if(el && el!==$App.canvas.el && el!==this.$el){
        x-=$App.canvas.container.getBoundingClientRect().left;
      }
      while(el && el!==$App.canvas.el && el!==this.$el){
        let br=el.getBoundingClientRect();
        x+=br.left;
        y+=br.top;
        el=el.parentElement;
        if(el.isCanvas) el=el.parentElement;
      }
      x=canvas.getCanvasX(x);
      y=canvas.getCanvasY(y);
      this.mouse.x=x;
      this.mouse.y=y;
    }
    setSizePolicy(policy){
      this.$el.setSizePolicy(policy);
    }
    getSizePolicy(){
      return this.$el.getSizePolicy();
    }
    isMouseOver(){
      return this.mouse.over;
    }
    isMousePressed(){
      return window.mousePressed;
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
      console.log(rx,ry);
      let els=document.elementsFromPoint(rx,ry);
      console.log(els);
      for(let i=0;i<els.length;i++){
        let e=els[i];
        if(e===this.$el || e===this.$el.canvas.el) return null;
        if(this.$el.contains(e) && e.component){
          return e.component;
        }
      }
      return null;
    }
    add(comp, index){
      this.$el.canvas.add(comp.$el, index);
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
    $constructor(options,x,y,width,height){
      super.$constructor(x,y,width,height);
      if(!options){
        options=[];
      }
      this.$el=ui.select(options,x,y,width,height);
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
    }
    getSelectedIndex(){
      return this.$el.selectedIndex;
    }
    setSelectedIndex(index){
      this.$el.selectedIndex=index;
    }
    setOptions(options){
      this.$el.options=options;
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
    $constructor(label,x,y,width,height){
      super.$constructor(x,y,width,height);
      this.$el=ui.input("checkbox",label,x,y,width,height);
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
    }
  }

  class JTextComponent extends JComponent{
    $constructor(x,y,width,height){
      super.$constructor(x,y,width,height);
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
  }

  class JTextField extends JTextComponent{
    $constructor(type,placeholder,x,y,width,height){
      if(!type) type="text";
      if(!placeholder) placeholder="";
      super.$constructor(x,y,width,height);
      this.$el=ui.input(type,placeholder,x,y,width,height);
      this.$el.spellcheck=false;
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
    }
  }

  class JTextArea extends JTextComponent{
    $constructor(placeholder,x,y,width,height){
      super.$constructor(x,y,width,height);
      this.$el=ui.textarea(placeholder,x,y,width,height);
      this.$el.spellcheck=false;
      this.$el.component=this;
      this.$el.onchange = $handleOnAction;
    }
  }

  class DataTable extends JComponent{
    $constructor(x,y,width,height){
      super.$constructor(x,y,width,height);
      this.$el=ui.datatable(null,x,y,width,height);
      this.$el.component=this;
    }
    setArray(array){
      this.$el.array=array;
    }
    getSelectedIndex(){
      return this.$el.selectedIndex;
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
        row[i]=values.get(i);
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
        this.rows[i][c-1]=values.get(i);
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
    scale(s){
      let res=$new(Vector,this.size);
      for(let i=0;i<this.size;i++){
        res.components[i]=this.components[i]*s;
      }
      return res;
    }
    add(v){
      if(v.size!==this.size){
        throw $new(Exception,"Der Vektor hat "+v.size+" Zeilen, er muss aber "+this.size+" Zeilen haben.");
      }
      let res=$new(Vector,this.size);
      for(let i=0;i<this.size;i++){
        res.components[i]=this.components[i]+v.components[i];
      }
      return res;
    }
    sub(v){
      if(v.size!==this.size){
        throw $new(Exception,"Der Vektor hat "+v.size+" Zeilen, er muss aber "+this.size+" Zeilen haben.");
      }
      let res=$new(Vector,this.size);
      for(let i=0;i<this.size;i++){
        res.components[i]=this.components[i]-v.components[i];
      }
      return res;
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
    getCopy(){
      let v=$new(Vector,this.size);
      for(let i=0;i<this.size;i++){
        v.components[i]=this.components[i];
      }
      return v;
    }
  }

  class Database{
    $constructor(){}
    prepareStatement(sqlSource){
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
      for(let i=0;i<ast.statements.length;i++){
        let s=ast.statements[i];
        if(!s.columns || !s.from || s.from.length===0) continue;
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
            let table=alasql.tables[t.tableid];
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
      return ast.toString();
    }
    query(sqlSource){
      try{
        let prep;
        if(sqlSource.trim().toLowerCase().startsWith("insert")){
          prep=sqlSource;
        }else{
          prep=this.prepareStatement(sqlSource);
        }
        var r=alasql(prep);
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
            var r=$new(Record,result[i]);
            records.push(r);
          }
        }
        var a=$createArray("Record",records.length,records);
        return a;
      }catch(e){
        return null;
      }
    }
    sqlError(cmd){
      try{
        alasql(cmd);
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
        for(var attr in r1.$data){
          if(r.$data[attr]<s.$data[attr]){
            return -1;
          }else if(r.$data[attr]>s.$data[attr]){
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
        for(var a in r1.$data){
          s1++;
        }
        var s2=0;
        for(var a in r2.$data){
          s2++;
        }
        if(s1!==s2) return false;
        var r2=array2[i];
        for(var a in r1.$data){
          if(a in r2.$data){
            if(r1.$data[a]!==r2.$data[a]) return false;
          }else{
            return false;
          }
        }
      }
      return true;
    }
  }

  class Record{
    $constructor($data){
      this.$data=$data;
    }
    get(attribute){
      return this.$data[attribute.toLowerCase()];
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

  class ArrayList{
    $constructor(typeArguments,initialCapacity){
      this.$elementType=typeArguments["T"];
      if(initialCapacity===undefined){
        initialCapacity=10;
      }
      this.capacity=initialCapacity;
      this.elements=[];
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
      let n=this.size();
      for(let i=0;i<n;i++){
        for(let j=0;j<n-i-1;j++){
          let c=this.get(j);
          if(await comparator.compareTo(c,this.get(j+1))>0){
            this.set(j,this.get(j+1));
            this.set(j+1,c);
          }
        }
      }
      //await this.elements.sort((a,b)=>{return await comparator.compareTo(a,b););
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
      this.actionListeners=[actionListener];
      this.actionCommand=null;
      this.$timer_id=null;
      this.$running=false;
    }
    addActionListener(al){
      this.actionListeners.push(al);
    }
    removeActionListener(al){
      let index=this.actionListeners.indexOf(al);
      if(index<0) return;
      this.actionListeners.splice(index,1);
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
    isRunning(){
      return this.$running;
    }
    start(){
      if(this.$running) return;
      this.restart();
    }
    restart(){
      if(this.$running) this.stop();
      this.$running=true;
      let handler=()=>{
        if($App.debug.paused) return;
        for(let i=0;i<this.actionListeners.length;i++){
          let al=this.actionListeners[i];
          let ev=$new(ActionEvent,this,0,this.actionCommand,Date.now());
          al.actionPerformed(ev);
        };
      };
      this.$timer_id=setTimeout(()=>{
        if(this.repeats){
          this.$timer_id=setInterval(()=>{
            if(!this.repeats){
              clearInterval(this.$timer_id);
            }
            handler();
          },this.delay);
        }
        handler();
      },this.initialDelay);
    }
    stop(){
      clearTimeout(this.$timer_id);
      clearInterval(this.$timer_id);
      this.$running=false;
    }
  }

  class Gamepad{
    $constructor(){
      this.rootElement=document.body;
      this.buttonHandlers={};
      this.padding="0.5cm";
      this.width="100%";
      this.buttonSize=1;
      this.dpad=new DPad(this);
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
        this.dpad.keyDown(k);

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
      event=event.toLowerCase();
      button=button.toLowerCase();
      let handler=this.buttonHandlers[button+":"+event];
      if(!handler) return;
      handler.actionPerformed(eventData);
    }
    getDirection(){
      return this.dpad.getDirection();
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
        s: null,
        n: null,
        w: null,
        e: null,
        ne: null,
        nw: null,
        se: null,
        sw: null,
      };
      
      for(let a in this.buttons){
        this.buttons[a]=new DPadButton(this,a);
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
    keyDown(key){
      if(this.key===key){
        this.isPressed=true;
        this.updateHover();
        this.gamepad.onButtonEvent(this.name,"press",{});
        return true;
      }
      return false;
    }
    keyUp(key){
      if(this.key===key){
        this.isPressed=false;
        this.updateHover();
        this.gamepad.onButtonEvent(this.name,"release",{});
        return true;
      }
      return false;
    }
    updateHover(){
      if(this.isPressed){
        this.ui.style.opacity=1;
      }else{
        this.ui.style.opacity=0.5;
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
    constructor(dpad,dir){
      this.key=null;
      this.dpad=dpad;
      this.dir=dir;
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
      this.ui.style="z-index: 100;bordesr: 1pt solid black; opacity: 0.5; position: fixed; aspect-ratio: 1; background-color: grey;touch-action: none;user-select: none;";
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
      this.ui.addEventListener("click",()=>{
        this.dpad.handleEvent(this.dir,"click",ev);
      });
      this.dpad.gamepad.rootElement.appendChild(this.ui);
    }
    setKey(key){
      this.key=key;
    }
    keyDown(key){
      if(this.key===key){
        this.isPressed=true;
        this.updateHover();
      }
    }
    keyUp(key){
      if(this.key===key){
        this.isPressed=false;
        this.updateHover();
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
        this.ui.style.opacity=1;
      }else{
        this.ui.style.opacity=0.5;
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
    let d={
      n: vname,
      t: v.type,
      d: dim
    };
    let isPrimitive=true;
    if(v.type){
      isPrimitive=v.type.charAt(0);
      isPrimitive=isPrimitive===isPrimitive.toLowerCase();
    }
    let c=v.type;
    if(v.value===null||v.value===undefined || v.dimension===0 && v.type==="String" || isPrimitive){
      d.v=v.value;
    }else if(template){
      if(v.dimension>0){

      }else{
        d.v={};
        let infos=$clazzRuntimeInfos[d.t];
        for(let name in v.value){
          if(name.startsWith("$")) continue;
          //name, dimension, type, value
          let value=v.value[name];
          let type=null;
          let dimension=0;
          if(infos){
            let attr=infos.attributes[name];
            if(attr){
              type=attr.baseType;
              dimension=attr.dimension;
              d.v[name]=$getData(name,{dimension,type,value}, template[name]);
            }
          }else{
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
      return Math.floor(this.json);
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
        for(let i=this.stack.length-1;i>=0;i--){
          let layer=this.stack[i];
          for(let a in layer){
            if(a in local) continue;
            let v=layer[a];
            let d=$getData(a,v,template.local[a]);
            
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
}