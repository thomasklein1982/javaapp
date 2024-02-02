window.appJScode=function(){
  class $Char{
    constructor(char){
      if(!char.substring){
        char=String.fromCodePoint(char);
      }
      this.char=char;
      this.int=char.codePointAt(0);
    }
  }

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new(window.AudioContext || window.webkitAudioContext)();

    window.onmessage=function(message){
      if(message && message.data && message.data.type==="update-shared-variables"){
        /**gehe alle iframes durch und aktualisiere die Variablen: */
        for(var i=0;i<$App.$iframes.length;i++){
          var frame=$App.$iframes[i];
          if(frame.iframe.contentWindow===message.source){
            var variables=message.data.sharedVariables;
            for(var a in variables){
              frame[a]=variables[a];
            }
            return;
          }
        }
        return;
      }
      $App.debug.onMessage(message);
    };
    
    Object.defineProperty(window,"assets",{
      get: function(){
        return $App.assets;
      }
    })
  
    window.$App={
      version: 41,
      language: window.language? window.language:'js',
      setupData: null,
      lazyLoading: false,
      $sharedVariables: null,
      $iframes: [],
      resizeObserver: null,
      dialog: {
        root: null,
        backdrop: null,
        body: null,
        header: null,
        content: null,
        startSession: function(asServer, debugMode){
          var sessionID=document.getElementById('appjs-in-session-id').value.trim();
          var clientID=document.getElementById('appjs-in-client-id').value.trim();
          if(sessionID.length===0 || clientID.length===0) return false;
          localStorage.setItem("appjs-session-data",JSON.stringify({sessionID,clientID}));
          session.start(sessionID, clientID, asServer, debugMode);
          this.root.style.display="none";
          return true;
        },
        showStartSession: async function(){
          this.content.innerHTML="<div style='text-align: center;padding: 0.3rem; font-weight: bold'>Netzwerk-Session</div><div><div style='padding: 0.3rem'><input id='appjs-in-session-id' style='width: 100%; min-height: 1cm;' type='text' placeholder='Session-ID'></div><div style='padding: 0.3rem'><input id='appjs-in-client-id' style='width: 100%;min-height: 1cm;' type='text' placeholder='Deine ID'></div></div><div><button style='min-height: 1cm' onclick='$App.dialog._startSession(true)'>Starte als Server</button><button style='min-height: 1cm' onclick='$App.dialog._startSession(false)'>Verbinde als Client</button></div>";
          this.root.style.display="";
          var data=localStorage.getItem("appjs-session-data");
          if(data){
            try{
              data=JSON.parse(data);
              if(data.sessionID && data.clientID){
                document.getElementById('appjs-in-session-id').value=data.sessionID;
                document.getElementById('appjs-in-client-id').value=data.clientID;
              }
            }catch(e){

            }
          }
          let p=new Promise((resolve,reject)=>{
            this._startSession=(asServer)=>{
              let a=this.startSession(asServer);
              if(a){
                resolve();
              }
            };
          });
          let q=await p;
          return q;
        }
      },
      debug: {
        lastLine: -1,
        lastName: true,
        object: null,
        $scope: null,
        enabled: window.appJSdebugMode? window.appJSdebugMode: false,
        breakpoints: {},
        breakpointCount: 0,
        paused: false,
        stepAbove: false,
        callDepth: 0,
        resolve: null,
        line: async function(line,name, $scope){
          if(window===window.top) return;
          this.$scope=$scope;
          this.lastLine=line;
          this.lastName=name;
          console.log("line",line,name,this.callDepth,"step-above",this.stepAbove,"paused",this.paused);
          if(this.paused || this.breakpoints[line]===name || this.callDepth===0 && this.stepAbove){
            console.log("pause!");
            this.paused=true;
            this.stepAbove=false;
            this.callDepth=0;
            if($App.body.overlay){
              $App.body.overlay.style.display='';
            }
            var p=new Promise((resolve,reject)=>{
              window.parent.postMessage({
                type: "debug-pause",
                line: line,
                name: name
              });
              this.resolve=resolve;
            });
            var q=await p;
            return q;
          }
        },
        setBreakpoints: function(bp){
          this.breakpoints={};
          if(!bp){
            this.breakpointCount=0;
            return;
          }
          this.breakpointCount=bp.length;
          for(var i=0;i<bp.length;i++){
            var n,f;
            if(bp[i].n){
              n=bp[i].n;
              f=bp[i].f;
            }else{
              n=bp[i];
              f=true;
            }
            this.breakpoints[n]=f;
          }
        },
        onMessage: function(message){
          if(!window.parent) return;
          var data=message.data;
          if(data.type==="breakpoints"){
            var bp=data.breakpoints;
            this.setBreakpoints(bp);
          }else if(data.type==="debug-resume"){
            this.paused=false;
            this.stepAbove=false;
            this.resolve();
          }else if(data.type==="debug-step"){
            this.stepAbove=false;
            this.resolve();
            $App.debug.callDepth=0;
          }else if(data.type==="debug-step-above"){
            console.log("step above");
            this.paused=false;
            this.stepAbove=true;
            $App.debug.callDepth=0;
            this.resolve();
          }else if(data.type==="getScope"){
            let $scope=this.$scope.getData(JSON.parse(data.template));
            window.parent.postMessage({type: "getScope", data: $scope});
          }
          if(this.paused){
            if($App.body.overlay && $App.body.overlay.style.display==='none'){
              $App.body.overlay.style.display='';
            }
          }else{
            if($App.body.overlay && $App.body.overlay.style.display!=='none'){
              $App.body.overlay.style.display='none';
            }
          }
        }
      },
      assets: {},
      scripts: [],
      headLoaded: false,
      body: {
        element: null,
        root: null,
        right: null,
        overlay: null,
        width: 0,
        height: 0
      },
      toast: null,
      keyboard: {
        down: [],
        lastKeycodeDown: null,
        reset: function(){
          this.lastKeycodeDown=null;
          this.down=[];
        }
      },
      audio: {
        context: null,
        play: function(audio){
          audio.currentTime=0;
          audio.play()
        }
      },
      $uploadCallback: function(callback,options){
        var fi=document.createElement("input");
        fi.type="file";
        if(options && options.accept) fi.accept=options.accept;
        if(options && options.that) fi.that=options.that; else fi.that=null;
        fi.name="files[]";
        fi.style.display="none";
        fi.options=options;
        fi.callback=callback;
        document.body.appendChild(fi);
        if(options && options.multi){fi.multiple=true;}
        if(options && options.dataURL){fi.dataURL=options.dataURL;}

        fi.handleCallback=function(filesLeft){
          var fileReader=new FileReader();
          fileReader.fileInput=fi;
          if(this.options && this.options.object) fileReader.object=this.options.object;
            fileReader.callback=this.callback;
            var file=this.files[this.files.length-filesLeft];
            fileReader.fileName=file.name;
            fileReader.mime=file.type;
            fileReader.that=this.that;
            fileReader.filesLeft=filesLeft;
            fileReader.onload = function(e){
            var code=e.target.result;
            if(this.that){
              this.callback.call(this.that,code,this.fileName,this.mime,this.filesLeft-1);
            }else{
              this.callback(code,this.fileName,this.mime,this.filesLeft-1);
            }
            if(this.filesLeft>1){
              this.fileInput.handleCallback(this.filesLeft-1);
            }
          };
          if(this.dataURL){
            fileReader.readAsDataURL(file);
          }else{
            fileReader.readAsText(file);
          }
        };

        fi.onchange=function(e){
          var filesLeft=this.files.length;
          fi.handleCallback(filesLeft);
        };
        fi.click();
        document.body.removeChild(fi);
      },
      mouse: {
        down: false,
        x: -1,
        y: -1,
        lastTouch: {
          move: -1,
          down: -1,
          up: -1
        },
        update: function(clientX,clientY,target,eventName,time,isTouch){
          if(clientX>=0 && clientY>=0){
            var r=target.getBoundingClientRect();
            this.x=clientX-r.left;
            this.y=(clientY-r.top);
          }
          if(isTouch){
            this.lastTouch[eventName]=time;
          }else{
            var lt=this.lastTouch[eventName];
            if(lt>=0 && Math.abs(time-lt)<500){
              return;
            }
          }
          if($App.debug.paused) return;
          if(eventName==='down' && window.onMouseDown){
            try{
              window.onMouseDown();
            }catch(e){
              $App.handleException(e);
            }
          }else if(eventName==='up' && window.onMouseUp){
            try{
              window.onMouseUp();
            }catch(e){
              $App.handleException(e);
            }
          }else if(eventName==='move' && window.onMouseMove){
            try{
              window.onMouseMove();
            }catch(e){
              $App.handleException(e);
            }
          }
        }
      },
      executedOnStart: false,
      animationFrame: null,
      gamepad: null,
      canvas: null,
      world: null,
      showConsoleOnStart: true
    };
    
    window.onerror=function(message, source, lineno, colno, error){
      $App.handleError({
        message: message,
        line: lineno,
        col: colno,
        completeMessage: "Fehler in Zeile "+lineno+", Position "+colno+": "+message
      });
      
    };
    
    window.addEventListener('unhandledrejection', function(event) {
      // the event object has two special properties:
      //alert(event.promise); // [object Promise] - the promise that generated the error
      //alert(event.reason); // Error: Whoops! - the unhandled error object
      var message=event.reason.message? event.reason.message: event.reason;
      $App.handleError({
        message: message,
        line: event.reason.line? event.reason.line: $App.debug.lastLine,
        name: $App.debug.lastName
      });
    });
  
    $App.handleError=function(errorData){
      if(window.parent!==window){
        if(errorData.line<=0){
          errorData.line=$App.debug.lastLine;
        }
        window.parent.postMessage({type: "error", data: errorData});
      }else{
        console.log(errorData.completeMessage);
      }
    }
    
    $App.handleException=function(e){
      var m;
      var line=-1;
      var col=-1;
      if(e && e.substring){
        m=e;
      }else{
        m=e.message;
        if(e.line){
          line=e.line;
        }
      }
      if(e.stack){
        m=e.stack;
        m=m.replace(/<anonymous>:/g,"");
        var pos=m.indexOf("(");
        var pos2=m.indexOf(":",pos);
        if(pos2>pos && pos>=0){
          line=m.substring(pos+1,pos2)*1;
        }
      }
      
      $App.handleError({
        message: m,
        completeMessage: m,
        line: line,
        col: col
      });
    }
    
    $App.shareVariables=function(){
      if(!this.$sharedVariables){
        this.$sharedVariables={};
      }
      for(var i=0;i<arguments.length;i++){
        this.$sharedVariables[arguments[i]]=null;
      }
    }

    $App.alignSelf=function(el,align){
      if(!el || !el.style) return;
      if(align.h==="center"){
        el.style.marginLeft="auto";
        el.style.marginRight="auto";
      }else if(align.h==="left"){
        el.style.marginRight="auto";
        el.style.marginLeft="";
      }else{
        el.style.marginLeft="auto";
        el.style.marginRight="";
      }
      if(align.v==="middle"){
        el.style.marginTop="auto";
        el.style.marginBottom="auto";
      }else if(align.v==="top"){
        el.style.marginBottom="auto";
        el.style.marginTop="";
      }else{
        el.style.marginTop="auto";
        el.style.marginBottom="";
      }
    };

    $App.createElement=function(tagname){
      let el=document.createElement(tagname);
      el.style.boxSizing="border-box";
      
      //el.style.position="absolute";
      this.implementStyleGetterAndSetter(el);
      el.appJSData={
        oldDisplayValue: null,
        cx: null,
        cy: null,
        width: null,
        height: null,
        align: $App.Canvas.$getAlignment("center"),
        alignContent: $App.Canvas.$getAlignment("center")
      };
      el.updatePosition=function(cx,cy,width,height,align){
        if(cx===undefined){
          cx=this.appJSData.cx;
          cy=this.appJSData.cy;
          width=this.appJSData.width;
          height=this.appJSData.height;
          align=this.appJSData.align;
        }
        if(this.appJSData && this.appJSData.parent){
          if(this.appJSData.parent.updateElementPosition){
            this.appJSData.parent.updateElementPosition(this,cx,cy,width,height,align);
          }
        }else{
          $App.canvas.updateElementPosition(this,cx,cy,width,height,align);
        }
      };
      el.updateAlignContent=function(v){
        var a=$App.Canvas.$getAlignment(v);
        this.appJSData.alignContent=a;
        // //TODO: Wenn der Inhalt zu groß ist, wird er abgeschnitten!
        // for(var i=0;i<this.childNodes.length;i++){
        //   var c=this.childNodes[i];
        //   $App.alignSelf(c,a);
        // }
        if(a.h==="center"){
          this.style.justifyItems="center";
        }else if(a.h==="left"){
          this.style.justifyItems="start";
        }else{
          this.style.justifyItems="end";
        }
        if(a.v==="middle"){
          this.style.alignItems="center";
        }else if(a.v==="top"){
          this.style.alignItems="start";
        }else{
          this.style.alignItems="end";
        }
      };
      el.updateAlignContent();
      Object.defineProperty(el,'align', {
        set: function(v){
          this.appJSData.align=$App.Canvas.$getAlignment(v);
          this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height, this.appJSData.align);
        },
        get: function(){
          return this.appJSData.align.h+" "+this.appJSData.align.v;
        }
      });
      Object.defineProperty(el,'alignContent', {
        set: function(v){
          this.updateAlignContent(v);
        },
        get: function(){
          return this.appJSData.align.h+" "+this.appJSData.align.v;
        }
      });
      Object.defineProperty(el,'cx', {
        set: function(v){
          this.appJSData.cx=v;
          this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height, this.appJSData.align);
        },
        get: function(){
          return this.appJSData.cx;
        }
      });
      Object.defineProperty(el,'cy', {
        set: function(v){
          this.appJSData.cy=v;
          this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height, this.appJSData.align);
        },
        get: function(){
          return this.appJSData.cy;
        }
      });
      Object.defineProperty(el,'width', {
        set: function(v){
          this.appJSData.width=v;
          this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height, this.appJSData.align);
        },
        get: function(){
          return this.appJSData.width;
        }
      });
      Object.defineProperty(el,'height', {
        set: function(v){
          this.appJSData.height=v;
          this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height, this.appJSData.align);
        },
        get: function(){
          return this.appJSData.height;
        }
      });
      if(tagname==="select"){
        el._options=el.options;
        Object.defineProperty(el, 'options', {
          set: function(options) { 
            while(this.firstChild){
              this.removeChild(this.firstChild);
            }
            for(let i=0;i<options.length;i++){
              let opt=options[i];
              let o=document.createElement("option");
              o.innerHTML=opt;
              this.appendChild(o);
            }
          },
          get: function(){
            return this._options;
          }
        });
      }else if(tagname==="button"){
        // el.addEventListener("click",function(ev){
        //   if(window.onAction){
        //     try{
        //       ev.stopPropagation();
        //       window.onAction(this);
        //     }catch(e){
        //       $App.handleException(e);
        //     }
        //   }
        // });
        el.appJSData.label="";
        Object.defineProperty(el,'value', {
          set: function(v){
            this.appJSData.value=v;
            this.innerHTML=v;
            //this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height);
          },
          get: function(){
            return this.appJSData.value;
          }
        });
      }else if(tagname==="img"){
        Object.defineProperty(el,'value', {
          set: function(v){
            this.appJSData.value=v;
            var asset=$App.assets[v];
            if(asset){
              var url=asset.url;
              if(!url.startsWith("data:")){
                url=(new URL(asset.url,document.baseURI)).href;
              }
            }else{
              var url=v;
            }
            this.src=url;
          },
          get: function(){
            return this.appJSData.value;
          }
        });
      }else if(tagname==="div"){
        
      }else if(tagname==="input"){
        // Object.defineProperty(el,'value', {
        //   set: function(v){
        //     this.appJSData.value=v;
        //     this.innerHTML=v;
        //   },
        //   get: function(){
        //     return this.appJSData.value;
        //   }
        // });
      }
      Object.defineProperty(el, 'visible', {
        set: function(v) {
          if(this.appJSData.oldDisplayValue===null){
            var d=this.style.display;
            if(d==="none"){
              d="";
            }
            this.appJSData.oldDisplayValue=d;
          }
          if(!v){
            this.style.display="none";
          }else{
            this.style.display=this.appJSData.oldDisplayValue;
          }
        },
        get: function(){
          return this.style.display!=="none";
        }
      });
      return el;
    };
    
    $App.implementStyleGetterAndSetter=function(el){
      el._style=el.style;
      Object.defineProperty(el, 'style', {
        set: function(s) {
          let rules=s.split(";");
          for(let i=0;i<rules.length;i++){
            let r=rules[i].trim();
            let kv=r.split(":");
            if(kv.length===2){
              this._style[kv[0]]=kv[1];
            }
          }
        },
        get: function(){
          return this._style;
        }
      });
    };
    
    
    $App.$JoyStick=function(t,onDown,onUp,e){var i=void 0===(e=e||{}).title?"joystick":e.title,n=void 0===e.width?0:e.width,o=void 0===e.height?0:e.height,r=void 0===e.internalFillColor?"#00AA00":e.internalFillColor,h=void 0===e.internalLineWidth?2:e.internalLineWidth,a=void 0===e.internalStrokeColor?"#003300":e.internalStrokeColor,d=void 0===e.externalLineWidth?2:e.externalLineWidth,f=void 0===e.externalStrokeColor?"#008000":e.externalStrokeColor,l=void 0===e.autoReturnToCenter||e.autoReturnToCenter,s=t,c=document.createElement("canvas");c.id=i,0===n&&(n=s.clientWidth),0===o&&(o=s.clientHeight),c.width=n,c.height=o,s.appendChild(c);var u=c.getContext("2d"),g=0,v=2*Math.PI,p=(c.width-(c.width/2+10))/2,C=p+5,w=p+30,m=c.width/2,L=c.height/2,E=c.width/10,P=-1*E,S=c.height/10,k=-1*S,W=m,T=L;function G(){u.beginPath(),u.arc(m,L,w,0,v,!1),u.lineWidth=d,u.strokeStyle=f,u.stroke()}function x(){u.beginPath(),W<p&&(W=C),W+p>c.width&&(W=c.width-C),T<p&&(T=C),T+p>c.height&&(T=c.height-C),u.arc(W,T,p,0,v,!1);var t=u.createRadialGradient(m,L,5,m,L,200);t.addColorStop(0,r),t.addColorStop(1,a),u.fillStyle=t,u.fill(),u.lineWidth=h,u.strokeStyle=a,u.stroke()}"ontouchstart"in document.documentElement?(c.addEventListener("touchstart",function(t){g=1;if(onDown){onDown()}},!1),c.addEventListener("touchmove",function(t){t.preventDefault(),1===g&&t.targetTouches[0].target===c&&(W=t.targetTouches[0].pageX,T=t.targetTouches[0].pageY,"BODY"===c.offsetParent.tagName.toUpperCase()?(W-=c.offsetLeft,T-=c.offsetTop):(W-=c.offsetParent.offsetLeft,T-=c.offsetParent.offsetTop),u.clearRect(0,0,c.width,c.height),G(),x())},!1),c.addEventListener("touchend",function(t){g=0,l&&(W=m,T=L);u.clearRect(0,0,c.width,c.height),G(),x();if(onUp){onUp()}},!1)):(c.onmouseleave=function(){g=0,l&&(W=m,T=L);u.clearRect(0,0,c.width,c.height),G(),x();if(onUp){onUp()}},c.addEventListener("mousedown",function(t){g=1;if(onDown){onDown()}},!1),c.addEventListener("mousemove",function(t){1===g&&(W=t.pageX,T=t.pageY,"BODY"===c.offsetParent.tagName.toUpperCase()?(W-=c.offsetLeft,T-=c.offsetTop):(W-=c.offsetParent.offsetLeft,T-=c.offsetParent.offsetTop),u.clearRect(0,0,c.width,c.height),G(),x())},!1),c.addEventListener("mouseup",function(t){g=0,l&&(W=m,T=L);u.clearRect(0,0,c.width,c.height),G(),x();if(onUp){onUp()}},!1)),G(),x(),this.GetWidth=function(){return c.width},this.GetHeight=function(){return c.height},this.GetPosX=function(){return W},this.GetPosY=function(){return T},this.GetX=function(){return((W-m)/C*100).toFixed()},this.GetY=function(){return((T-L)/C*100*-1).toFixed()},this.setDir=function(dir){if(dir==="N"){W=m;T=-1000;}else if(dir==="S"){W=m;T=1000;}else if(dir==="W"){W=-1000;T=L;}else if(dir==="E"){W=1000;T=L;}else if(dir==="NW"){W=-1000;T=-1000;}else if(dir==="NE"){W=1000;T=-1000;}else if(dir==="SW"){W=-1000;T=1000;}else if(dir==="SE"){W=1000;T=1000;}else{W=m;T=L;}u.clearRect(0,0,c.width,c.height),G(),x();},this.GetDir=function(){var t="",e=W-m,i=T-L;return i>=k&&i<=S&&(t="C"),i<k&&(t="N"),i>S&&(t="S"),e<P&&("C"===t?t="W":t+="W"),e>E&&("C"===t?t="E":t+="E"),t}};
    
    $App.setup=async function(dontStart){
      await this.loadScripts();
      if(this.lazyLoading){
        this.loadAssets();
      }else{
        await this.loadAssets();
      }
      
      if(!$App.headLoaded && document.head){
        var style=document.createElement("style");
        document.head.appendChild(style);
        style=style.sheet;
        style.insertRule("*{overscroll-behavior: none;}",0);
        style.insertRule(".datatable{background-color: white; text-align: center; border-collapse: collapse}",0);
        style.insertRule(".datatable td,th{border: 1pt solid black}",0);
        style.insertRule(".datatable tr.selected{background-color: yellow}",0);
        style.insertRule(".datatable tr:nth-child(even){background-color: lightgray}",0);
        style.insertRule(".datatable.show-index td:nth-child(1),.datatable.show-index th:nth-child(1){display: table-cell}",0);
        style.insertRule(".datatable td:nth-child(1),.datatable th:nth-child(1){display: none}",0);
        style.insertRule("button:active{border-radius: 0;background-color:#e0e0e0}",0);
        style.insertRule("button{border-radius: 0;background-color:#d0d0d0}",0);
        style.insertRule("button:hover{border-radius: 0;background-color:#dadada}",0);
        style.insertRule("html{font-family: sans-serif;}",0);
        $App.headLoaded=true;
      }
      if(!dontStart && document.body){
        this.resizeObserver=new ResizeObserver((entries)=>{
          for(const entry of entries){
            const boxSize=entry.borderBoxSize;
            entry.target.resize();
          }
        });
        this.body.element=document.body;
        this.body.element.style="padding: 0; margin: 0; width: 100%; height: 100%; overflow: hidden; user-select: none; -webkit-user-select: none";
        this.body.element.parentElement.style=this.body.style;
        
        var root=document.createElement("div");
        this.body.root=root;
        root.style="position: fixed;width:100%;height:100%";
        root.className="app-root";
        this.body.element.appendChild(root);
        this.canvas=new $App.Canvas(root,100,100,true);
        this.canvas.isRootCanvas=true;
        this.world=new $App.World(this.canvas);
        let left=document.createElement("div");
        left.style="font-family: monospace; position: absolute; width: 30%; height: 100%; left: 0; top: 0; display: none; z-index: 100;";
        let right=document.createElement("div");
        right.style="position: absolute; width: 100%; height: 100%; right: 0; top: 0; display: grid; box-sizing: border-box; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; padding: 1rem";
        right.$canvas=this.canvas;
        this.body.right=right;
        root.appendChild(left);
        root.appendChild(right);
        left.appendChild(this.console.element);
        right.appendChild(this.canvas.container);
        this.body.overlay=document.createElement("div");
        this.body.overlay.style="display: none; position: absolute; width: 100%; height: 100%; top: 0; right: 0; background-color: #00000030";
        right.appendChild(this.body.overlay);
        this.toast=new $App.Toast(right);
        root.appendChild(this.help.element);
        left.appendChild(this.help.helpButton);
        
        this.dialog.root=document.createElement("div");
        this.dialog.root.style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; background-color: #aaaa;";
        this.dialog.backdrop=document.createElement("div");
        this.dialog.backdrop.style="width: 100%; height: 100%;display: grid; grid-template-rows: 1fr; grid-template-columns: 1fr; justify-items: center; align-items: center";
        this.dialog.body=document.createElement("div");
        this.dialog.body.style="padding: 0.3rem;border: 1pt solid black; background-color: white; max-width: 100%; max-height: 100%";
        this.dialog.header=document.createElement("div");
        this.dialog.header.style="width: 100%;text-align: right";
        var closeButton=document.createElement("button");
        closeButton.textContent="x";
        closeButton.onclick=()=>{
          this.dialog.root.style.display="none";
        };
        this.dialog.header.appendChild(closeButton);
        this.dialog.content=document.createElement("div");
        this.dialog.content.style="width: 100%";
        this.dialog.root.appendChild(this.dialog.backdrop);
        this.dialog.backdrop.appendChild(this.dialog.body);
        this.dialog.body.appendChild(this.dialog.header);
        this.dialog.body.appendChild(this.dialog.content);

        this.dialog.root.style.display="none";
        right.appendChild(this.dialog.root);

        if(this.setupData){
          this.setupApp(this.setupData);
        }
        let hash=location.hash;
        if(hash && hash.indexOf('console')>=0){
          this.showConsoleOnStart=true;
        }
        if(this.showConsoleOnStart){
          this.console.setVisible(true);
        }
        this.onResize();
        this.animationFrame=async ()=>{
          this.gamepad.updatePhysicalGamepad();
          if(window.onNextFrame && !$App.debug.paused){
            try{
              await window.onNextFrame();
            }catch(e){
              $App.handleException(e);
            }
          }
          requestAnimationFrame(this.animationFrame);
        }
        if(window.$onAfterSetup){
          window.$onAfterSetup();
        }
        if(window.onStart){
          var startFunc=async ()=>{
            if(!$App.debug.paused){  
              try{
                await window.onStart();
              }catch(e){
                $App.handleException(e);

              }
              requestAnimationFrame(this.animationFrame);
            }else{
              setTimeout(startFunc,100);
            }
          };
          if(window===window.top){
            startFunc();
          }else{
            setTimeout(startFunc,10);
          }
        }else{
          requestAnimationFrame(this.animationFrame);
        }
        this.addMouseStateHandler(this.canvas.el);
        
        
      }else{
        setTimeout(()=>{
          this.setup();
        },10);
      }
    }
    
    $App.setupApp=function(title,favicon,width,height,backgroundColor){
      if(!this.body.element){
        this.setupData={
          title: title,
          favicon: favicon,
          width: width,
          height: height,
          backgroundColor
        };
        return;
      }else{
        if(typeof title==="object"){
          favicon=title.favicon;
          width=title.width;
          height=title.height;
          backgroundColor=title.backgroundColor;
          title=title.title;
        }
      }
      if(title){
        var el=document.createElement("title");
        el.textContent=title;
        document.head.appendChild(el);
      }
      if(favicon){
        el=document.createElement("link");
        el.setAttribute("rel","icon");
        el.setAttribute("href","data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>"+favicon+"</text></svg>");
        document.head.appendChild(el);
      }
      if(!width) width=100;
      if(!height) height=100;
      if(!backgroundColor) backgroundColor="white";
      this.canvas.setSize(width,height,this.body.width,this.body.height);
      this.body.element.style.backgroundColor=backgroundColor;
    }
    
    $App.asyncFunctionCall=async function(object,methodname,argumentsArray){
      return await object[methodname].apply(object,argumentsArray);
    };
    
    $App.onResize=function(force){
      if(!$App.body.element){
        setTimeout($App.onResize,100);
        return;
      }
      var w = $App.body.right.clientWidth;
      var h = $App.body.right.clientHeight;
      if(w<=0 || h<=0){
        return;
      }
      if(force===true || w!=$App.body.width || h>$App.body.height){
        $App.body.width=w;
        $App.body.height=h;
        $App.canvas.resize(w,h);
      }else{
        $App.body.width=w;
        $App.body.height=h;
      }
    };
    window.onresize=function(e){
      $App.onResize();
      if(window.onResize){
        window.onResize();
      }
    };
    
    window.onkeydown=function(ev){
      var k=ev.keyCode;
      var kb=$App.keyboard;
      kb.down[k]=true;
      if(kb.lastKeycodeDown!==k){
        kb.lastKeycodeDown=k;
        if($App.gamepad.element){
          var gp=$App.gamepad;
          gp.updateButtons(kb.down[gp.keycodes.A],kb.down[gp.keycodes.B], kb.down[gp.keycodes.X], kb.down[gp.keycodes.Y], kb.down[gp.keycodes.E], kb.down[gp.keycodes.F]);
          var button=gp.getMappedButton(k);
          if(button){
            if(button==="up" || button==="down" || button==="left" || button==="right"){
              gp.updateJoystickDirection(kb.down[gp.keycodes.left],kb.down[gp.keycodes.right],kb.down[gp.keycodes.up],kb.down[gp.keycodes.down]);
              button=null;
            }
            if(window.onGamepadDown){
              if($App.debug.paused) return;
              try{
                window.onGamepadDown(button);
              }catch(e){
                $App.handleException(e);
              }
            }
          }
        }
        if($App.debug.paused) return;
        if(window.onKeyDown){
          try{
            window.onKeyDown(k);
          }catch(e){
            $App.handleException(e);
          }
        }
      }
    };
    window.onkeyup=function(ev){
      var k=ev.keyCode;
      var kb=$App.keyboard;
      delete kb.down[k];
      kb.lastKeycodeDown=-1;
      if($App.gamepad.element){
        var gp=$App.gamepad;
        gp.updateButtons(kb.down[gp.keycodes.A],kb.down[gp.keycodes.B], kb.down[gp.keycodes.X], kb.down[gp.keycodes.Y], kb.down[gp.keycodes.E], kb.down[gp.keycodes.F]);
        var button=gp.getMappedButton(k);
        if(button){
          if(button==="up" || button==="down" || button==="left" || button==="right"){
            gp.updateJoystickDirection(kb.down[gp.keycodes.left],kb.down[gp.keycodes.right],kb.down[gp.keycodes.up],kb.down[gp.keycodes.down]);
            button=null;
          }
          if(window.onGamepadUp){
            if($App.debug.paused) return;
            try{
              window.onGamepadUp(button);
            }catch(e){
              $App.handleException(e);
            }
          }
        }
      }
      if($App.debug.paused) return;
      if(window.onKeyUp){
        try{
          window.onKeyUp(k);
        }catch(e){
          $App.handleException(e);
        }
      }
    };
    
    window.addEventListener("gamepadconnected", function(e) {
      $App.gamepad.connectPhysicalGamepad(e.gamepad);
    });
    
    window.addEventListener("gamepaddisconnected", function(e) {
      $App.gamepad.disconnectPhysicalGamepad();
    });
    
    $App.addMouseStateHandler=function(e){
      e.onmousedown=function(ev){
        $App.mouse.update(ev.clientX,ev.clientY,e,'down',ev.timeStamp);
        $App.mouse.down=true;
      };
      e.addEventListener("touchstart",function(ev){
        var t=ev.touches;
        if(!t) return;
        t=t[0];
        if(!t) return;
        $App.mouse.update(t.clientX,t.clientY,e,'down',ev.timeStamp,true);
        $App.mouse.down=true;
      });
      e.addEventListener("touchend",function(ev){
        var x=-1; 
        var y=-1;
        var t=ev.touches;
        if(t && t[0]){
          t=t[0];
        }else if(ev.changedTouches && ev.changedTouches[0]){
          t=ev.changedTouches[0]
        }
        if(t){
          x=t.clientX;
          y=t.clientY;
        }
        $App.mouse.update(x,y,e,'up',ev.timeStamp,true);
        $App.mouse.down=false;
      });
      e.onmouseup=function(ev){
        $App.mouse.update(ev.clientX,ev.clientY,e,'up',ev.timeStamp);
        $App.mouse.down=false;
      };
      e.addEventListener("touchmove",function(ev){
        var t=ev.touches;
        if(!t) return;
        t=t[0];
        if(!t) return;
        $App.mouse.update(t.clientX,t.clientY,e,'move',ev.timeStamp,true);
        $App.mouse.down=true;
      });
      e.onmousemove=function(ev){
        $App.mouse.update(ev.clientX,ev.clientY,e,'move',ev.timeStamp);
      };
    };
    
    $App.registerAsset=function(url, name){
      this.assets[name]={
        url: url
      }
    };
  
    $App.registerScript=function(url){
      this.scripts.push(url);
    }
  
    $App.getAsset=function(asset){
      if(!asset){
        var m="Dieses Asset konnte nicht geladen werden.";
        console.log(m);
        throw m;
      }
      if(asset.split){
        return this.getAssetByURL(asset);
      }else{
        if(asset.asset){
          return asset.asset;
        }else{
          return asset;
        }
      }
    }
    
    $App.getAssetByURL=function(url){
      if(!window.assets){
        let m="Du hast noch keine Assets registriert (loadAssets).";
        console.log(m);
        throw m;
      }
      url=url.toLowerCase();
      for(let i=0; i<this.assets.length; i++){
        let a=this.assets[i];
        if(a.url.toLowerCase()===url){
          return a.asset;
        }
      }
      let m="Es gibt kein Asset namens '"+url+"'.";
      console.log(m);
      throw m;
    }
    
    $App.loadScripts=async function(){
      for(var i=0;i<this.scripts.length;i++){
        var s=document.createElement("script");
        var url=this.scripts[i];
        
        var p=new Promise((resolve,reject)=>{
          s.onload=()=>{
            resolve();
          };
          s.onerror=()=>{
            resolve();
          };
          document.head.insertBefore(s,document.head.firstChild);
          s.src=url;
        });
        await p;
        
      }
    }
  


    $App.loadAssets=async function(){
      for(let a in this.assets){
        let asset=this.assets[a];
        let url=new URL(asset.url,document.baseURI);
        let pathname=url.pathname.toLowerCase();
        let fullurl=url.href;
        let p;
        let type=null;
        if(pathname.startsWith("audio/") || pathname.endsWith("mp3")||pathname.endsWith("wav")||pathname.endsWith("ogg")){
          if(window.Howl){
            asset.sound=new Howl({src: fullurl});
          }else{
            continue;
          }
        }else if(pathname.endsWith("txt")){
          try{
            var r=await fetch(fullurl);
            var text=await r.text();
            asset.lines=text.split("\n");
            asset.currentLine=0;
            asset.lineCount=asset.lines.length;
            asset.nextLine=function(){
              this.currentLine++;
              return this.lines[this.currentLine-1];
            }
          }catch(e){
            console.log("Asset '"+fullurl+"' konnte nicht geladen werden.");
          }
        }else{
          let image=new Image();
          p=new Promise((resolve,reject)=>{
            image.onload=()=>{
              resolve(image);
            };
            image.onerror=()=>{
              resolve(null);
            };
          });
          image.src=fullurl;
          image=await p;
          if(image){
            asset.object=image;
            asset.type="image";
          }else{
            var m="Das Asset '"+asset.url+"' konnte nicht geladen werden.";
          }
        }
      }
    };
    
    /**Canvas: */
    $App.Canvas=function Canvas(parent,width,height,isRoot){
      this.isRoot=isRoot===true;
      if(isRoot){
        this.container=document.createElement("div");
      }else{
        this.container=$App.createElement("div");
        this.container.style.overflow="hidden";
      }
      this.el=document.createElement("canvas");
      this.el.jel=this;
      this.el.isCanvas=true;
      this.container.className="canvas-container";
      this.container.style.position="absolute";
      this.container.style.left=0;
      this.container.style.right=0;
      this.container.style.top=0;
      this.container.style.bottom=0;
      this.container.style.width="100%";
      this.container.style.height="100%";
      //this.container.style.overflow="hidden";
      this.container.appendChild(this.el);
      this.el.style.position="absolute";
      this.el.style.left=0;
      this.el.style.top=0;
      this.el.style.width="100%";
      this.el.style.height="100%";
      this.width=width;
      this.height=height;
      this.origin={
        x: 0,
        y: 0
      };
      this.pixelWidth=-1;
      this.pixelHeight=-1;
      this.parent=parent;
      this.ctx=this.el.getContext("2d");
      this.commands=[];
      this.elements=[];
      this.lastPoint={
        x: 0,
        y: 0
      };
      this.state={
        color: "black",
        lineWidth: 0.5,
        fontSize: 5,
        opacity: 1,
        font: 'monospace',
        mirrored: false,
        rotation: 0
      };
      this.reset();
    };
    
    $App.Canvas.$getAlignment=function(align){
      var ha,va;
      if(align && align.toLowerCase){
        align=align.toLowerCase(); 
        if(align.indexOf("left")>=0){
          ha="left";
        }else if(align.indexOf("right")>=0){
          ha="right";
        }else{
          ha="center";
        }
        if(align.indexOf("bottom")>=0){
          va="bottom";
        }else if(align.indexOf("top")>=0){
          va="top";
        }else{
          va="middle";
        }
      }else{
        ha="center";
        va="middle";
      }
      return {
        h: ha, v: va
      };
    };
  
    $App.Canvas.prototype={
      save: function(dontAdd){
        if(!dontAdd){
          this.addCommand("save",[])
        }
        this.ctx.save();
      },
      restore: function(dontAdd){
        if(!dontAdd){
          this.addCommand("restore",[])
        }
        this.ctx.restore();
      },
      reset: function(){
        this.clear(true);
        this.lastPoint.x=0;
        this.lastPoint.y=0;
        this.setStroke(new $App.BasicStroke());
        this.setLinewidth(this.state.lineWidth,true);
        this.ctx.setTransform(1,0,0,1,0,0);
        this.setFontsize(this.state.fontSize,true);
        this.setFont(this.state.font,true);
        this.setColor(this.state.color,true);
        this.setOpacity(this.state.opacity,true);
      },
      rotate: function(theta,x,y,dontAdd){
        if(!dontAdd){
          this.addCommand("rotate",[theta,x,y]);
        }
        x=this.getX(x);
        y=this.getY(y);
        theta*=Math.PI/180;
        
        if(x===undefined){
          this.ctx.rotate(-theta);
        }else{
          this.ctx.translate(x,y);
          this.ctx.rotate(-theta);
          this.ctx.translate(-x,-y);
        }
      },
      translate: function(x,y,dontAdd){
        if(!dontAdd){
          this.addCommand("translate",[x,y]);
        }
        x=this.getWidth(x);
        y=this.getHeight(y);
        this.ctx.translate(x,-y);
      },
      shear: function(sx,sy){
    
      },
      scale: function(sx,sy,x,y,dontAdd){
        if(!dontAdd){
          this.addCommand("scale",[sx,sy,x,y]);
        }
        if(x===undefined){
          var dpr=window.devicePixelRatio||1;
          this.ctx.translate(0,this.height*dpr);
          this.ctx.scale(sx*1.0,sy*1.0);
          this.ctx.translate(0,-this.height*dpr);
        }else{
          x=this.getX(x);
          y=this.getY(y);
          this.ctx.translate(x,y);
          this.ctx.scale(sx,sy);
          this.ctx.translate(-x,-y);
        }
      },
      setTransform: function(m00,m10,m01,m11,m02,m12,dontAdd){
        if(!dontAdd){
          this.addCommand("setTransform",[m00,m10,m01,m11,m02,m12]);
        }
        var dpr=window.devicePixelRatio||1;
        this.ctx.setTransform(m00,m10,m01,m11,m02*dpr,m12*dpr);
      },
      redraw: function(){
        this.reset();
        for(var i=0;i<this.container.children.length;i++){
          var c=this.container.children[i];
          if(c.updatePosition){
            c.updatePosition();
          }
        }
        for(var i=0;i<this.commands.length;i++){
          var c=this.commands[i];
          var f=this[c.cmd];
          f.apply(this,c.args);
        }
      },
      setOrigin: function(x,y){
        this.origin.x=x;
        this.origin.y=y;
      },
      setSize: function(width,height,fullWidth,fullHeight){
        this.width=width;
        this.height=height;
        this.resize(fullWidth,fullHeight,true);
      },
      updateElementPosition: function(el,cx,cy,width,height,align){
        el.appJSData.cx=cx;
        el.appJSData.cy=cy;
        el.appJSData.width=width;
        el.appJSData.height=height;
        if(this.isRoot){
          el.style.position="absolute";
          el.style.left="0";
          el.style.top="0";
          el.style.width="100%";
          el.style.height="100%";
          return;
        }
        if(!align){
          align=$App.Canvas.$getAlignment("center");
        }
        el.appJSData.align=align;
        if(!width){
          width=el.offsetWidth;
          if(!width && el.childNodes.length>0){
            width=el.childNodes[0].offsetWidth;
          }
          width=this.getCanvasWidth(width);
        }
        if(!height){
          height=el.offsetHeight;
          if(!height && el.childNodes.length>0){
            height=el.childNodes[0].offsetHeight;
          }
          height=this.getCanvasHeight(height);
        }
        // if(el.noAbsolutePosition){
        //   if(el.$standardPositionValue){
        //     el.style.position=el.$standardPositionValue;
        //   }else{
        //     el.style.position="";
        //   }
        //   //el.style.width="";
        //   //el.style.height="";
        //   el.style.left="0px";
        //   el.style.top="0px";
        //   return;
        // }else{
        //   el.style.position="absolute";
        // }
        el.style.position="absolute";
        var x,y;
        if(align.h==="center"){
          x=cx-width/2;
        }else if(align.h==="left"){
          x=cx;
        }else{
          x=cx-width;
        }
        if(align.v==="middle"){
          y=cy+height/2;
        }else if(align.v==="top"){
          y=cy+height;
        }else{
          y=cy;
        }
        // el.style.left=(100*(x))/(this.width)+"%";
        // el.style.bottom=(100*(y))/(this.height)+"%";
        el.style.left=this.getRawX(x)+"px";
        el.style.top=this.getRawY(y)+"px";
        el.style.width=this.getRawWidth(width)+"px";
        el.style.height=this.getRawHeight(height)+"px";
      },
      isEmpty: function(){
        return (this.container.childNodes.length<=1);
      },
      addElement: function(el,cx,cy,width,height){
        this.container.appendChild(el);
        this.updateElementPosition(el,cx,cy,width,height);
        
      },
      removeChild: function(el){
        this.container.removeChild(el);
      },
      add: function(el){
        if(el.parentNode){
          el.parentNode.removeChild(el);
        }
        el.appJSData.parent=this;
        this.addElement(el,el.appJSData.cx,el.appJSData.cy,el.appJSData.width,el.appJSData.height);
      },
      resize: function(w,h,force){
        if(!w){
          w=this.container.offsetWidth;
          h=this.container.offsetHeight;
        }
        if(force || (w!==this.pixelWidth || h!==this.pixelHeight)){
          var dpr=window.devicePixelRatio||1;
          this.el.width=Math.round(w*dpr);
          this.el.height=Math.round(h*dpr);
          var left, right, bottom, top;
          left=0; right=0; top=0; bottom=0;
          if(w*this.height>=h*this.width){
            var s=h/this.height;
            var realW=this.width*s;
            left=(w-realW)/2;
            w=realW;
          }else{
            var s=w/this.width;
            var realH=this.height*s;
            top=(h-realH)/2;
            h=realH;
          }
          this.pixelLeft=left;
          this.pixelTop=top;
          this.pixelWidth=w;
          this.pixelHeight=h;
          // this.container.style.width=this.pixelWidth+"px";
          // this.container.style.height=this.pixelHeight+"px";
          // this.container.style.top=top+"px";
          // this.container.style.left=left+"px";
          //this.el.style.width=this.pixelWidth+"px";
          // this.el.style.height=this.pixelHeight+"px";
          // this.el.style.top=top+"px";
          // this.el.style.left=left+"px";
  
          // this.el.width=Math.round(w*this.dpr);
          // this.el.height=Math.round(h*this.dpr);
          for(var i=0;i<this.container.childNodes.length;i++){
            var c=this.container.childNodes[i];
            if(c.updatePosition){
              c.updatePosition();
            }
            // if(c.resize){
            //   c.resize();
            // }
          }
          this.redraw();
        }
      },
      setColor: function(c,dontAdd){
        if(!dontAdd){
          this.addCommand("setColor",[c]);
        }
        this.color=c;
        this.state.color=c;
        this.ctx.strokeStyle=c;
        this.ctx.fillStyle=this.ctx.strokeStyle;
      },
      setOpacity: function(v,dontAdd){
        if(!dontAdd){
          this.addCommand("setOpacity",[v]);
        }
        this.state.opacity=v;
        this.ctx.globalAlpha=v;
      },
      setFontsize: function(size,dontAdd){
        this.state.fontSize=size;
        if(!dontAdd){
          this.addCommand("setFontsize",[size]);
        }
        this.ctx.font=this.getHeight(this.state.fontSize,true)+"px "+this.state.font;
      },
      setMirrored: function(mirrored,dontAdd){
        this.state.mirrored=mirrored;
        if(!dontAdd){
          this.addCommand("setMirrored",[mirrored]);
        }
      },
      setRotation: function(angle,dontAdd){
        this.state.rotation=angle;
        if(!dontAdd){
          this.addCommand("setRotation",[angle]);
        }
      },
      setFont: function(name,dontAdd){
        this.state.font=name;
        if(!dontAdd){
          this.addCommand("setFont",[name]);
        }
        this.ctx.font=this.getHeight(this.state.fontSize,true)+"px "+this.state.font;
      },
      getPixelFontsize: function(){
        return parseFloat(this.ctx.font);
      },
      setLinewidth: function(lw,dontAdd){
        if(!dontAdd){
          this.addCommand("setLinewidth",[lw]);
        }
        this.state.lineWidth=lw;
        lw=this.getHeight(lw,true);
        this.ctx.lineWidth=lw;
      },
      setStroke: function(s){
        var a=["butt","round","square"];
        this.ctx.lineCap=a[s.$cap];
        a=["miter","round","bevel"];
        this.ctx.lineJoin=a[s.$join];
        var d=s.$dash_array;
        if(!d) d=[];
        this.ctx.setLineDash(d);
        /*TODO: Dash_Phase*/
      },
      clear: function(withoutCommands){
        this.el.width=this.el.width;
        this.setLinewidth(this.state.lineWidth,true);
        this.setFontsize(this.state.fontSize,true);
        this.setColor(this.state.color,true);
        if(!withoutCommands){
          this.commands=[];
        }
      },
      clearRect: function(x,y,w,h){
        var dpr=window.devicePixelRatio||1;
        this.ctx.clearRect(x*dpr,y*dpr,w*dpr,h*dpr);
      },
      drawArc: function(x, y, width, height, startAngle, arcAngle){
        if(startAngle===arcAngle) return;
        this.$createOval(x, y, width, height, startAngle, arcAngle);
        this.ctx.stroke();
      },
      fillArc: function(x, y, width, height, startAngle, arcAngle){
        if(startAngle===arcAngle) return;
        this.$createOval(x, y, width, height, startAngle, arcAngle);
        this.ctx.fill();
      },
      drawLine: function(x1,y1,x2,y2,dontAdd){
        if(!dontAdd){
          this.addCommand("drawLine",[x1,y1,x2,y2]);
        }
        x1=this.getX(x1);
        y1=this.getY(y1);
        x2=this.getX(x2);
        y2=this.getY(y2);
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
      },
      beginPath: function(x,y,dontAdd){
        if(!dontAdd){
          this.addCommand("beginPath",[x,y]);
        }
        x=this.getX(x);
        y=this.getY(y);
        this.lastPoint.x=x;
        this.lastPoint.y=y;
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
      },
      jump: function(dx,dy,dontAdd){
        if(!dontAdd){
          this.addCommand("jump",[dx,dy]);
        }
        dx=this.getWidth(dx);
        dy=this.getHeight(dy);
        this.lastPoint.x+=dx;
        this.lastPoint.y-=dy;
        this.ctx.moveTo(this.lastPoint.x,this.lastPoint.y);
      },
      jumpTo: function(x,y,dontAdd){
        if(!dontAdd){
          this.addCommand("jumpTo",[x,y]);
        }
        x=this.getX(x);
        y=this.getY(y);
        this.lastPoint.x=x;
        this.lastPoint.y=y;
        this.ctx.moveTo(this.lastPoint.x,this.lastPoint.y);
      },
      rect: function(w,h,dontAdd){
        if(!dontAdd){
          this.addCommand("rect",[w,h]);
        }
        w=this.getWidth(w);
        h=this.getHeight(h);
        let x=this.lastPoint.x;
        let y=this.lastPoint.y;
        this.ctx.moveTo(x-w/2,y-h/2);
        this.ctx.lineTo(x+w/2,y-h/2);
        this.ctx.lineTo(x+w/2,y+h/2);
        this.ctx.lineTo(x-w/2,y+h/2);
        this.ctx.closePath();
      },
      circle: function(r,start,stop,dontAdd){
        if(!dontAdd){
          if(start===undefined){
            start=0;
          }
          if(stop===undefined){
            stop=360;
          }
          this.addCommand("circle",[r,start,stop]);
        }
        r=this.getWidth(r);
        let cx=this.lastPoint.x;
        let cy=this.lastPoint.y;
        let counterclockwise=start<=stop;
    
        this.ctx.arc(cx,cy,r,-start*Math.PI/180,-stop*Math.PI/180,counterclockwise);
      },
      line: function(dx,dy,dontAdd){
        if(!dontAdd){
          this.addCommand("line",[dx,dy]);
        }
        dx=this.getWidth(dx);
        dy=this.getHeight(dy);
        this.lastPoint.x+=dx;
        this.lastPoint.y-=dy;
        this.ctx.lineTo(this.lastPoint.x,this.lastPoint.y);
      },
      lineTo: function(x,y,dontAdd){
        if(!dontAdd){
          this.addCommand("line",[x,y]);
        }
        x=this.getX(x);
        y=this.getY(y);
        this.lastPoint.x=x;
        this.lastPoint.y=y;
        this.ctx.lineTo(this.lastPoint.x,this.lastPoint.y);
      },
      arcTo: function(x1,y1,x2,y2,r){
        var dpr=window.devicePixelRatio||1;
        this.ctx.arcTo(x1*dpr,y1*dpr,x2*dpr,y2*dpr,r*dpr);
      },
      closePath: function(dontAdd){
        if(!dontAdd){
          this.addCommand("closePath",[]);
        }
        this.ctx.closePath();
      },
      drawPath: function(dontAdd){
        if(!dontAdd){
          this.addCommand("drawPath",[]);
        }
        this.ctx.stroke();
      },
      fillPath: function(dontAdd){
        if(!dontAdd){
          this.addCommand("fillPath",[]);
        }
        this.ctx.fill();
      },
      isPointInPath: function(x,y){
        return this.ctx.isPointInPath(this.getX(x),this.getY(y));
      },
      write: function(text,x,y,align,dontAdd){
        if(!dontAdd){
          align=$App.Canvas.$getAlignment(align);
          this.addCommand("write",[text,x,y,align]);
        }
        x=this.getX(x);
        y=this.getY(y);
        var cx=x;
        var cy=y;
        this.ctx.save();
        this.ctx.translate(cx,cy);
        if(this.state.mirrored){
          this.ctx.scale(-1,1);
          this.ctx.rotate(Math.PI*this.state.rotation/180);
        }else{
          this.ctx.rotate(-Math.PI*this.state.rotation/180);
        }
        if(text.split){
          var lines=text.split("\n");
        }else{
          var lines=[text+""]
        }
        var lineHeight=this.getPixelFontsize();
        this.ctx.textAlign=align.h;
        this.ctx.textBaseline=align.v;
        
        if(align.v==="bottom"){
          y=-lineHeight*(lines.length-1);  
        }else if(align.v==="middle"){
          y=-lineHeight*((lines.length-1)/2);
        }else{
          y=0;
        }
        
        for(var i=0;i<lines.length;i++){
          this.ctx.fillText(lines[i],0,y);
          y+=lineHeight;
        }
        this.ctx.restore();
      },
      drawImage: function(image,cx,cy,w,h,angle,mirrored,sourceRect,dontAdd){
        if(!image) return;
        if(!dontAdd){
          angle*=Math.PI/180;
          this.addCommand('drawImage',[image,cx,cy,w,h,angle,mirrored,sourceRect]);
        }
        cx=this.getX(cx);
        cy=this.getY(cy);
        w=this.getWidth(w);
        h=this.getHeight(h);
        this.ctx.save();
        this.ctx.translate(cx,cy);
        if(mirrored){
          this.ctx.scale(-1,1);
        }
        if(angle){
          this.ctx.rotate(-angle);
        }
        if(image.object){
          image=image.object;
        }else if(image.substring){
          var asset=$App.assets[image];
          if(!asset){
            var m="Es gibt kein Bild namens '"+image+"'. Du musst es vorher mittels loadAsset laden.";
            console.log(m);
            throw m;
          }
          if(!asset.object){
            var m="Das Asset '"+image+"' ist keine gültige Bilddatei. Prüfe die URL.";
            console.log(m);
            throw m;
          }
          image=asset.object;
          
        }
        if(sourceRect){
          this.ctx.drawImage(image,image.width/2+sourceRect.cx-sourceRect.w/2,image.height/2+sourceRect.cy-sourceRect.h/2,sourceRect.w,sourceRect.h,-w/2,-h/2,w,h);
        }else{
          this.ctx.drawImage(image,-w/2,-h/2,w,h);
        }
        this.ctx.restore();
      },
      getImageBase64: function(){
        return this.el.toDataURL("image/png");
      },
      fillOutside: function(dontAdd){
        if(!dontAdd){
          this.addCommand("fillOutside",[]);
        }
        var dpr=window.devicePixelRatio||1;
        if(this.pixelLeft){
          this.ctx.fillRect(0,0,this.pixelLeft*dpr,this.pixelHeight*dpr);
          this.ctx.fillRect((this.pixelWidth+this.pixelLeft)*dpr,0,this.pixelLeft*dpr,this.pixelHeight*dpr);
        }else if(this.pixelTop){
          this.ctx.fillRect(0,0,this.pixelWidth*dpr,this.pixelTop*dpr);
          this.ctx.fillRect(0,(this.pixelHeight+this.pixelTop)*dpr,this.pixelWidth*dpr,this.pixelTop*dpr);
        }
      },
      drawRect: function(x,y,w,h,dontAdd){
        if(!dontAdd){
          this.addCommand("drawRect",[x,y,w,h]);
        }
        return this.paintRect(x,y,w,h,false);
      },
      fillRect: function(x,y,w,h,dontAdd){
        if(!dontAdd){
          this.addCommand("fillRect",[x,y,w,h]);
        }
        return this.paintRect(x,y,w,h,true);
      },
      paintRect: function(x,y,w,h,fill,dontAdd){
        if(!dontAdd){
          this.addCommand("paintRect",[x,y,w,h,fill]);
        }
        var obj={
          cx: x,
          cy: y,
          w: w,
          h: h,
          contains: function(x,y){
            return (x>=this.cx-this.w/2 && x<=this.cx+this.w/2 && y>=this.cy-this.h/2 && y<=this.cy+this.h/2);
          },
          draw: function(){
            $App.canvas.paintRect(this.cx,this.cy,this.w,this.h,false)
          },
          fill: function(){
            $App.canvas.paintRect(this.cx,this.cy,this.w,this.h,true)
          }
        };
        x=this.getX(x);
        y=this.getY(y);
        w=this.getWidth(w);
        h=this.getHeight(h);
        if(fill){
          this.ctx.fillRect(x-w/2,y-h/2,w,h);
        }else{
          this.ctx.strokeRect(x-w/2,y-h/2,w,h);
        }
        return obj;
      },
      drawCircle: function(x,y,r,dontAdd){
        if(!dontAdd){
          this.addCommand("drawCircle",[x,y,r]);
        }
        return this.paintCircle(x,y,r,false,true);
      },
      fillCircle: function(x,y,r,dontAdd){
        if(!dontAdd){
          this.addCommand("fillCircle",[x,y,r]);
        }
        return this.paintCircle(x,y,r,true);
      },
      paintCircle: function(cx,cy,r,fill,dontAdd){
        if(!dontAdd){
          this.addCommand("paintCircle",[cx,cy,r,fill]);
        }
        var obj={
          cx: cx,
          cy: cy,
          r: r,
          contains: function(x,y){
            return ((this.cx-x)*(this.cx-x)+(this.cy-y)*(this.cy-y)<=this.r*this.r);
          },
          draw: function(){
            $App.canvas.paintCircle(this.cx,this.cy,this.r,false)
          },
          fill: function(){
            $App.canvas.paintCircle(this.cx,this.cy,this.r,true)
          }
        };
        cx=this.getX(cx);
        cy=this.getY(cy);
        r=this.getWidth(r);
        this.ctx.beginPath();
        this.ctx.arc(cx,cy,r,0,2*Math.PI);
        if(fill){
          this.ctx.fill();
        }else{
          this.ctx.stroke();
        }
        return obj;
      },
      addCommand: function(cmd,args){
        args.push(true);
        this.commands.push({
          cmd: cmd,
          args: args
        });
      },
      getCanvasMinX: function(){
        return this.getCanvasX(0);
      },
      getCanvasMaxX: function(){
        return this.getCanvasX(this.pixelWidth+this.pixelLeft*2);
      },
      getCanvasMinY: function(){
        return this.getCanvasY(this.pixelHeight+this.pixelTop*2);
      },
      getCanvasMaxY: function(){
        return this.getCanvasY(0);
      },
      getCanvasX: function(x){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (x-this.pixelLeft-(this.pixelWidth-s*this.width)/2)/(s)-this.origin.x;
        }else{
          var s=this.pixelWidth/this.width;
          return (x-this.pixelLeft)/(s)-this.origin.x;
        }
      },
      getCanvasY: function(y){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return -(y-this.pixelTop-this.pixelHeight)/s-this.origin.y;
        }else{
          var s=this.pixelWidth/this.width;
          return (-(y-this.pixelTop-this.pixelHeight)-(this.pixelHeight-s*this.height)/2)/s-this.origin.y;
        }
      },
      getCanvasWidth: function(w){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (w/s);
        }else{
          var s=this.pixelWidth/this.width;
          return (w/s);
        }
      },
      getCanvasHeight: function(h){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (h/s);
        }else{
          var s=this.pixelWidth/this.width;
          return (h/s);
        }
      },
      getRawX: function(x){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (s*(x+this.origin.x)+this.pixelLeft+(this.pixelWidth-s*this.width)/2);
        }else{
          var s=this.pixelWidth/this.width;
          return (s*(x+this.origin.x)+this.pixelLeft);
        }
      },
      getRawY: function(y){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (this.pixelHeight+this.pixelTop-s*(y+this.origin.y));
        }else{
          var s=this.pixelWidth/this.width;
          return (this.pixelHeight+this.pixelTop-(s*(y+this.origin.y)+(this.pixelHeight-s*this.height)/2));
        }
      },
      getRawWidth: function(w){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (s*w);
        }else{
          var s=this.pixelWidth/this.width;
          return (s*w);
        }
      },
      getRawHeight: function(h){
        if(this.pixelWidth*this.height>=this.pixelHeight*this.width){
          var s=this.pixelHeight/this.height;
          return (s*h);
        }else{
          var s=this.pixelWidth/this.width;
          return (s*h);
        }
      },
      getX: function(x,dontRound){
        var dpr=window.devicePixelRatio||1;
        x=this.getRawX(x)*dpr;
        if(!dontRound){
          x=Math.round(x);
        }
        return x;
      },
      getY: function(y,dontRound){
        var dpr=window.devicePixelRatio||1;
        y=this.getRawY(y)*dpr;
        if(!dontRound){
          y=Math.round(y);
        }
        return y;
      },
      getWidth: function(w,dontRound){
        var dpr=window.devicePixelRatio||1;
        w=this.getRawWidth(w)*dpr;
        if(!dontRound){
          w=Math.round(w);
        }
        return w;
      },
      getHeight: function(h,dontRound){
        var dpr=window.devicePixelRatio||1;
        h=this.getRawHeight(h)*dpr;
        if(!dontRound){
          h=Math.round(h);
        }
        return h;
      },
      paintOval: function(x,y,w,h,fill,dontAdd){
        if(!dontAdd){
          this.addCommand("paintOval",[x,y,w,h,fill]);  
        }
        x=this.getX(x);
        y=this.getY(y);
        w=this.getWidth(w);
        h=this.getHeight(h);
        this.$createOval(x,y,w,h);
        this.ctx.closePath();
        if(fill){
          this.ctx.fill();
        }else{
          this.ctx.stroke();
        }
      },
      $createOval: function(x,y,w,h,start,stop,dontAdd){
        var c=this.ctx;
        var rx=w/2;
        var ry=h/2;
        var cx=x;
        var cy=y;
        c.beginPath();
        if(!start) start=0;
        if(!stop) stop=360;
        if(start>stop){
          var c=Math.ceil((start-stop)/360);
          stop+=c*360;
        }
        if(stop-start>360){
          start=0;
          stop=360;
        }
        a=start*2*Math.PI;
        c.moveTo((cx+Math.cos(a)*rx),(cy-Math.sin(a)*ry));
        for(var i=start;i<=stop;i++){
          var a=i/180*Math.PI;
          c.lineTo((cx+Math.cos(a)*rx),(cy-Math.sin(a)*ry));
        }
        if(start===stop){
          c.closePath();
        }
      }
    };
    
    $App.BasicStroke=function BasicStroke( width, cap, join, miterlimit, dash, dash_phase){
      if(!width) width=1;
      if(!cap) cap=$App.BasicStroke.CAP_BUTT;
      if(!join) join=$App.BasicStroke.JOIN_MITER;
      if(!miterlimit) miterlimit=1;
      if(!dash) dash=null;
      if(!dash_phase) dash_phase=0;
      this.$width=width;
      this.$cap=cap;
      this.$join=join;
      this.$miterlimit=miterlimit;
      this.dash=dash;
      this.dash_phase=dash_phase;
    };
    $App.BasicStroke.CAP_BUTT=0;
    $App.BasicStroke.CAP_ROUND=1;
    $App.BasicStroke.CAP_SQUARE=2;
    $App.BasicStroke.JOIN_BEVEL=2;
    $App.BasicStroke.JOIN_MITER=0;
    $App.BasicStroke.JOIN_ROUND=1;
    
    $App.BasicStroke.prototype={
      set: function(stroke){
        this.$width=stroke.$width;
        this.$cap=stroke.$cap;
        this.$join=stroke.$join;
        this.$miterlimit=stroke.$miterlimit;
        this.dash=stroke.dash;
        this.dash_phase=stroke.dash_phase;
      },
      getDashArray: function(){
        return this.$dash;
      },
      getDashPhase: function(){
        return this.$dash_phase
      },
      getEndCap: function(){
        return this.$cap;
      },
      getLineJoin: function(){
        return this.$join;
      },
      getLineWidth: function(){
        return this.$width;
      },
      getMiterLimit: function(){
        return this.$miterlimit;
      }
    };
    
  
    /**World */
    $App.World=function(canvas){
      this.canvas=canvas;
      //zoom-stufe
      this.zoom=1;
      //mittelpunkt 
      this.cx=0;
      this.cy=0;
      this.width=0;
      this.height=0;
      this.bounds={
        fixed: false,
        cx: 0,
        cy: 0,
        w: 0,
        h: 0
      };
      this.mouse={
        x: -1,
        y: -1,
      }
    };
  
    $App.World.prototype={
      toString: function(){
        var s="";
        for(var i=0;i<this.tiles.length;i++){
          if(i>0) s+="\n";
          var row=this.tiles[this.tiles.length-i-1];
          for(var j=0;j<row.length;j++){
            s+=row[j];
          }
        }
        return s;
      },
      reset: function(){
        this.tiles=null;
        this.zoom=1;
        this.cx=0;
        this.cy=0;
        this.width=0;
        this.height=0;
        this.mouse={
          x: -1,
          y: -1,
        }
        this.bounds.x=0;
        this.bounds.y=0;
        this.bounds.w=0;
        this.bounds.h=0;
        this.bounds.fixed=false;
      },
      addRow: function(description){
        if(this.height===0){
          this.create(0,0);
        }
        this.height++;
        var cells=[];
        var val=null;
        var x=1;
        var y=this.tiles.length+1;
        var l=description;
        for(var j=0;j<l.length;j++){
          var tile={
            x: x,
            y: y,
            info: null
          };
          var c=l.charAt(j);
          if(c==="("){
            val="";
            var tile={
              x: x,
              y: y,
              info: null
            };
          }else if(c===")"){
            tile.type=val;
            cells.push(tile);
            val=null;
          }else{
            if(val===null){
              tile.type=c;
              cells.push(tile);
            }else{
              val+=c;
            }
          }
          x++;
        }
        if(this.height>1 && cells.length!==this.width){
          throw "addRow: '"+description+"' definiert "+cells.length+" Felder, die Welt hat aber "+this.width+" Felder!";
        }
        this.tiles.push(cells);
        if(cells.length>this.width){
          this.width=cells.length;
        }
        this.cx=(1+this.width)/2;
        this.cy=(1+this.height)/2;
        this.calcLayout();
        return cells;
      },
      create: function(width,height){
        this.tiles=[];
        var y=1;
        for(var i=0;i<height;i++){
          var cells=[];
          var x=1;
          for(var j=0;j<width;j++){
            var tile={
              x: x,
              y: y,
              info: null,
              type: " "
            };
            cells.push(tile);
            x++;
          }
          this.tiles.push(cells);
          y++;
        }
        this.width=width;
        this.height=height;
        this.cx=(1+this.width)/2;
        this.cy=(1+this.height)/2;
        this.calcLayout();
      },
      setup: function(description){
        this.width=0;
        this.height=0;
        if(!description || !description.substring){
          var m="setup: Die Beschreibung ist kein String";
          throw m;
        }
        var lines=description.split("\n");
        this.height=lines.length;
        this.tiles=[];
        for(var i=0;i<lines.length;i++){
          var l=lines[i].trim();
          this.addRow(l);
        }
        this.cx=(1+this.width)/2;
        this.cy=(1+this.height)/2;
        this.zoom=1;
        this.calcLayout();
      },
      replaceTypes: function(oldType,newType){
        this.forAllTiles((t)=>{
          if(t.type===oldType){
            t.type=newType;
          }
        });
      },
      forAllTiles: function(f){
        if(this.width*this.height===0){
          return;
        }
        for(var i=0;i<this.tiles.length;i++){
          for(var j=0;j<this.tiles[0].length;j++){
            var t=this.tiles[i][j];
            if(t){
              f(t);
            }
          }
        }
      },
      drawAsync: async function(){
        for(var i=0;i<this.tiles.length;i++){
          var row=this.tiles[i];
          for(var j=0;j<row.length;j++){
            var t=row[j];
            var x=j+1;
            var y=i+1;
            var tile=this.getTile(x,y);
            var drawRects=true;
            if(window.onTileDraw){
              drawRects=false;
              await window.onTileDraw(x,y,tile.type,tile.info);
              if(!window.onTileDraw){
                drawRects=true;
              }
            }
            if(drawRects){
              this.paintRect(x,y,1,1,false);
              this.write(tile.type,x,y);
            }
          }
        }
      },
      draw: function(){
        for(var i=0;i<this.tiles.length;i++){
          var row=this.tiles[i];
          for(var j=0;j<row.length;j++){
            var t=row[j];
            var x=j+1;
            var y=i+1;
            var tile=this.getTile(x,y);
            if(window.onTileDraw && ($App.language!=="java" || !$main || $main.onTileDraw)){
              window.onTileDraw(x,y,tile.type,tile.info);
            }else{
              this.paintRect(x,y,1,1,false);
              this.write(tile.type,x,y);
            }
          }
        }
      },
      calcLayout: function(){
        var canvasWidth,canvasHeight;
        if(this.bounds.fixed){
          canvasWidth=this.bounds.w;
          canvasHeight=this.bounds.h;
        }else{
          canvasWidth=this.canvas.width;
          canvasHeight=this.canvas.height;
        }
        var offsetX=0;
        var offsetY=0;
        this.screenWidth=0;
        this.screenHeight=0;
        this.scaleFactor=1;
        if(this.width*this.height===0){
          return;
        }
        if(this.width*canvasHeight>=this.height*canvasWidth){
          var f=canvasWidth/this.width;
          offsetY=(canvasHeight-this.height*f)/2;
        }else{
          var f=canvasHeight/this.height;
          offsetX=(canvasWidth-this.width*f)/2;
        }
        this.scaleFactor=f;
        var f=this.scaleFactor*this.zoom;
        var sw=f*this.width;
        var sh=f*this.height;
        offsetX=this.cx*f-sw;
        offsetY=this.cy*f-sh;
        this.screenWidth=sw,
        this.screenHeight=sh;
        
      },
      setBounds: function(cx,cy,w,h){
        this.cx=cx;
        this.cy=cy;
        this.w=w;
        this.h=h;
        this.boundsFixed=true;
      },
      getWorldBounds: function(sx,sy,sw,sh){
        /**berechnet das entsprechende Rechteck in der Spielwelt, umkehrung von getScreenBounds*/
        var dx=(sx-this.canvas.width/2)/(this.zoom*this.scaleFactor);
        var dy=(sy-this.canvas.height/2)/(this.zoom*this.scaleFactor);
        var x=dx+this.cx;
        var y=dy+this.cy;
        var w=sw/(this.zoom*this.scaleFactor);
        var h=sh/(this.zoom*this.scaleFactor);
        return {
          x: x,
          y: y,
          w: w,
          h: h
        };
      },
      getScreenBounds: function(x,y,w,h){
        var sx,sy,sw,sh;
        var dx=x-this.cx;
        var dy=y-this.cy;
        var sx=this.canvas.width/2+dx*this.zoom*this.scaleFactor;
        var sy=this.canvas.height/2+dy*this.zoom*this.scaleFactor;
        sw=w*this.zoom*this.scaleFactor;
        sh=h*this.zoom*this.scaleFactor;
        return {
          x: sx,
          y: sy,
          w: sw,
          h: sh
        };
      },
      getTiles: function(type){
        var tiles=[];
        if(this.width*this.height===0){
          return tiles;
        }
        for(var i=0;i<this.tiles.length;i++){
          for(var j=0;j<this.tiles[0].length;j++){
            var t=this.tiles[i][j];
            if(t && t.type===type){
              tiles.push(t);
            }
          }
        }
        return tiles;
      },
      getTile: function(x,y){
        var c=Math.floor(x-0.5);
        var r=Math.floor(y-0.5);
        r=this.tiles.length-1-r;
        if(r<0 || r>= this.tiles.length || c<0 || c>=this.tiles[r].length){
          return null;
        }
        return this.tiles[r][c];
      },
      setCenter(cx,cy){
        this.cx=cx;
        this.cy=cy;
        this.calcLayout();
      },
      moveCenter(dx,dy){
        this.setCenter(this.cx+dx,this.cy+dy);
      },
      setZoom(factor){
        this.zoom=factor;
        this.calcLayout;
      },
      write: function(text,x,y,align){
        var bounds=this.getScreenBounds(x,y,1,1);
        write(text,bounds.x,bounds.y,align);
      },
      paintRect: function(x,y,w,h,fill){
        var bounds=this.getScreenBounds(x,y,w,h);
        $App.canvas.paintRect(bounds.x,bounds.y,bounds.w,bounds.h,fill);
      },
      paintCircle(cx,cy,r,fill){
        var bounds=this.getScreenBounds(cx,cy,r,r);
        $App.canvas.paintCircle(bounds.x,bounds.y,bounds.w,fill);
      },
      drawImage: function(asset,x,y,w,h,rotation,mirrored,sx,sy,sw,sh){
        var bounds=this.getScreenBounds(x,y,w,h);
        if(sx!==undefined && sy!==undefined && sw!==undefined && sh!==undefined){
          drawImagePart(asset,bounds.x,bounds.y,bounds.w,bounds.h,sx,sy,sw,sh,rotation,mirrored);
        }else{
          drawImage(asset,bounds.x,bounds.y,bounds.w,bounds.h,rotation,mirrored);
        }
        
      },
      getType: function(x,y){
        var tile=this.getTile(x,y);
        if(tile){
          return tile.type;
        }else{
          return null;
        }
      },
      setType: function(x,y,newType){
        var tile=this.getTile(x,y);
        if(tile){
          tile.type=newType
        }
      },
      setInfo: function(x,y,newInfo){
        var tile=this.getTile(x,y);
        if(tile){
          tile.info=newInfo
        }
      },
      getInfo: function(x,y){
        var tile=this.getTile(x,y);
        if(tile){
          return tile.info;
        }else{
          return null;
        }
      }
    };
  
  
    /**Gamepad: */
    $App.Gamepad=function(){
      this.element=null;
      this.multiaxis=true;
      this.buttons={
        A: null, B: null, X: null, Y: null, E: null, F: null
      };
      this.joystick=null;
      this.keycodes={
        left: 37,
        right: 39,
        down: 40,
        up: 38,
        A: 65,
        B: 66,
        E: 69,
        F: 70,
        X: 88,
        Y: 89
      };
      this.physicalButtons={
        buttons: {
          A: {index: 1, down: false},
          B: {index: 0, down: false},
          E: {index: 9, down: false},
          F: {index: 8, down: false},
          X: {index: 2, down: false},
          Y: {index: 3, down: false},
        },
        dirs: {
          left: {axis: 0, low: true, down: false},
          right: {axis: 0, low: false, down: false},
          up: {axis: 1, low: true, down: false},
          down: {axis: 1, low: false, down: false}
        }
      };
      //[{index: 1, name: "A"},{index: 2,name: "B"},{index: 0,name: "X"},{index: 3,name: "Y"},{index: 9,name: "E"},{index:8,name:"F"}];
      this.connectedGamepadIndex=-1;
    };  
    
    $App.Gamepad.prototype={
      resetAllButtons: function(){
        this.updateButtons(false,false,false,false,false,false);
        this.updateJoystickDirection(false,false,false,false);
      },
      updateButtons: function(ADown,BDown,XDown,YDown,EDown,FDown){
        var down={
          A: ADown, B: BDown, X: XDown, Y: YDown, E: EDown, F: FDown
        };
        for(var a in this.buttons){
          var b=this.buttons[a];
          if(b && b.el){
            if(down[a]){
              b.el.style.opacity="0.3";
            }else{
              b.el.style.opacity="0.6";
            }
          }
        }
      },
      updateJoystickDirection: function(leftDown,rightDown,upDown,downDown){
        var dir=undefined;
        if(upDown && !downDown){
          dir="N";
        }
        if(!upDown && downDown){
          dir="S";
        }
        if(!dir || this.multiaxis){
          if(!dir) dir="";
          if(leftDown && !rightDown){
            dir+="W";
          }
          if(!leftDown && rightDown){
            dir+="E";
          }
        }
        if(this.joystick){
          this.joystick.setDir(dir);
        }
      },
      getMappedButton: function(keycode){
        for(var a in this.keycodes){
          if(this.keycodes[a]===keycode){
            return a;
          }
        }
        return null;
      },
      isButtonPressed: function(button){
        if(this.connectedGamepadIndex>=0){
          let buttonState=this.physicalButtons.buttons[button];
          if(buttonState!==undefined){
            return buttonState.down;
          }
          buttonState=this.physicalButtons.dirs[button];
          if(!this.multiaxis && buttonState.axis===0 && (this.physicalButtons.dirs.up.down||this.physicalButtons.dirs.down.down)){
            return false;
          }
          return buttonState.down;
        }else{
          if($App.keyboard.down[this.keycodes[button]]){
            if(!this.multiaxis){
              if(button==="left"||button==="right"){
                if($App.keyboard.down[this.keycodes["Up"]] || $App.keyboard.down[this.keycodes["Down"]]){
                  return false;
                }
              }
            }
            return true;
          }
          var b=this.buttons[button];
          if(b){
            return b.down;
          }
          var x=this.joystick.GetX();
          var y=this.joystick.GetY();
          var threshold=40;
          if(!this.multiaxis){
            /*wenn multiaxis false ist, dann wird nur die beste Richtung gewertet*/
            var bestDir=null;
            var bestDirValue;
            if(Math.abs(x)>Math.abs(y)){
              bestDir=x>0? "right": "left";
              bestDirValue=x;
            }else{
              bestDir=y>0? "up": "down";
              bestDirValue=y;
            }
            return button===bestDir && Math.abs(bestDirValue)>threshold;
          }
          if(button==="left"){
            return (x<-threshold);
          }
          if(button==="right"){
            return (x>threshold);
          }
          if(button==="up"){
            return (y>threshold);
          }
          if(button==="down"){
            return (y<-threshold);
          }
        }
      },
      setButtonKey: function(button,key){
        let b=this.buttons[button];
        if(b){
          if(!key){
            b.el.style.display="none";
            this.keycodes[button]=null;
            return;
          }else{
            b.el.style.display="inline-block";
          }
        }
        if(typeof key==="string"){
          key=key.codePointAt(0);
        }
        this.keycodes[button]=key;
      },
      setVisible: function(v){
        if(v){
          this.create();
        }
        v=v? "inline-block":"none";
        this.joystick.element.style.display=v;
        for(let a in this.buttons){
          if(this.keycodes[a]!==null){
            let b=this.buttons[a];
            b.el.style.display=v;
          }
        }
      },
      connectPhysicalGamepad: function(gp){
        this.connectedGamepadIndex=gp.index;
      },
      disconnectPhysicalGamepad: function(){
        this.connectedGamepadIndex=-1;
      },
      updatePhysicalGamepad: function(){
        if(this.connectedGamepadIndex<0){
          return;
        }
        let gp=navigator.getGamepads()[this.connectedGamepadIndex];
        for(let a in this.physicalButtons.buttons){
          let buttonState=this.physicalButtons.buttons[a];
          let button=gp.buttons[buttonState.index];
          let v;
          if(typeof button==="number"){
            v=button>0.5;
          }else{
            v=button.pressed;
          }
          if(!$App.debug.paused && v && !buttonState.down && window.onGamepadDown){
            try{
              window.onGamepadDown(a);
            }catch(e){
              $App.handleException(e);
            }
          }else if(!$App.debug.paused && !v && buttonState.down && window.onGamepadUp){
            try{
              window.onGamepadUp(a);
            }catch(e){
              $App.handleException(e);
            }
          }
          buttonState.down=v;
        }
        for(let a in this.physicalButtons.dirs){
          let buttonState=this.physicalButtons.dirs[a];
          let axis=gp.axes[buttonState.axis];
          let v;
          if(buttonState.low){
            v=axis<-0.2;
          }else{
            v=axis>0.2;
          }
          if(!$App.debug.paused && v && !buttonState.down && window.onGamepadDown){
            try{
              window.onGamepadDown(a);
            }catch(e){
              $App.handleException(e);
            }
          }else if(!$App.debug.paused && !v && buttonState.down && window.onGamepadUp){
            try{
              window.onGamepadUp(a);
            }catch(e){
              $App.handleException(e);
            }
          }
          buttonState.down=v;
        }
      },
      create: function(){
        if(this.element) return;
        var div=document.createElement("div");
        this.element=div;
        div.style="position: absolute; left: 0.5cm; bottom: 0.5cm; width: 2cm; height: 2cm; z-index: 1000;";
        div.onmouseleave=function(){
    
        };
        $App.body.root.appendChild(div);
        for(var a in this.buttons){
          let b=this.buttons[a];
          b=document.createElement("div");
          b.style="font-family: sans-serif;font-weight:bold;border-radius: 2000px; width: 1cm; height: 1cm; position: absolute; z-index: 10; border: 1pt solid black;text-align: center; line-height: 1cm; user-select: none;cursor: pointer;opacity: 0.6";
          b.className="gamepad-button";
          b.textContent=a;
          this.buttons[a]={
            el: b,
            name: a,
            down: false
          };
          b.button=this.buttons[a];
          b.onmousedown=function(ev){
            if(ev) ev.preventDefault();
            $App.mouse.down=true;
            this.button.down=true;
            this.button.el.style.opacity="0.5";
            if(!$App.debug.paused && window.onGamepadDown){
              try{
                window.onGamepadDown(this.button.name);
              }catch(e){
                $App.handleException(e);
              }
            }
          };
          b.onmouseup=function(ev){
            if(ev) ev.preventDefault();
            $App.mouse.down=false;
            this.button.down=false;
            this.button.el.style.opacity="1";
            if(!$App.debug.paused && window.onGamepadUp){
              try{
                window.onGamepadUp(this.button.name);
              }catch(e){
                $App.handleException(e);
              }
            }
          };
          b.addEventListener("touchstart",b.onmousedown);
          b.addEventListener("touchend",b.onmouseup);
          b.onmouseover=function(ev){
            if(ev) ev.preventDefault();
            if($App.mouse.down){
              this.onmousedown();
            }
          },
          b.onmouseout=function(ev){
            if(ev) ev.preventDefault();
            if(this.button.down){
              this.button.down=false;
              this.button.el.style.opacity="1";
              if(!$App.debug.paused && window.onGamepadUp){
                try{
                  window.onGamepadUp(this.button.name);
                }catch(e){
                  $App.handleException(e);
                }
              }
            }
          };
          document.body.addEventListener('touchmove', (ev)=>{
            for(let i=0;i<ev.touches.length;i++){
              var touch = ev.touches[i];
              var touches=b===document.elementFromPoint(touch.pageX,touch.pageY);
              if(touches) break; 
            }
            if(b.button.down){
              if(!touches){
                b.onmouseout();
              }
            }else{
              if(touches){
                b.onmousedown();
              }
            }
          }, false);
          $App.body.root.appendChild(b);
        }
        this.joystick=new $App.$JoyStick(div,function(){
          if(!$App.debug.paused && window.onGamepadDown){
            try{
              window.onGamepadDown(null);
            }catch(e){
              $App.handleException(e);
            }
          }
        }, function(){
          if(!$App.debug.paused && window.onGamepadUp){
            try{
              window.onGamepadUp(null);
            }catch(e){
              $App.handleException(e);
            }
          }
        });
        this.joystick.element=div;
        this.buttons.A.el.style.right="0.1cm";
        this.buttons.A.el.style.bottom="0.75cm";
        this.buttons.A.el.style.backgroundColor="red";
        this.buttons.B.el.style.right="1.25cm";
        this.buttons.B.el.style.bottom="0.5cm";
        this.buttons.B.el.style.backgroundColor="yellow";
        this.buttons.X.el.style.right="0.1cm";
        this.buttons.X.el.style.bottom="2cm";
        this.buttons.X.el.style.backgroundColor="blue";
        this.buttons.X.el.style.color="white";
        this.buttons.Y.el.style.right="1.25cm";
        this.buttons.Y.el.style.bottom="1.75cm";
        this.buttons.Y.el.style.backgroundColor="lime";
        this.buttons.E.el.style.right="0.1cm";
        this.buttons.E.el.style.bottom="3.25cm";
        this.buttons.E.el.style.backgroundColor="magenta";
        this.buttons.F.el.style.right="1.25cm";
        this.buttons.F.el.style.bottom="3cm";
        this.buttons.F.el.style.backgroundColor="cyan";
      }
    }
    $App.gamepad=new $App.Gamepad()
    
    /*****Array */
    $App.Array=function(type, dim, values){
      if(typeof type==="string"){
        this.type=type;
      }else{
        this.type=type.name;
      }
      if(Array.isArray(dim)){
        this.dim=dim;
        this.values=$App.Array.createArrayValues(type,dim,0);
      }else{
        this.values=values;
        var a=values;
        this.dim=[];
        while(a && Array.isArray(a)){
          this.dim.push(a.length);
          a=a[0];
        }
      }
    };
  
    $App.Array.prototype={
      toString: function(){
        //return this.type+"-Array["+this.dim.join("][")+"]: "+this.values.join(", ");
        return "{"+this.values.join(", ")+"}";
      },
      get length(){
        return this.dim[0];
      },
      checkBounds: function(index){
        if(index>=this.length || index<0){
          var m="Index "+index+" liegt ausserhalb der Array-Grenzen von 0 bis "+(this.length-1);
          console.error(m);
          throw m;
        }
        return this;
      },
      get: function(index){
        this.checkBounds(index);
        return this.values[index];//this.privateGet(index,this.values,0);
      },
      set: function(index,value){
        this.checkBounds(index);
        this.values[index]=value;
      }
    };
  
    $App.Array.createArrayValues=function(type,dim){
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
  
    /**Toast */
    $App.Toast=function(container){
      this.container=container;
    };
    
    $App.Toast.prototype={
      show: function(text,pos,duration){
        let element=document.createElement("span");
        element.style="color: white; background-color: #121212; transition: opacity 1s; padding: 0.5rem; border-radius: 10px; opacity: 0; text-align: center; z-index: 1000;";
        if(!duration){
          duration=Math.min(Math.max(1500,text.length*200),15000);
        }
        element.innerHTML=text;
        if(!pos){
          pos="center";
        }
        if(pos.indexOf("left")>=0){
          element.style.justifySelf="start";
          element.style.gridColumn="1 / 2";
        }else if(pos.indexOf("right")>=0){
          element.style.justifySelf="end";
          element.style.gridColumn="3 / 4";
        }else{
          element.style.justifySelf="center";
          element.style.gridColumn="2 / 3";
        }
        if(pos.indexOf("top")>=0){
          element.style.alignSelf="start";
          element.style.gridRow="1 / 2";
        }else if(pos.indexOf("bottom")>=0){
          element.style.alignSelf="end";
          element.style.gridRow="3 / 4";
        }else{
          element.style.alignSelf="center";
          element.style.gridRow="2 / 3";
        }
        this.container.appendChild(element);
        setTimeout(()=>{
          element.style.opacity="1";
          setTimeout(()=>{
            element.style.opacity="0";
            setTimeout(()=>{
              this.container.removeChild(element);
            },1000);
          },duration);
        },10);
        
      },
    };
    
    
    
    
    
    /**Console */
    $App.Console=function(){
      this.element=document.createElement("div");
      this.element.onclick=()=>{
        if(!this.readInput) return;
        this.readInput.focus();
      };
      this.element.style="overscroll-behavior: none; width: 100%; height: 100%; background-color: #222222; color: white";
      this.element.className="console";
      this.items={};
      this.localItems={};
      this.watchedVariables=[];
      this.visible=false;
      this.variablesDiv=document.createElement("div");
      this.variablesDiv.style="height: calc(70% - 0.4cm); overflow: auto";
      this.element.appendChild(this.variablesDiv);
      this.outputDiv=document.createElement("div");
      this.outputDiv.style="height: calc(30% - 0.4cm); overflow: auto";
      this.element.appendChild(this.outputDiv);
      this.input=document.createElement("input");
      this.input.style="width: 100%; height: 0.8cm; background-color: #222222; outline: none;border: none; color: white; box-sizing: border-box;";
      this.input.currentPosition=-1;
      this.input.spellcheck=false;
      this.input.autocapitalize="none";
      this.input.autocorrect="off";
      this.input.placeholder="gib einen Befehl ein...";
      this.input.onchange=async ()=>{
        var v=this.input.value;
        if(v.trim().length===0) return;
        if(!(this.history.length>0 && this.history[this.history.length-1]===v)){
          this.history.push(v);
          this.saveHistory();
        }
        //var w;
        let func;
        if(window.$main){
          func="with($main){return "+v+";}";
          //eval("with($main){w="+v+"}");
        }else{
          func="return "+v+";";
          //eval("w="+v);
        }
        func=Function("return (async function anonym(){"+func+"}());");
        var w=await func();
        console.log(">",v);
        if(w!==undefined){
          console.log("<",w);
        }
        this.input.value="";
        this.input.currentPosition=-1;
      };
      this.input.onkeydown=(ev)=>{
        ev.stopPropagation();
        if(ev.keyCode===40 || ev.keyCode===38 || ev.keyCode===13){
          if(ev.keyCode===13){
            this.input.onchange();
          }else if(ev.keyCode===38){
            
            if(this.input.currentPosition<this.history.length-1){
              this.input.currentPosition++;
            }
          }else if(ev.keyCode===40){
            if(this.input.currentPosition>=0){
              this.input.currentPosition--;
            }
          }
          if(this.input.currentPosition>=0){
            this.input.value=this.history[this.history.length-this.input.currentPosition-1];
          }else{
            this.input.value="";
          }
        }
      };
      this.element.appendChild(this.input);
      this.localVariables=null;
      this.loadHistory();
      this.currentLineDiv=document.createElement("div");
      this.currentLineDiv.style.whiteSpace="pre";
      this.outputDiv.appendChild(this.currentLineDiv);
    };
    
    $App.Console.prototype={
      saveHistory: function(){
        if(this.history.length>100){
          this.history.splice(0,this.history.length-100);
        }
        localStorage.setItem("appjs-console-history",JSON.stringify(this.history));
      },
      loadHistory: function(){
        this.history=[];
        var h=localStorage.getItem("appjs-console-history");
        if(h){
          try{
            h=JSON.parse(h);
            if(h && h.splice && h.length>0){

              this.history=h;
            }
          }catch(e){

          }
        }
      },
      addWatchedVariables: function(arrayWithVarNames){
        this.watchedVariables=this.watchedVariables.concat(arrayWithVarNames);
      },
      /**println */
      log: function(){
        let div=this.currentLineDiv;
        div.style.whiteSpace="pre";
        let args=[]
        for(let i=0;i<arguments.length;i++){
          let obj=arguments[i];
          let item;
          if(typeof obj==="object"){
            item=$App.console.createConsoleItem(null,false,true);
            item.update(obj);
            item=item.element;
          }else{
            item=document.createElement("span");
            //item.style.marginRight="1em";
            item.innerHTML=obj;
          }
          div.appendChild(item);
        }
        this.currentLineDiv=document.createElement("div");
        this.currentLineDiv.style.whiteSpace="pre";
        this.outputDiv.appendChild(this.currentLineDiv);
        //this.outputDiv.appendChild(div);
        this.outputDiv.scrollTop=this.outputDiv.scrollHeight;
        this.outputDiv.scrollLeft=0;
      },
      print: function(){
        let div=this.currentLineDiv;
        for(let i=0;i<arguments.length;i++){
          let obj=arguments[i];
          let item;
          if(typeof obj==="object"){
            item=$App.console.createConsoleItem(null,false,true);
            item.update(obj);
            item=item.element;
          }else{
            item=document.createElement("span");
            //item.style.marginRight="1em";
            item.innerHTML=obj;
          }
          div.appendChild(item);
        }
        //this.outputDiv.appendChild(div);
        this.outputDiv.scrollTop=this.outputDiv.scrollHeight;
        this.outputDiv.scrollLeft=0;
      },
      readLine: async function(prompt){
        if(prompt) this.print(prompt);
        let inp=document.createElement("input");
        this.readInput=inp;
        inp.type="text";
        inp.style="width: 2em; height: 0.8cm; background-color: #222222; outline: none;border: none; color: white; box-sizing: border-box;font-family: monospace; padding: 0; margin: 0;";
        inp.currentPosition=-1;
        inp.spellcheck=false;
        inp.autocapitalize="none";
        inp.autocorrect="off";
        this.currentLineDiv.appendChild(inp);
        setTimeout(()=>{
          inp.focus();
        },10);
        inp.oninput=function(){
          this.style.width=this.value.length+2+"em";
        };
        inp.onchange=function(){
          this.disabled=true;
          this.resolve(this.value);
        };
        let p=new Promise((resolve,reject)=>{
          inp.resolve=resolve;
        });
        let q=await p;
        this.currentLineDiv=document.createElement("div");
        this.currentLineDiv.style.whiteSpace="pre";
        this.outputDiv.appendChild(this.currentLineDiv);
        this.outputDiv.scrollTop=this.outputDiv.scrollHeight;
        this.outputDiv.scrollLeft=0;
        return q;
      },
      clear: function(){
        this.element.removeChild(this.outputDiv);
        this.outputDiv=document.createElement("div");
        this.outputDiv.style="height: calc(30% - 0.4cm); overflow: auto";
        this.element.insertBefore(this.outputDiv,this.input);
      },
      update: function(sharedVariables){
        if($App.language==="js"){
          this.updateFromObject(window,sharedVariables);
        }else if($App.language==="java"){
          this.updateFromObject($App.debug.object? $App.debug.object : $main,sharedVariables);
        }
        if(window.parent!==window && sharedVariables){
          window.parent.postMessage({
            type: "update-shared-variables",
            sharedVariables: sharedVariables
          },"*");
        }
      },
      updateLocalVariables: function(variables){
        this.localVariables=variables;
        //console.log(variables);
      },
      createConsoleItem: function(name,local,valueOnly){
        let item={
          local: local===true,
          valueOnly,
          expanded: false,
          element: document.createElement("div"),
          value: document.createElement("span"),
          button: document.createElement("span"),
          line: document.createElement("div"),
          expandable: false,
          subItems: {},
          hasSubItems: false,
          sublist: document.createElement("div"),
          object: undefined
        };
        item.element.style.whiteSpace="noWrap";
        item.value.style.whiteSpace="pre";
        item.sublist.style.marginLeft="1em";
        item.button.style="text-align: center; display: inline-block; width: 1em; border-radius: 3px";
        item.element.appendChild(item.line);
        item.line.appendChild(item.button);
        var el=document.createElement("span");
        el.style.whiteSpace="pre";
        if(!valueOnly){
          el.textContent=name+": ";
        }
        item.line.appendChild(el);
        item.line.appendChild(item.value);
        item.line.onclick=()=>{
          if(item.expandable){
            item.expanded=!item.expanded;
            if(item.valueOnly){
              item.update(item.object);
            }
          }
        };
        item.element.appendChild(item.sublist);
        item.updateSublist=function(){
          if(!this.expanded){
            this.sublist.style.display="none";
          }else{
            var newItems={};
            var hasNewItems=false;
            for(var a in this.object){
              var item;
              var obj=this.object[a];
              if(a.startsWith("$")||typeof obj==="function" || obj && obj.$hideFromConsole){
                continue;
              }
              if(this.hasSubItems && (a in this.subItems)){
                item=this.subItems[a];
              }else{
                item=$App.console.createConsoleItem(a);
                item.valueOnly=this.valueOnly;
                item.object=obj;
                this.sublist.appendChild(item.element);
              }
              item.update(obj);
              newItems[a]=item;
              hasNewItems=true;
            }
            this.sublist.style.display="";
            for(var a in this.subItems){
              if(!(a in newItems)){
                this.sublist.removeChild(this.subItems[a].element);
              }
            }
            this.subItems=newItems;
            this.hasSubItems=hasNewItems;
          }
        };
        item.update=function(obj){
          if(this.local && !$App.debug.paused){
            this.element.style.display="none";
            return;
          }else{
            this.element.style.display="";
          }
          var v;
          this.object=obj;
          if(obj===undefined){
            v="undefiniert";
          }else if(obj===null){
            v="null";
          }else if(obj instanceof $Char){
            v="'"+obj.char+"' ["+obj.int+"]";
          }else if(typeof obj==="object"){
            this.button.style.backgroundColor="gray";
            this.button.textContent=this.expanded? "-": "+";
            this.expandable=true;
            item.line.style.cursor="pointer";
            if(Array.isArray(obj)&& obj.$type){
              v=obj.$type+"["+obj.length+"]";
              this.object=obj;
            }else if(Array.isArray(obj)){
              v="Array ("+obj.length+")";
            }else{
              if(obj.constructor){
                v=obj.constructor.name;
              }else{
                v="Objekt";
              }
            }
          }else{
            item.line.style.cursor="";
            this.button.style.backgroundColor="";
            this.button.textContent="";
            this.expandable=false;
            v=JSON.stringify(obj);
          }
          this.value.textContent=v;
          this.updateSublist();
        }
        return item;
      },
      updateFromObject: function(source,sharedVariables){
        if(!source) return;
        let newItems={};
        for(let a in source){
          if(source===window && !(this.watchedVariables.indexOf(a)>=0) && (a in $App.systemVariables)){
            continue;
          }
          try{
            let obj=source[a];
            if(obj && (obj.$hideFromConsole || a.startsWith("$"))){
              continue;
            }
            if(obj===window){
              continue;
            }
            if(typeof obj==="function"){
              continue;
            }
            if(sharedVariables){
              if(a in sharedVariables){
                sharedVariables[a]=obj;
                break;
              }
            } 
            let item;
            if(a in this.items){
              item=this.items[a];
            }else{
              item=this.createConsoleItem(a)
              this.variablesDiv.appendChild(item.element);
            }
            item.update(obj);
            newItems[a]=item;
          }catch(e){}
        }
        for(let a in this.items){
          if(!(a in newItems)){
            this.variablesDiv.removeChild(this.items[a].element);
          }
        }
        this.items=newItems;
        
        newItems={};
        if(this.localVariables){
          for(let a in this.localVariables){
            let obj=this.localVariables[a];
            if(obj && obj.$hideFromConsole){
              continue;
            }
            if(obj===window){
              continue;
            }
            if(typeof obj==="function"){
              continue;
            }
            let item;
            if(a in this.localItems){
              item=this.localItems[a];
            }else{
              item=this.createConsoleItem(a,true)
              this.variablesDiv.appendChild(item.element);
            }
            item.update(obj);
            newItems[a]=item;
          }
        }
        for(let a in this.localItems){
          if(!(a in newItems)){
            this.variablesDiv.removeChild(this.localItems[a].element);
          }
        }
        this.localItems=newItems;
      },
      show: function(){
        this.setVisible(true);
      },
      hide: function(){
        this.setVisible(false);
      },
      setVisible: function(v){
        this.visible=v;
        let parent=this.element.parentElement;
        if(parent){
          parent.style.display=v? "block": "none";
          let right=parent.nextElementSibling;
          if(right.$canvas.isEmpty()){
            right.style.width="0%";
            parent.style.width="100%";
          }else{
            parent.style.width="30%";
            if(v){
              right.style.width="70%";
            }else{
              right.style.width="100%";
            }
          }
          
          setTimeout(function(){
            $App.onResize(true);
          },10);
        }
        
        
      }
    };
    
    $App.console=new $App.Console();
    setInterval(function(){
      this.$App.console.update($App.$sharedVariables);
    },200);
    
    $App.loadEruda=function(){
      var script = document.createElement('script'); 
      script.src="https://cdn.jsdelivr.net/npm/eruda"; 
      document.body.append(script); 
      script.onload = function () { 
        eruda.init(); 
      };
    }

    /**Help */
    $App.Help=function(){
      this.element=document.createElement("div");
      this.functions=[];
      this.objects=[];
      this.eventHandlers=[];
      this.element.style="overflow-x: hidden; overflow-y: auto;tab-size: 2; padding: 0.5em;background-color: white;position: absolute; left: 0; right: 0; top: 0; bottom: 0; z-index: 100";
      this.element.innerHTML="<h1>Willkommen bei AppJS</h1>"
      +"\n<p>Version "+$App.version+"</p>"
      +"\n<p>Mit AppJS kannst du deine eigenen Apps in der Sprache JavaScript programmieren. AppJS stellt dir einige zusaetzliche Befehle zur Verfuegung, die dir das Leben etwas einfacher machen.</p>"
      +"\n<p><a href=\"https://thomaskl.uber.space/Webapps/AppJS/help.html\" target=\"_blank\">Link zu dieser Hilfe</a></p>"
      +"\n<h2>Grundaufbau einer App</h2>"
      +"\n<details><summary>Eine App mit AppJS sollte folgendermassen aussehen:</summary>"
      +"\n<p><code><pre>&lt;script src=\"https://thomaskl.uber.space/Webapps/AppJS/app.js\"&gt;&lt;/script&gt;"
    +"\n&lt;script&gt;"
    +"\n"
    +"\nsetupApp(\"Name meiner App\", \"ðŸ˜€\", 100, 100, \"blue\");"
    +"\n"
    +"\nfunction onStart(){"
    +"\n  drawCircle(50,50,10);"
    +"\n}"
    +"\n"
    +"\n&lt;/script&gt;</pre></code></p>"
      +"\n</details>";
      let closeButton=document.createElement("button");
      closeButton.innerHTML="&times;"
      closeButton.style="font-size: 150%; position: fixed; right: 0.5rem; top: 0.5rem; border-radius: 2px";
      this.element.appendChild(closeButton);
      closeButton.onclick=()=>{
        this.setVisible(false);
      };
      this.helpButton=document.createElement("button");
      this.helpButton.textContent="?"
      this.helpButton.style="font-size: 150%; opacity: 0.5; position: absolute; right: 0.5rem; top: 0.5rem; border-radius: 2px";
      this.helpButton.onclick=()=>{
        this.setVisible(true);
      };
      this.setVisible(false);
    }
    
    $App.Help.prototype={
      printInfos: function(){
        console.log(this.getInfos());
      },
      getInfos: function(){
        return JSON.stringify({
          functions: this.functions,
          objects: this.objects,
          eventHandlers: this.eventHandlers
        });
      },
      addFunction: function(funcInfo){
        // name: name,
        // args: args,
        // info: info,
        // details: details,
        // isNative: isNative
        funcInfo.getAutocompleteSnippet=function(){
    
        }
        this.functions.push(funcInfo);
      },
      addObject: function(name,info,members,details,level){
        this.objects.push({
          name: name,
          info: info,
          members: members,
          details: details,
          level: level
        });
      },
      addEventHandler: function(name,args,info,details){
        this.eventHandlers.push({
          name: name,
          args: args,
          info: info,
          details: details
        });
      },
      setVisible: function(v){
        this.element.style.display=v? "":"none";
      },
      setButtonVisible: function(v){
        this.helpButton.style.display=v? "":"none";
      },
      compileScreen: function(){
        this.functions.sort(function(a,b){
          if(a.name>b.name){
            return 1;
          }else{
            return -1;
          }
        });
        let el;
    
        el=document.createElement('div');
        el.innerHTML='<h2 style="border-bottom: 1pt solid black">Ereignis-Routinen</h2><p>Eine Ereignis-Routine ist eine Funktion, die aufgerufen wird, wenn ein bestimmtes Ereignis eintritt. Fuege deinem Programm diese Funktionen hinzu, um auf verschiedenste Ereignisse (Programmstart, Druck auf einen Button des Gamepad, Mausklick usw.) zu reagieren.</p>';
        this.element.appendChild(el);
        for(let i=0;i<this.eventHandlers.length;i++){
          let e=this.eventHandlers[i];
          let div=document.createElement("div");
          let a=[];
          for(let j=0;j<e.args.length;j++){
            a.push(e.args[j].name);
          }
          let code="<details><summary style='background-color: orange;margin-bottom:0.5rem;font-size: 150%' id='help-"+e.name+"'><code>function "+e.name+"("+a.join(", ")+"){...}</code></h2></summary>"+e.info;
          if(e.args.length>0){
            code+="<ul>";
            for(let j=0;j<e.args.length;j++){
              let a=e.args[j];
              code+="<li><code>"+a.name+"</code>: "+a.info+"</li>"
            }
            code+="</ul>";
          }
          if(e.details){
            code+="<p>"+e.details+"</p>"
          }
          "</details>";
          div.innerHTML=code;
          this.element.appendChild(div);
        }
    
        el=document.createElement('div');
        el.innerHTML='<h2 style="border-bottom: 1pt solid black">Funktionen</h2><p>Die folgenden Funktionen kannst du in deinen Programmen verwenden.</p>';
        this.element.appendChild(el);
        for(let i=0;i<this.functions.length;i++){
          let f=this.functions[i];
          let div=document.createElement("div");
          let a=[];
          for(let j=0;j<f.args.length;j++){
            a.push(f.args[j].name);
          }
          let code="<details><summary style='background-color: cyan;margin-bottom:0.5rem;font-size: 150%' id='help-"+f.name+"'><code>"+f.name+"("+a.join(", ")+")</code></h2></summary>"+f.info;
          if(f.args.length>0){
            code+="<ul>";
            for(let j=0;j<f.args.length;j++){
              let a=f.args[j];
              code+="<li><code>"+a.name+"</code>: "+a.info+"</li>"
            }
            code+="</ul>";
          }
          if(f.details){
            code+="<p>"+f.details+"</p>"
          }
          if(f.isNative){
            code+="<p style='font-style: italic; font-size: small'>Dies ist eine normale Funktion von JavaScript, die auch ohne AppJS benutzt werden kann.</p>"
          }
          "</details>";
          div.innerHTML=code;
          this.element.appendChild(div);
        }
         
        el=document.createElement('div');
        el.innerHTML='<h2 style="border-bottom: 1pt solid black">Objekte</h2><p>Ein Objekt buendelt eine Reihe von zusammengehoerigen Funktionen und Eigenschaften. Zur Verwendung musst du immer <code>objekt.eigenschaft</code> schreiben, also z. B. <code>mouse.x</code>.</p>';
        this.element.appendChild(el);
        for(let i=0;i<this.objects.length;i++){
          let o=this.objects[i];
          let div=document.createElement("div");
          let code="<details><summary style='background-color: lime;margin-bottom:0.5rem;font-size: 150%' id='help-"+o.name+"'><code>"+o.name+"</code></summary>"+o.info+"<ul>";
          for(let j=0;j<o.members.length;j++){
            let m=o.members[j];
            code+='<li><code>'+o.name+'.'+m.name+'</code>: '+m.info+'</li>'
          }
          code+="</ul>";
          if(o.details){
            code+="<p>"+o.details+"</p>"
          }
          "</details>";
          div.innerHTML=code;
          this.element.appendChild(div);
        }
      }
    };
    
    $App.help=new $App.Help();
    if($App.language==="java"){
      $App.help.setButtonVisible(false);
    }
    
    $App.addFunction=function addFunction(func,returnType,info,args,details,level){
      let name,isNative;
      if(typeof func==="string"){
        //native Funktion
        name=func;
        isNative=true;
      }else{
        window[func.name]=func;
        name=func.name;
        isNative=false;
      }
      this.help.addFunction({
        name: name,
        returnType: returnType,
        args: args,
        info: info,
        details: details,
        isNative: isNative,
        level: level
      });
    };
    
    $App.addObject=function addObject(name,addMembers,data,info,members,details,level){
      if(addMembers && window[name]){
        let obj=window[name];
        for(let a in data){
          obj[a]=data[a];
        }
      }else{
        window[name]=data;
      }
      this.help.addObject(name,info,members,details,level);
    };
    
    $App.addEventHandler=function addEventHandler(name,args,info,details){
      this.help.addEventHandler(name,args,info,details);
    };
    
    
    Session=function(sessionID, clientID, isHost, debug){
      this.sessionID=sessionID;
      this.handler=window;
      this.startDialog=document.createElement("div");
      this.startDialog.style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;background-color: #aaaa";

      this.clientID=clientID;
      this.isHost=isHost;
      this.debug=debug;
      this.peerID=this.getPeerID();
      if(this.isHost){
        this.log("starte session als host",sessionID,clientID,this.peerID);
        this.connectionsToClients={};
        this.newConnectionsToClients={};
        this.peer=new Peer(this.peerID,{debug:0});
      }else{
        this.log("starte session als client",sessionID,clientID,this.peerID);
        this.peer=new Peer(undefined,{debug:0});
      }
    
      this.peer.on('open',()=>{
        this.log("peer ist open");
        if(this.isHost){
          if(this.handler.onSessionStart){
            this.handler.onSessionStart(true);
          }
        }else{
          this.log("Baue Verbindung zum Server auf...");
          this.connectionToServer=this.peer.connect(this.peerID);
          this.connectionToServer.on('open',()=>{
            this.log("client hat verbindung zum server");
            this.log("sende gruss an host",this.clientID,this.peer.id);
            this.connectionToServer.send({type: "new-connection", clientID: this.clientID, peerID: this.peer.id});
            if(this.handler.onSessionStart){
              this.handler.onSessionStart(false);
            }
          });
          this.connectionToServer.on('data',(data)=>{
            /**client empfaengt nachricht */
            this.log("client empfaengt nachricht",data);
            if(data.type==="client-id-of-server"){
              this.log("client empfaengt id des servers",data.clientID);
              if(this.handler.onNewConnection){
                this.handler.onNewConnection(data.clientID);
                for(var id of data.allRealClientIDs){
                  if(id!==this.clientID){
                    this.handler.onNewConnection(id);
                  }
                }
              }
            }else if(data.type==="message"){
              if(this.handler.onMessage){
                this.handler.onMessage(data.sender,data.message);
              }
            }else if(data.type==="new-connection"){
              this.log("client empfaengt neue Verbindung",data.clientID)
              if(this.handler.onNewConnection){
                this.handler.onNewConnection(data.clientID);
              }
            }
          })
        }
      });
    
      this.peer.on('error',(error)=>{
        this.log("error",error);
        if(this.handler.onSessionError){
          this.handler.onSessionError(error);
        }
      });
    
      this.peer.on('connection',(dataConnection)=>{
        this.log("neue Connection");
        if(this.isHost){
          this.log("neuer Client",dataConnection);
          this.newConnectionsToClients[dataConnection.peer]=dataConnection;
        }
    
        dataConnection.on('open',()=>{
          this.log("data connection ist offen");
          if(!this.isHost){
            
          }
        });
    
        dataConnection.on('data',(data)=>{
          if(this.isHost){
            /**Server empfaengt nachricht */
            this.log("server empfaengt nachricht",data);
            if(data.type==="new-connection"){
              var con=this.newConnectionsToClients[data.peerID];
              if(con){
                this.connectionsToClients[data.clientID]=con;
                this.connectionsToClients[data.clientID].send({type: "client-id-of-server", clientID: this.clientID, allRealClientIDs: this.getAllClientIDs()});
                if(this.handler.onNewConnection){
                  this.handler.onNewConnection(data.clientID);
                }
                this.forward(data.clientID,{type: "new-connection", clientID: data.clientID});
              }
              delete this.newConnectionsToClients[data.peerID];
            }else if(data.type==="message"){
              this.forward(data.sender,data);
              if(this.handler.onMessage){
                this.handler.onMessage(data.sender,data.message);
              }
            }
          }
        });
        // if(this.handler.onNewConnection){
        //   this.handler.onNewConnection(error);
        // }
      });
    
      
    };
    
    Session.prototype={
      log: function(){
        if(this.debug){
          console.log.apply(console,arguments);
        }
      },
      getAllClientIDs: function(){
        var ids=[];
        for(var a in this.connectionsToClients){
          ids.push(a);
        }
        return ids;
      },
      forward: function(sender,data){
        for(var a in this.connectionsToClients){
          if(a!==sender){
            this.log("forwarding to",a);
            var c=this.connectionsToClients[a];
            c.send(data);
          }
        }
      },
      destroy: function(){
        if(this.peer){
          this.peer.destroy();
        }
      },
      getPeerID: function(){
        var loc=location.toString();
        loc=loc.replace(/\W/g,"");
        return loc+"-"+this.sessionID;
      },
      sendMessage: function(message,recipients){
        if(!window.Peer){
          var m="Du musst zuerst PeerJS laden (mittels loadPeerJS()), bevor du Nachrichten über das Netzwerk versenden kannst.";
          console.log(m);
          throw m;
        }
        if(this.isHost){
          this.forward(this.clientID,{sender: this.clientID, type: "message", message});
        }else{
          this.connectionToServer.send({sender: this.clientID, type: "message", recipients, message});
        }
      }
    };
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /**API */
    
    $App.addEventHandler("onStart",[],'Wird einmalig ausgefuehrt, wenn das Programm startet.','');
    $App.addEventHandler("onResize",[],'Wird ausgefuehrt, wenn sich die Abmessungen des Bildschirms veraendern, z. B. wenn das Fenster kleiner oder groesser gemacht wird.','');
    $App.addEventHandler("onTileDraw",[
      {name: 'x', type: 'double', info: 'x-Koordinate des Mittelpunkts des Feldes.'},
      {name: 'y', type: 'double', info: 'y-Koordinate des Mittelpunkts des Feldes.'},
      {name: 'type', type: 'String', info: 'Typ des Feldes (das Zeichen).'},
      {name: 'info', type: 'String', info: 'Information des Feldes.'},
    ],'Wird fuer jedes Feld der Spielwelt ausgefuehrt, wenn diese gezeichnet wird.','');
    $App.addEventHandler("onNextFrame",[],'Wird ca. 60 mal pro Sekunde ausgefuehrt.','');
    $App.addEventHandler("onKeyDown",[{name: 'keycode', type: 'int', info: 'Der Code der gedrueckten Taste, z. B. 65 fuer "A" oder 32 fuer die Leertaste.'}],'Wird ausgefuehrt, wenn eine Taste auf der Tastatur gedrueckt wird. ACHTUNG: Funktioniert nicht bei Geraeten ohne Tastatur! Verwende lieber das <a href="#help-gamepad">Gamepad</a>.','');
    $App.addEventHandler("onKeyUp",[{name: 'keycode', type: 'int', info: 'Der Code der losgelassenen Taste, z. B. 65 fuer "A" oder 32 fuer die Leertaste.'}],'Wird ausgefuehrt, wenn eine Taste auf der Tastatur losgelassen wird. ACHTUNG: Funktioniert nicht bei Geraeten ohne Tastatur! Verwende lieber das <a href="#help-gamepad">Gamepad</a>.','');
    $App.addEventHandler("onMouseDown",[{name: "mx", type: "double", info: "x-Koordinate der Maus"},{name: "my", type: "double", info: "y-Koordinate der Maus"}, {name: "canvas", type: "Canvas", info: "Canvas, der das Ereignis ausgelöst hat."}],'Wird ausgefuehrt, wenn der Benutzer eine Maustaste drueckt oder mit dem Finger den Touchscreen beruehrt.','');
    $App.addEventHandler("onMouseMove",[{name: "mx", type: "double", info: "x-Koordinate der Maus"},{name: "my", type: "double", info: "y-Koordinate der Maus"}, {name: "isDown", type: "boolean", info: "true, wenn die Maus-Taste gedrückt ist, andernfalls false."}, {name: "canvas", type: "Canvas", info: "Canvas, der das Ereignis ausgelöst hat."}],'Wird ausgefuehrt, wenn der Benutzer die Maus bewegt oder mit dem Finger ueber den Touchscreen streicht.','');
    $App.addEventHandler("onMouseUp",[{name: "mx", type: "double", info: "x-Koordinate der Maus"},{name: "my", type: "double", info: "y-Koordinate der Maus"}, {name: "canvas", type: "Canvas", info: "Canvas, der das Ereignis ausgelöst hat."}],'Wird ausgefuehrt, wenn der Benutzer die Maustaste loslaesst oder die Beruehrung des Touchscreens mit dem Finger beendet.','');
    $App.addEventHandler("onGamepadDown",[{name: 'button', type: 'String', info: 'Der Name des Buttons, der gedrueckt wurde, also z. B. "A" oder "Y" oder "left".'}],'Wird ausgefuehrt, wenn der Benutzer einen Teil des Gamepads beruehrt oder die zugeordnete Taste auf der Tastatur drueckt.','');
    $App.addEventHandler("onGamepadUp",[{name: 'button', type: 'String', info: 'Der Name des Buttons, der losgelassen wurde, also z. B. "A" oder "Y" oder "left".'}],'Wird ausgefuehrt, wenn der Benutzer die Beruehrung des Gamepads beendet oder aufhoert, die zugeordnete Taste auf der Tastatur zu druecken.','');
    $App.addEventHandler("onTimeout",[{name: 'name',type: 'String', info: 'Der Name des Timers, der abgelaufen ist.'}],'Wird ausgefuehrt, wenn ein Timer ablaeuft. Du kannst mit time.start einen Timer starten.','');
    $App.addEventHandler("onAction",[{name: 'trigger', type: 'JComponent', info: 'Das Element, das das Ereignis ausgeloest hat.'}],'Wird ausgefuehrt, wenn der User mit einem UI-Element interagiert (z. B. auf einen Button klickt).','');
    $App.addEventHandler("onSessionStart",[{name: 'isServer', type: 'boolean', info: 'true, wenn die Session als Server gestartet wurde, ansonsten false.'}],'Wird ausgefuehrt, wenn eine Netzwerk-Session gestartet wird - egal ob als Server oder als Client.','');
    $App.addEventHandler("onNewConnection",[{name: 'id', type: 'String', info: 'Die ID der neuen Verbindung.'}],'Wird ausgefuehrt, wenn eine neue Verbindung über das Netzwerk hergestellt wird.','');
    $App.addEventHandler("onMessage",[{name: 'senderID', type: "String", info: 'ID des Senders'}, {name: 'message', type: "String", info: 'Nachricht, die empfangen wird'}],'Wird ausgefuehrt, wenn die App eine Nachricht von einem anderen Client oder dem Server erhaelt.','');
    $App.addEventHandler("onSessionError",[{name: 'error', type: "JSON", info: 'Informationen zum Fehler, der aufgetreten ist'}],'Wird ausgefuehrt, wenn ein Netzwerk-Fehler auftritt, also wenn z. B. die Verbindung unterbrochen wird.','');

    $App.addFunction(function setupApp(title,favicon,width,height,backgroundColor){
      $App.setupApp(title,favicon,width,height,backgroundColor);
    },
    null,
    "Legt die Grundeigenschaften der App fest: Den Titel, das Icon, die Breite und die Hoehe sowie die Hintergrundfarbe.",
    [{name: 'title', type: 'String', info: 'Der Name der App, der im Browser-Tab angezeigt wird.'}, {name: 'favicon', type: 'String', info: 'Ein beliebiges Unicode-Symbol, das als Icon fuer die App verwendet wird. Du findest viele Unicode-Symbole, wenn du direkt nach z. B. "unicode drache" googelst oder unter <a href="https://www.compart.com/de/unicode/" target="_blank">compart.com/de/unicode</a>.'}, {name: 'width', type: 'int', info: 'Die Breite der App.'}, {name: 'height', type: 'int', info: 'Die Hoehe der App.'}, {name: 'backgroundColor', type: 'String', info: 'Die Hintergrundfarbe der App.'}],
    'Verwende diesen Befehl zu Beginn der <code>onStart</code>-Funktion.<code><pre>onStart(){\n\tsetupApp("Meine App","ðŸš€",100,100,"black");\n\t//weitere Befehle\n}</pre></code><p></p>',
    true);
    
    $App.addFunction(function distance(x1,y1,x2,y2){
      return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    },'double','Berechnet den Abstand der beiden Punkte (<code>x1</code>|<code>y1</code>) und (<code>x2</code>|<code>y2</code>) mit Hilfe des Satz des Pythagoras.',[{name: 'x1', type: 'double', info: 'x-Koordinate des ersten Punktes'},{name: 'y1', type: 'double', info: 'y-Koordinate des ersten Punktes'},{name: 'x2', type: 'double', info: 'x-Koordinate des zweiten Punktes'},{name: 'y2', type: 'double', info: 'y-Koordinate des zweiten Punktes'}],'Verwende diesen Befehl, um festzustellen, ob zwei Dinge kollidieren.<code><pre>if(distance(x,y,gegnerX,gegnerY) < 10){\n\t//Kollision\n}</pre></code>',"everywhere");
    
    $App.addFunction(function clear(){
      $App.canvas.clear();
    },null,'Loescht den Inhalt der Zeichenflaeche.',[],'Verwende diesen Befehl zu Beginn der Funktion <a href="#help-onNextFrame"><code>onNextFrame</code></a>, damit du danach alles neu zeichnen kannst.');
  
    $App.addFunction(function fillOutside(){
      $App.canvas.fillOutside();
    },null,'Fuellt alle Bereiche, die auerhalb des Koordinatensystems liegen, mit der aktuellen Farbe.',[],'');
  
    $App.addFunction(function getMinX(){
      return $App.canvas.getCanvasMinX();
    },'double','Liefert den kleinsten x-Wert, der aktuell noch sichtbar ist.',[],'');
    $App.addFunction(function getMaxX(){
      return $App.canvas.getCanvasMaxX();
    },'double','Liefert den groessten x-Wert, der aktuell noch sichtbar ist.',[],'');
    $App.addFunction(function getMinY(){
      return $App.canvas.getCanvasMinY();
    },'double','Liefert den kleinsten y-Wert, der aktuell noch sichtbar ist.',[],'');
    $App.addFunction(function getMaxY(){
      return $App.canvas.getCanvasMaxY();
    },'double','Liefert den groessten y-Wert, der aktuell noch sichtbar ist.',[],'');
  
    $App.addFunction(async function sleep(millis){
      var p=new Promise((resolve,reject)=>{
        setTimeout(()=>{
          resolve();
        },millis);
      });
      return await p;
    },null,'Unterbricht den Programmablauf fuer eine gewisse Zeit.',[
      {name: "millis", type: 'int', info: 'Anzahl Millisekunden, die das Programm abwarten soll.'}
    ],'Dieser Befehl funktioniert nur zusammen mit async/await.');
    
    $App.alert=window.alert;
    $App.confirm=window.confirm;
    $App.prompt=window.prompt;
  
    $App.handleModalDialog=function(){
      $App.gamepad.resetAllButtons();
      $App.mouse.down=false;
      $App.keyboard.reset();
    };
  
    $App.addFunction(function alert(text){
      $App.handleModalDialog();
      $App.alert.call(window,text);
    },null,'Zeigt eine Messagebox mit einer Nachricht.',[{name: 'text', type: 'String', info: 'Der Text, der angezeigt werden soll.'}],'',"everywhere");
    
    $App.addFunction(function prompt(text,defaultValue){
      $App.handleModalDialog();
      return $App.prompt.call(window,text,defaultValue);
    },'String','Zeigt eine Messagebox mit einer Nachricht und  einem Eingabefeld. Liefert den eingegebenen Text zurueck.',[{name: 'text', type: 'String',info: 'Der Text, der angezeigt werden soll.'}, {name: 'defaultValue', type: 'String',info: 'Vorgegebener Eingabetext.', optional: true}],'',"everywhere");
    
    $App.addFunction(function promptNumber(text,defaultValue){
      $App.handleModalDialog();
      let a;
      let zusatz="";
      do{
        a=prompt(text+zusatz,defaultValue)*1;
        zusatz="\n\nBitte eine Zahl eingeben.";
      }while(isNaN(a));
      return a;
    },'double','Zeigt eine Messagebox mit einer Nachricht und einem Eingabefeld. Liefert die eingegebene Zahl zurueck.',[{name: 'text', type: 'String', info: 'Der Text, der angezeigt werden soll.'}, {name: 'defaultValue', type: 'String',info: 'Vorgegebener Eingabetext.', optional: true}],'',"everywhere");
    
    $App.addFunction(function confirm(text){
      $App.handleModalDialog();
      return $App.confirm.call(window,text);
    },'boolean','Zeigt eine Messagebox mit einer Nachricht. Der Benutzer muss zwischen OK und Abbrechen waehlen. Die Auswahl wird als <code>true</code> oder <code>false</code> zurueckgegeben.',[{name: 'text', type: 'String', info: 'Der Text, der angezeigt werden soll.'}],'',"everywhere");
    
    $App.addFunction(function toast(text,position,duration){
      $App.toast.show(text,position,duration);
    },null,'Zeigt eine Nachricht fuer einen gewissen Zeitraum an.',[{name: 'text', type: 'String', info: 'Der Text, der angezeigt werden soll.'}, {name: 'position', type: 'String', info: 'Optional: Eine Angabe aus bis zu 2 Woertern, die bestimmen, wo der Text erscheinen soll. Moegliche Woerter: <code>"left"</code>, <code>"center"</code>, <code>"right"</code> und <code>"top"</code>, <code>"middle"</code>, <code>"bottom"</code>.'}, {name: 'duration', type: 'int', info: 'Optional: Die Dauer der Anzeige in Millisekunden.'}],'');
    
    $App.addFunction(function drawLine(x1,y1,x2,y2){
      return $App.canvas.drawLine(x1,y1,x2,y2);
    },'Path','Zeichnet eine gerade Linie von (x1|y1) bis (x2|y2)',
    [{name: 'x1', type: 'double', info: 'x-Koordinate des ersten Punkts.'}, {name: 'y1', type: 'double', info: 'y-Koordinate des ersten Punkts.'}, {name: 'x2', type: 'double', info: 'x-Koordinate des zweiten Punkts.'}, {name: 'y2', type: 'double', info: 'y-Koordinate des zweiten Punkts.'}],
    'Wenn du eine ganze Figur zeichnen willst, ist es oft besser, einen mittels <a href="#help-path">path</a> einen Pfad zu zeichnen.');
    
    $App.addFunction(function drawCircle(cx,cy,r){
      return $App.canvas.paintCircle(cx,cy,r,false);
    },'Path','Zeichnet einen Kreis und gibt diesen zurueck',
    [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
    '');
    
    $App.addFunction(function fillCircle(cx,cy,r){
      return $App.canvas.paintCircle(cx,cy,r,true);
    },'Path','Zeichnet einen ausgefuellten Kreis und gibt diesen zurueck.',
    [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
    '');
    
    $App.addFunction(function drawRect(cx,cy,width,height){
      return $App.canvas.paintRect(cx,cy,width,height,false);
    },'Path','Zeichnet ein Rechteck und gibt dieses zurueck.',
    [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
    '');
    
    $App.addFunction(function fillRect(cx,cy,width,height){
      return $App.canvas.paintRect(cx,cy,width,height,true);
    },'Path','Zeichnet ein ausgefuelltes Rechteck und gibt dieses zurueck.',
    [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
    '');
    
    $App.addFunction(function rotate(angle,cx,cy){
      $App.canvas.rotate(angle,cx,cy);
    },null,'Dreht alles, was danach gezeichnet wird.',
    [{name: 'angle', type: 'double', info: 'Winkel, um den gedreht wird'}, {name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts der Drehung.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts der Drehung.'}],
    '');
  
    $App.addFunction(function translate(dx,dy){
      $App.canvas.translate(dx,dy);
    },null,'Verschiebt alles, was danach gezeichnet wird.',
    [{name: 'dx', type: 'double', info: 'Verschiebung in x-Richtung.'}, {name: 'dy', type: 'double', info: 'Verschiebung in y-Richtung.'}],
    '');
  
    $App.addFunction(function scale(sx,sy,cx,cy){
      $App.canvas.scale(sx,sy,cx,cy);
    },null,'Skaliert alles, was danach gezeichnet wird.',
    [{name: 'sx', type: 'double', info: 'Skalierungsfaktor in x-Richtung. Bei negativem Wert wird an einer vertikalen Achse gespiegelt.'}, {name: 'sy', type: 'double', info: 'Skalierungsfaktor in y-Richtung. Bei negativem Wert wird an einer horizontalen Achse gespiegelt.'}, {name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts der Skalierung.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts der Skalierung.'}],
    '');
  
    $App.addFunction(function saveCanvasState(){
      $App.canvas.save();
    },null,'Speichert den aktuellen Zustand des Canvas auf einem Stack.',
    [],
    '');
  
    $App.addFunction(function restoreCanvasState(){
      $App.canvas.restore();
    },null,'Stellt den zuletzt gespeicherten Zustand des Canvas wieder her.',
    [],
    '');
  
    $App.addFunction(async function loadAsset(url, name){
      $App.registerAsset.call($App,url, name);
    },null,'Laedt ein sog. "Asset" (ein Bild oder ein Sound) und speichert es unter dem angegebenen Namen im Objekt "assets". Muss vor onStart aufgerufen werden.',
    [{name: 'url', type: 'String', info: 'URL der Datei'}, {name: 'name', type: 'String', info: 'Name, unter dem das Asset gespeichert wird.'}],
    '',"topLevel");
  
    $App.addFunction(async function shareVariables(variablenames){
      $App.shareVariables.apply(arguments);
    },null,'Legt diese Variablen offen für andere Apps.',
    [{name: 'variablennamen', type: 'String', info: 'Name der Variablen'}],
    '',"topLevel");

    $App.addFunction(async function loadScript(url){
      $App.registerScript.call($App,url);
    },null,'Laedt ein JavaScript. Muss vor onStart aufgerufen werden.',
    [{name: 'url', type: 'String', info: 'URL des Scripts'}],
    '',"topLevel");

    $App.addFunction(async function loadPeerJS(){
      loadScript("https://thomaskl.uber.space/Webapps/lib/peerjs.min.js");
    },null,'Laedt PeerJS, was du zur Verbindungsherstellung über das Internet brauchst. Muss vor onStart aufgerufen werden.',
    [],
    '',"topLevel");

    $App.addFunction(async function loadHowlerJS(){
      loadScript("https://thomaskl.uber.space/Webapps/lib/howler.min.js");
    },null,'Laedt HowlerJS, was du zum Abspielen von Sounds brauchst. Muss vor onStart aufgerufen werden.',
    [],
    '',"topLevel");
    
    $App.addFunction(function beep(type, frequency, volume, duration){
      var oscillator = audioCtx.createOscillator();
      var gainNode = audioCtx.createGain();

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
    },null,'Macht einen Beep.',
    [{name: 'type', type: 'String', info: 'sine, square, triangle.'}, {name: 'frequency', type: 'int', info: 'Frequenz.'}, {name: 'volumne', type: 'double', info: 'Lautstärke.'}, {name: 'duration', type: 'int', info: 'Dauer in ms.'}],
    '');
    
    $App.addFunction(function drawImage(image,cx,cy,width,height,rotation,mirrored){
      $App.canvas.drawImage(image,cx,cy,width,height,rotation,mirrored);
    },null,'Zeichnet ein Bild. Dieses musst du vorher mittels loadAsset laden.',
    [{name: 'image', type: 'String', info: 'Bild-Asset. Muss vorher mittels <a href="#help-loadAsset"><code>loadAsset</code></a> geladen werden.'},{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}, {name: 'rotation', type: 'double', info: 'Winkel, um den das Bild gedreht werden soll.', hide: true}, {name: 'mirrored', type: 'boolean', info: 'true, wenn das Bild vertikal gespiegelt werden soll.', hide: true}],
    '');
    $App.addFunction(function drawImagePart(image,cx,cy,width,height,scx,scy,swidth,sheight,rotation,mirrored){
      $App.canvas.drawImage(image,cx,cy,width,height,rotation,mirrored,{cx: scx, cy: scy, w: swidth, h: sheight});
    },null,'Zeichnet einen rechteckigen Ausschnitt eines Bildes. Dieses musst du vorher mittels "loadAsset" laden.',
    [{name: 'image', type: 'String', info: 'Bild-Asset. Muss vorher mittels <a href="#help-loadAsset"><code>loadAsset</code></a> geladen werden.'},{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'},{name: 'scx', type: 'double', info: 'x-Koordinate des Mittelpunkts des Ausschnittes.'}, {name: 'scy', type: 'double', info: 'y-Koordinate des Mittelpunkts des Ausschnittes.'}, {name: 'width', type: 'double', info: 'Breite des Ausschnittes.'}, {name: 'height', type: 'double', info: 'Hoehe des Ausschnittes.'}, {name: 'rotation', type: 'double', info: 'Winkel, um den das Bild gedreht werden soll.', hide: true}, {name: 'mirrored', type: 'boolean', info: 'true, wenn das Bild vertikal gespiegelt werden soll.', hide: true}],
    '');
    
    $App.addFunction(function setCoordinatesystem(width,height,originX,originY){
      if(originX!==undefined && originY!==undefined){
        $App.canvas.setOrigin(originX,originY);
      }
      $App.canvas.setSize(width,height,$App.body.width,$App.body.height);
    },null,'Legt das Koordinatensystem der App fest.',[{name: 'width', type: 'double', info: 'Breite des Koordinatensystems'}, {name: 'height', type: 'double', info: 'Hoehe des Koordinatensystems'}, {name: 'originX', type: 'double', info: 'x-Koordinate des Koordinatenursprungs', optional: true}, {name: 'originY', type: 'double', info: 'y-Koordinate des Koordinatenursprungs'}],'');
  
    $App.addFunction(function getWidth(){
      return $App.body.width;
    },'double','Liefert die aktuelle Breite des Bildschirms in Pixeln.',[],'');
  
    $App.addFunction(function getHeight(){
      return $App.body.height;
    },'double','Liefert die aktuelle Hoehe des Bildschirms in Pixeln.',[],'');
  
    $App.addFunction(function setMirrored(m){
      $App.canvas.setMirrored(m);
    },null,'Legt fuer alle nachfolgenden write-Befehle fest, ob der Text gespiegelt werden soll.',[{name: 'm', type: 'boolean', info: 'Wenn true, dann wird der Text aller nachfolgenden write-Befehle vertikal gespiegelt. Wenn false, wird der Text wieder normal geschrieben.'}],'');
  
    $App.addFunction(function setRotation(angle){
      $App.canvas.setRotation(angle);
    },null,'Legt die Drehung fuer alle nachfolgenden write-Befehle fest.',[{name: 'angle', type: 'double', info: 'Der Winkel um den gedreht werden soll. 0 entspricht keiner Drehung. Es wird gegen den Uhrzeigersinn gedreht.'}],'');
  
    $App.addFunction(function setColor(color){
      $App.canvas.setColor(color);
    },null,'Legt die Farbe fuer alle nachfolgenden Zeichnungen fest.',[{name: 'color', type: 'String', info: 'Farbe, die ab sofort zum Zeichnen und Fuellen verwendet werden soll. Kann eine beliebige Bezeichnung fuer eine HTML-Farbe sein, z. B. <code>"red"</code>, <code>"blue"</code> oder <code>"#e307A6"</code>. Diese Bezeichnungen findest du bspw. unter <a href="https://htmlcolorcodes.com/" target="_blank">htmlcolorcodes</a>.'}],'');
    
    $App.addFunction(function setOpacity(value){
      $App.canvas.setOpacity(value);
    },null,'Legt die Transparenz aller nachfolgenden Zeichnungen fest.',[{name: 'value', type: 'double', info: 'Wert zwischen 0 (komplett transparent) und 1 (komplett sichtbar).'}],'');
    
    $App.addFunction(function setFontsize(size){
      $App.canvas.setFontsize(size);
    },null,'Legt die Schriftgroesse fuer alle nachfolgenden write-Befehle fest.',[{name: 'size', type: 'double', info: 'Schriftgroesse, die ab sofort zum Schreiben verwendet werden soll.'}],'');
  
    $App.addFunction(function setFont(name){
      $App.canvas.setFont(name);
    },null,'Legt die Schriftart fuer alle nachfolgenden write-Befehle fest.',[{name: 'name', type: 'String', info: 'Schriftart, z. B. Arial.'}],'');
    
    $App.addFunction(function setLinewidth(size){
      $App.canvas.setLinewidth(size);
    },null,'Legt die Breite der Linien fuer alle nachfolgenden Zeichnungen fest.',[{name: 'size', type: 'double', info: 'Die Dicke der Linien, die ab sofort verwendet werden soll.'}],'');
    
    $App.addFunction(function write(text,x,y,align){
      $App.canvas.write(text,x,y,align);
    },null,'Schreibt Text auf den Bildschirm.',
    [{name: 'text', type: 'String', info: 'Der Text, der geschrieben werden soll. Verwende <code>&bsol;n</code> fuer Zeilenumbrueche.'}, {name: 'x', type: 'double', info: 'Die x-Koordinate des Texts.'}, {name: 'y', type: 'double', info: 'Die y-Koordinate des Texts.'}, {name: 'align', type: 'String', info: 'Eine Angabe aus bis zu 2 Woertern, die bestimmen, wie der Text am Punkt (<code>x</code>|<code>y</code>) ausgerichtet sein soll. Moegliche Woerter: <code>"left"</code>, <code>"center"</code>, <code>"right"</code> und <code>"top"</code>, <code>"middle"</code>, <code>"bottom"</code>.', hide: true}],
    '');
    
    /*$App.addFunction(async function read(placeholdertext,x,y,width,align){
      return await $App.canvas.read(placeholdertext,x,y,width,align,"text");
    },'',[{name: 'placeholdertext', info: 'Text, der als Platzhalter in dem Textfeld angezeigt wird.'}, {name: 'x', info: 'x-Koordinate des Textfelds.'}, {name: 'y', info: 'y-Koordinate des Textfelds.'}, {name: 'width', info: 'Breite des Textfelds. Die Hoehe entspricht automatisch der aktuellen Schriftgroesse.'}, {name: "align", info: 'Eine Angabe aus bis zu 2 Woertern, die bestimmen, wie der Text am Punkt (<code>x</code>|<code>y</code>) ausgerichtet sein soll. Moegliche Woerter: <code>"left"</code>, <code>"center"</code>, <code>"right"</code> und <code>"top"</code>, <code>"middle"</code>, <code>"bottom"</code>.'}],'');
    
    $App.addFunction(async function readNumber(placeholdertext,x,y,width,alignment){
      return await $App.canvas.read(placeholdertext,x,y,width,alignment,"number");
    },'',[{name: 'placeholdertext', info: 'Text, der als Platzhalter in dem Textfeld angezeigt wird.'}, {name: 'x', info: 'x-Koordinate des Textfelds.'}, {name: 'y', info: 'y-Koordinate des Textfelds.'}, {name: 'width', info: 'Breite des Textfelds. Die Hoehe entspricht automatisch der aktuellen Schriftgroesse.'}, {name: "align", info: 'Eine Angabe aus bis zu 2 Woertern, die bestimmen, wie der Text am Punkt (<code>x</code>|<code>y</code>) ausgerichtet sein soll. Moegliche Woerter: <code>"left"</code>, <code>"center"</code>, <code>"right"</code> und <code>"top"</code>, <code>"middle"</code>, <code>"bottom"</code>.'}],'');*/
    
    $App.addFunction(function random(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    },'int','Liefert eine ganze Zufallszahl zwischen <code>min</code> und <code>max</code> (jeweils einschliesslich).',[{name: 'min', type: 'int', info: 'Mindestwert fuer die Zufallszahl.'}, {name: 'max', type: 'int', info: 'Maximalwert fuer die Zufallszahl.'}],'',"everywhere");
    
    $App.addFunction(function isKeyDown(key){
      if(typeof key==="string"){
        key=key.toLowerCase().codePointAt(0);
      }
      return $App.keyboard.down[key]===true;
    },'boolean','Prueft, ob eine bestimmte Taste auf der Tastatur gedrueckt wird.',[{name: 'key', type: 'String', info: 'Das Zeichen, von dem geprueft werden soll, ob die zugehoerige Taste gedrueckt wird; bspw. "W", " " oder "4".'}],'');
    
    $App.addFunction(function hideHelp(){
      $App.help.setButtonVisible(false);
    },null,'Versteckt den Hilfe-Button oben rechts.',[],'',"everywhere");
    
    $App.addFunction(function range(start,stop,step){
      var text="range(";
      if(step===undefined){
        if(stop===undefined){
          stop=start;
          start=1;
          step=1;
          text+=stop;
        }else{
          if(start>stop){
            step=-1;
          }else{
            step=1;
          }
          text+=start+","+stop
        }
      }else{
        text+=start+","+stop+","+step
      }
      text+="): ";
      if(!step){
        console.log(text+"Der Schritt darf nicht "+step+" sein." )
        return [];
      }
      if(step>0){
        if(start>stop){
          console.log(text+"Der Startwert darf nicht groesser als der Endwert sein.");
          return [];
        }
      }else if(step<0){
        if(start<stop){
          console.log(text+"Der Startwert darf nicht kleiner als der Endwert sein, wenn der Schritt negativ ist.");
          return [];
        }
      }
      start*=1;
      stop*=1;
      step*=1;
      if(isNaN(start)){
        console.log(text+"Der Startwert ist keine Zahl.");
        return [];
      }
      if(isNaN(stop)){
        console.log(text+"Der Endwert ist keine Zahl.");
        return [];
      }
      if(isNaN(step)){
        console.log(text+"Der Schritt ist keine Zahl.");
        return [];
      }
      var array=[];
      for(var i=start;i*step<=stop*step;i+=step){
        array.push(i);
      }
      return array;
    },{baseType: 'int', dimension: 1},'Generiert ein Array mit den Zahlen von min bis max. Kann z. B. in for-Schleifen verwendet werden.',[
      {name: "start", type: 'int', info: 'Erste Zahl', hide: true},
      {name: "stop", type: 'int', info: 'Letzte Zahl'},
      {name: "step", type: 'int', info: 'Schritt zwischen zwei Zahlen', hide: true}
    ],'',"everywhere");
    
    $App.addFunction(function showHelp(){
      $App.help.setButtonVisible(true);
    },null,'Zeigt den Hilfe-Button oben rechts wieder an.',[],'',"everywhere");
    
    $App.addObject("session",false,{
      get isServer(){
		if(this.session){
		  return this.session.isHost;
		}else{
		  return false;
		}
      },
      get myID(){
		if(this.session){
          return this.session.clientID;
		}else{
		  return null;
		}
      },
      get sessionID(){
        if(this.session){
          return this.session.sessionID;
		}else{
		  return null;
		}
      },
      session: null,
      start: function(sessionID, clientID, isHost, debug){
        this.session=new Session(sessionID,clientID,isHost,debug);
      },
      showStartDialog: async function(){
        await $App.dialog.showStartSession();
      },
      sendMessage: function(message){
        this.session.sendMessage(message);
      }
    },'Hiermit kannst du eine Netzwerksession aufsetzen, in der sich mehrere Instanzen deiner App miteinander verbinden können.',
    [
      {name: 'myID', type: 'String', info: 'Die ID, mit der du aktuell im Netzwerk angemeldet ist.'},
	  {name: 'isServer', type: 'boolean', info: 'true, wenn du selbst der Server bist, ansonsten false.'},
      {name: 'sessionID', type: 'String', info: 'Die ID der Session, mit der diese App verbunden ist.'},
      {
        name: 'showStartDialog',
        returnType: null,
        args: [],
        info: 'Zeigt einen Dialog, mit dem man bequem eine Netzwerksession starten kann.'
      },
      {
        name: 'start',
        returnType: null,
        args: [{name: 'sessionID', type: 'String', info: 'ID deiner Netzwerksession'}, {name: 'clientID', type: 'String', info: 'Dein Name im Netzwerk.'}, {name: 'isHost', type: 'boolean', info: 'Legt fest, ob du der Host (Server) bist oder ein Client, der dem Serer beitritt.'}],
        info: 'Startet eine neue Netzwerksession entweder als Host oder als Client.'
      }, 
      {
        name: 'sendMessage',
        returnType: null,
        args: [{name: 'message', type: 'String', info: 'Nachricht, die versendet wird.'}],
        info: 'Sendet eine Nachricht an alle Teilnehmer der Netzwerksession.'
      }
    ]);
    
    $App.addObject("storage",false,{
      get keys(){
        var keys=[];
        for (var i = 0; i < localStorage.length; i++) {
          keys.push(localStorage.key(i));
        }
        return keys;
      },
      save(key, value){
        try{
          var s=JSON.stringify(value);
        }catch(e){
          var m="Der Wert kann nicht in einen String umgewandelt werden.";
          console.log(m);
          throw m;
        }
        try{
          localStorage.setItem(key,s);
          return true;
        }catch(e){
          return false;
        }
      },
      removeItem: function(key){
        localStorage.removeItem(key);
      },
      removeAllItems: function(){
        localStorage.clear();
      },
      load(key){
        var v=localStorage.getItem(key);
        if(v!==null){
          try{
            v=JSON.parse(v);
          }catch(e){
            v=null;
          }
        }
        return v;
      },
      download: function(data,filename){
        window.URL =  window.URL || window.webkitURL;
        if(!filename) filename="Download.txt";
        var split=filename.split(".");
        var mime;
        if(split.length>0){
          var extension=split[split.length-1];
          mime="text/"+extension;
        }else{
          var extension="txt";
          mime="text";
          filename+=extension;
        }
        var blob = new Blob([data], {type: mime});
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
      },
      upload: async function(){
        var p=new Promise(function(resolve,reject){
          $App.$uploadCallback(function(data,fileName,mime){
            data=data.replace(/\r\n/g,"\n");
            resolve({
              data: data,
              fileName: fileName,
              mime: mime
            });
          });
        });
        var q=await p;
        return q;
      }
    },'Erlaubt das Speichern und Laden von Daten.',
    [
      {name: 'keys', type: { baseType: 'double', dimension: 1}, info: 'Ein String-Array mit allen Keys, die von der App verwendet werden.'},
      {
        name: 'save', 
        returnType: 'boolean',
        args: [{name: 'key', type: 'String', info: 'Key, unter dem der Wert gespeichert werden soll.'}, {name: 'value', type: 'String', info: 'Wert, der gespeichert werden soll'}],
        info: 'Speichert den Wert value unter einem Key key im lokalen Speicher des Browsers. Liefert true zurück, wenn der Vorgang erfolgreich war, ansonsten false (z.B. weil kein Speicherplatz mehr verfügbar ist).'
      }, 
      {
        name: 'load',
        returnType: 'String',
        args: [{name: 'key', type: 'String', info: 'Key, dessen Wert geladen werden soll.'}],
        info: 'Lädt den Wert, der im lokalen Speicher des Browsers unter dem Key key gespeichert ist. Ist kein Wert vorhanden, wird null zurückgegeben.'
      },
      {
        name: 'removeItem',
        returnType: null,
        args: [{name: 'key', type: 'String', info: 'Key, dessen Wert entfernt werden soll.'}],
        info: 'Entfernt den Wert, der im lokalen Speicher des Browsers unter dem Key key gespeichert ist. Ist kein Wert vorhanden, bewirkt diese Methode nichts.'
      },
      {
        name: 'removeAllItems',
        returnType: null,
        args: [],
        info: 'Löscht den kompletten Inhalt des lokalen Speichers des Browsers.'
      },
      {
        name: 'download',
        returnType: null,
        args: [{name: 'text', type: 'String', info: 'Inhalt der Datei, die heruntergeladen werden soll.'}, {name: 'filename', type: 'String', info: 'Name der Datei, die heruntergeladen werden soll.'}],
        info: 'Erzeugt eine Datei, die der User auf seinem:ihrem Gerät speichern kann.'
      },
      {
        name: 'upload',
        returnType: "File",
        args: [],
        info: 'Erlaubt es dem User eine Datei von seinem:ihrem Gerät hochzuladen und liefert die Datei zurück.'
      }
    ]);

    $App.addObject("time",false,{
      get now(){
        return (new Date()).getTime();
      },
      get sec(){
        return (new Date()).getUTCSeconds();
      },
      get min(){
        return (new Date()).getUTCMinutes();
      },
      get h(){
        return (new Date()).getUTCHours();
      },
      get day(){
        return (new Date()).getUTCDate();
      },
      get month(){
        return (new Date()).getUTCMonth()+1;
      },
      get year(){
        return (new Date()).getUTCFullYear();
      },
      start(millis,name){
        if(!$App.timer){
          $App.timer=[];
        }
        if(name){
          name=name.toLowerCase();
          for(let i=0;i<$App.timer.length;i++){
            let t=$App.timer[i];
            if(t.name===name){
              console.log("Es gibt bereits einen Timer mit dem Namen '"+name+"'.");
              return;
            }
          }
        }
        
        let id=setTimeout(()=>{
          if(!$App.debug.paused && window.onTimeout){
            for(let i=0;i<$App.timer.length;i++){
              let t=$App.timer[i];
              if(t.name===name){
                $App.timer.splice(i,1);
                break;
              }
            }
            window.onTimeout(name);
          }else{
            console.log("Du hast einen Timer gestartet, aber es gibt keine 'onTimeout'-Funktion.");
          }
        },millis);
        let timer={
          name: name,
          id: id
        };
        $App.timer.push(timer);
      },
      stop(name){
        if(!$App.timer){
          console.log("Es gibt keinen Timer, den du stoppen kannst.");
          return;
        }
        if(name){
          name=name.toLowerCase();
          for(var i=0; i<$App.timer.length;i++){
            let t=$App.timer[i];
            if(t.name.toLowerCase()===name){
              $App.timer.splice(i,1);
              clearTimeout(t.id);
              return;
            }
          }
          console.log("Es gibt keinen Timer mit dem Namen '"+name+"', den du stoppen koenntest.");
        }else{
          /**Stoppe alle Timer */
          for(var i=0; i<$App.timer.length;i++){
            let t=$App.timer[i];
            clearTimeout(t.id);
          }
          $App.timer=[];
        }
      }
    },'Liefert dir Informationen ueber die Zeit und erlaubt es dir, Timer zu stellen und zu stoppen.',
    [
      {name: 'now', info: 'Die aktuelle Zeit in Millisekunden seit dem 1.1.1970.', type: 'int'},
      {name: 'sec', info: 'Die Sekundenzahl der aktuellen Uhrzeit.', type: 'int'},
      {name: 'min', type: 'int', info: 'Die Minutenzahl der aktuellen Uhrzeit.'},
      {name: 'h', type: 'int', info: 'Die Stundenzahl der aktuellen Uhrzeit.'},
      {name: 'day', type: 'int', info: 'Der aktuelle Tag im Monat.'},
      {name: 'month', type: 'int', info: 'Der aktuelle Monat (1-12).'},{name: 'year', type: 'int', info: 'Die aktuelle Jahreszahl.'}, 
      {
        name: 'start', 
        returnType: null, 
        args: [{name: 'millis', type: 'int', info: 'Anzahl Millisekunden bis der Timer ausloest.'}, {name: 'name', type: 'String', info: "Name des Timers, mit dem onTimeout aufgerufen wird."}], 
        info: 'Startet einen Timer, der millis Millisekunden lang laeuft. Wenn er ablaeuft, loest er die Funktion <code>onTimeout</code> aus.'
      }, 
      {
        name: 'stop', 
        returnType: null,
        args: [{name: 'name', type: 'String', info: 'Name des Timers, der gestoppt werden soll.'}], 
        info: 'Stoppt den Timer mit dem angegebenen Namen. Wenn du keinen Namen angibst, werden alle laufenden Timer gestoppt.'
      },
      {name: 'year', type: 'int', info: 'Die aktuelle Jahreszahl (vierstellig).'}
    ], "everywhere");
    
    $App.addObject('gamepad',false,{
      get left(){
        return $App.gamepad.isButtonPressed("left");
      },
      get up(){
        return $App.gamepad.isButtonPressed("up");
      },
      get right(){
        return $App.gamepad.isButtonPressed("right");
      },
      get down(){
        return $App.gamepad.isButtonPressed("down");
      },
      get X(){
        return $App.gamepad.isButtonPressed("X");
      },
      get Y(){
        return $App.gamepad.isButtonPressed("Y");
      },
      get A(){
        return $App.gamepad.isButtonPressed("A");
      },
      get B(){
        return $App.gamepad.isButtonPressed("B");
      },
      get E(){
        return $App.gamepad.isButtonPressed("E");
      },
      get F(){
        return $App.gamepad.isButtonPressed("F");
      },
      set left(key){
        $App.gamepad.setButtonKey("left",key);
      },
      set right(key){
        $App.gamepad.setButtonKey("right",key);
      },
      set up(key){
        $App.gamepad.setButtonKey("up",key);
      },
      set down(key){
        $App.gamepad.setButtonKey("down",key);
      },
      set X(key){
        $App.gamepad.setButtonKey("X",key);
      },
      set Y(key){
        $App.gamepad.setButtonKey("Y",key);
      },
      set A(key){
        $App.gamepad.setButtonKey("A",key);
      },
      set B(key){
        $App.gamepad.setButtonKey("B",key);
      },
      set E(key){
        $App.gamepad.setButtonKey("E",key);
      },
      set F(key){
        $App.gamepad.setButtonKey("F",key);
      },
      get multiaxis(){
        return $App.gamepad.multiaxis;
      },
      set multiaxis(v){
        $App.gamepad.multiaxis=v;
      },
      show: function(){
        $App.gamepad.setVisible(true);
      },
      hide: function(){
        $App.gamepad.setVisible(false);
      },
    },'Erlaubt die Benutzung des Gamepads.',
    [
      {
        name: 'show',
        returnType: null,
        info: 'Zeigt das Gamepad an.'
      }, 
      {
        name: 'hide',
        returnType: null,
        info: 'Verbirgt das Gamepad.'
      },
      {
        name: 'left',
        type: 'boolean',
        info: 'Wird gerade der Joystick nach links bewegt?',
      },
      {
        name: 'setLeft',
        language: "java",
        returnType: null,
        args: [{name: 'keycode', type: 'int', info: 'Keycode der Taste, die mit "Links" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "Steuerkreuz - Links" verbunden werden soll.',
      },
      {
        name: 'right',
        type: 'boolean',
        info: 'Wird gerade der Joystick nach rechts bewegt?'
      },
      {
        name: 'setRight',
        language: "java",
        returnType: null,
        args: [{name: 'keycode', type: 'int', info: 'Keycode der Taste, die mit "Rechts" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "Steuerkreuz - Rechts" verbunden werden soll.',
      }, 
      {
        name: 'up',
        type: 'boolean',
        info: 'Wird gerade der Joystick nach oben bewegt?'
      },
      {
        name: 'setUp',
        language: "java",
        returnType: null,
        args: [{name: 'keycode', type: 'int', info: 'Keycode der Taste, die mit "Oben" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "Steuerkreuz - Oben" verbunden werden soll.',
      },
      {
        name: 'down',
        type: 'boolean',
        info: 'Wird gerade der Joystick nach unten bewegt?'
      }, 
      {
        name: 'setDown',
        language: "java",
        returnType: null,
        args: [{name: 'keycode', type: 'int', info: 'Keycode der Taste, die mit "Unten" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "Steuerkreuz - Unten" verbunden werden soll.',
      },
      {
        name: 'A',
        type: 'boolean',
        info: 'Wird gerade die Taste "A" gedrueckt?'
      }, 
      {
        name: 'setA',
        language: "java",
        returnType: null,
        args: [{name: 'taste', type: 'String', info: 'Name der Taste, die mit "A" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "A" verbunden werden soll.',
      },
      {
        name: 'B',
        type: 'boolean',
        info: 'Wird gerade die Taste "B" gedrueckt?'
      },
      {
        name: 'setB',
        language: "java",
        returnType: null,
        args: [{name: 'taste', type: 'String', info: 'Name der Taste, die mit "B" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "B" verbunden werden soll.',
      }, 
      {
        name: 'X',
        type: 'boolean',
        info: 'Wird gerade die Taste "X" gedrueckt?'
      }, 
      {
        name: 'setX',
        language: "java",
        returnType: null,
        args: [{name: 'taste', type: 'String', info: 'Name der Taste, die mit "X" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "X" verbunden werden soll.',
      },
      {
        name: 'Y',
        type: 'boolean',
        info: 'Wird gerade die Taste "Y" gedrueckt?'
      }, 
      {
        name: 'setY',
        language: "java",
        returnType: null,
        args: [{name: 'taste', type: 'String', info: 'Name der Taste, die mit "Y" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "Y" verbunden werden soll.',
      },
      {
        name: 'E',
        type: 'boolean',
        info: 'Wird gerade die Taste "E" gedrueckt?'
      }, 
      {
        name: 'setE',
        language: "java",
        returnType: null,
        args: [{name: 'taste', type: 'String', info: 'Name der Taste, die mit "E" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "E" verbunden werden soll.',
      },
      {
        name: 'F',
        type: 'boolean',
        info: 'Wird gerade die Taste "F" gedrueckt?'
      },
      {
        name: 'setF',
        language: "java",
        returnType: null,
        args: [{name: 'taste', type: 'String', info: 'Name der Taste, die mit "F" verbunden werden soll.'}],
        info: 'Legt fest, welche Taste auf der Tastatur mit "F" verbunden werden soll.',
      },
    ],'Durch Zuweisen eines Zeichens zu einer Taste kannst du festlegen, welche Taste zu welchem Button gehoert:<code><pre>function onStart(){\n\tgamepad.show();\n\t//Bewegung mit WASD:\n\tgamepad.up = "W";\n\tgamepad.down = "S";\n\tgamepad.left = "A";\n\tgamepad.right = "D";\n\t//Buttons E und F ausblenden:\n\tgamepad.E = null;\n\tgamepad.F = null;\n\t//Button B durch Leertaste:\n\tgamepad.B = " ";\n}</pre></code>');
    
    $App.addObject('path',false,{
      begin: function (x,y){
        $App.canvas.beginPath(x,y);
        return this;
      },
      jump: function(dx,dy){
        $App.canvas.jump(dx,dy);
        return this;
      },
      jumpTo: function(x,y){
        $App.canvas.jumpTo(x,y);
        return this;
      },
      line: function(dx,dy){
        $App.canvas.line(dx,dy);
        return this;
      },
      lineTo: function(x,y){
        $App.canvas.lineTo(x,y);
        return this;
      },
      close: function(){
        $App.canvas.closePath();
        return this;
      },
      draw: function(){
        $App.canvas.drawPath();
        return this;
      },
      fill: function(){
        $App.canvas.fillPath();
        return this;
      },
      rect: function(w,h){
        $App.canvas.rect(w,h);
        return this;
      },
      circle: function(r,start,stop){
        $App.canvas.circle(r,start,stop);
        return this;
      },
      contains: function(x,y){
        return $App.canvas.isPointInPath(x,y);
      }
    },'Erlaubt das Zeichnen von Figuren und Linien.',
    [
      {
        name: 'begin', 
        returnType: 'Path',
        args: [{name: 'x', type: 'double', info: 'x-Koordinate'}, {name: 'y', type: 'double', info: 'y-Koordinate'}],
        info: 'Beginnt einen neuen Pfad am Punkt (<code>x</code>|<code>y</code>)'
      }, 
      {
        name: 'jump',
        returnType: 'Path',
        args: [{name: 'dx', type: 'double', info: 'Unterschied in x-Richtung'}, {name: 'dy', type: 'double', info: 'Unterschied in y-Richtung'}],
        info: 'Springt von der aktuellen Position um <code>dx</code> nach rechts und um <code>dy</code> nach oben, ohne etwas zu zeichnen.'
      }, 
      {
        name: 'jumpTo',
        returnType: 'Path',
        args: [{name: 'x', type: 'double', info: 'x-Koordinate'}, {name: 'y', type: 'double', info: 'y-Koordinate'}], 
        info: 'Springt von der aktuellen Position zum Punkt (<code>x</code>|<code>y</code>), ohne etwas zu zeichnen.'
      }, 
      {
        name: 'line',
        returnType: 'Path',
        args: [{name: 'dx', type: 'double', info: 'Unterschied in x-Richtung'}, {name: 'dy', type: 'double', info: 'Unterschied in y-Richtung'}], 
        info: 'Zeichnet eine gerade Linie von der aktuellen Position um <code>dx</code> nach rechts und um <code>dy</code> nach oben.'
      },
      {
        name: 'lineTo',
        returnType: 'Path',
        args: [{name: 'x', type: 'double', info: 'x-Koordinate'}, {name: 'y', type: 'double', info: 'y-Koordinate'}], 
        info: 'Zeichnet eine gerade Linie von der aktuellen Position zum Punkt <code>(x|y)</code>.'
      },    
      {
        name: 'close',
        returnType: 'Path', 
        info: 'Zeichnet eine gerade Linie vom aktuellen Punkt zurueck zum Startpunkt des Pfades.'
      }, 
      {
        name: 'draw',
        returnType: 'Path', 
        info: 'Zeichnet den Pfad.'
      }, 
      {
        name: 'fill', 
        returnType: 'Path',
        info: 'Fuellt den Pfad.'
      }, 
      {
        name: 'contains',
        returnType: 'boolean',
        args: [{name: 'x', type: 'double', info: 'x-Koordinate'}, {name: 'y', type: 'double', info: 'y-Koordinate'}], 
        info: 'Prueft, ob sich der Punkt (<code>x</code>|<code>y</code>) innerhalb des aktuellen Pfades befindet.'
      }, 
      {
        name: 'rect', 
        returnType: 'Path',
        args: [{name: 'w', type: 'double', info: 'Breite'}, {name: 'h', type: 'double', info: 'Hoehe'}],
        info: 'Zeichnet ein Rechteck mit dem aktuellen Punkt als Mittelpunkt und Breite w und Hoehe h.'
      }, 
      {
        name: 'circle(r,[start,stop])',
        returnType: 'Path',
        args: [{name: 'r', type: 'double', info: 'Radius'}, {name: 'start', type: 'double', info: 'Startwinkel'}, {name: 'stop', type: 'double', info: 'Endwinkel'}], 
        info: 'Zeichnet einen Kreisbogen mit dem aktuellen Punkt als Mittelpunkt Radius <code>r</code>. Optional kannst du mit <code>start</code> und <code>stop</code> den Anfangs- und den Endwinkel festlegen, um nur einen Teil des Kreises zu zeichnen.'
      }
    ],'');
    
    $App.addObject('ui',false,{
      canvas: function(internalWidth,internalHeight,cx,cy,width,height){
        var canvas=new $App.Canvas(null,internalWidth,internalHeight);
        var b=canvas.container;
        b.resize=function(){
          this.canvas.resize();
        }
        b.noAbsolutePosition=true;
        b.canvas=canvas;
        var methods=["setSize","setMirrored","setRotation","setOpacity","setFontsize","setFont","setLinewidth","write","drawCircle","fillCircle","drawRect","fillRect","drawLine","beginPath","lineTo","closePath","setColor","drawImage","drawImagePart","rotate","translate","scale","addElement"];
        for(var i=0;i<methods.length;i++){
          let m=methods[i];
          b[m]=function(){
            return this.canvas[m].apply(this.canvas,arguments);
          }
        }
        $App.resizeObserver.observe(b);
        //$App.canvas.addElement(b,cx,cy,width,height);
        //canvas.resize();
        return b;
      },
      panel: function (template,cx,cy,width,height){
        var b=$App.createElement("div");
        b.className="panel";
        b.style.flexDirection="column";
        b.add=function(c,index){
          //if(!this.noAbsolutePosition){
            c.style.position="relative";
            c.style.width="auto";
            c.style.height="auto";
            c.style.left="0px";
            c.style.top="0px";
          //}
          if(c.parentNode){
            c.parentNode.removeChild(c);
          }
          c.appJSData.parent=this;
          if((index===0 || index>0) && index<this.childNodes.length){
            this.insertBefore(c,this.childNodes[index]);
          }else{
            this.appendChild(c);
          }
          if(c.resize){
            c.resize();
          }
        };
        b.remove=function(c){
          c.style.position="absolute";
          this.removeChild(c);
          $App.canvas.addElement(c,c.appJSData.cx,c.appJSData.cy,c.appJSData.width,c.appJSData.height,c.appJSData.align);
        }
        //$App.canvas.addElement(b,cx,cy,width,height);
        b.setTemplate=function(template){
          if(!template){
            b.noAbsolutePosition=true;
            b.style.overflow="auto";
          }else{
            b.noAbsolutePosition=false;
            template+="";
          }
          
          if(!b.noAbsolutePosition){
            var teile=template.split("/");
            for(var i=0;i<teile.length;i++){
              var t=teile[i].trim();
              if(/^\d+$/.test(t)){
                teile[i]="repeat("+t+",minmax(0,1fr))";
                
              }
            }
            if(teile.length===2){
              b.style.gridTemplateRows=teile[0];
              b.style.gridTemplateColumns=teile[1];
            }else{
              b.style.gridTemplateColumns=teile[0];
            }
            b.style.gridAutoRows="minmax(0,1fr)";
            b.style.display="grid"; 
            b.style.alignItems="stretch";
            b.style.justifyItems="stretch";
            b.style.gridColumnGap=0;
            b.style.gridRowGap=0;
            b.style.columnGap=0;
            b.style.rowGap=0;
            b.style.overflow="auto";
          }
        };
        b.setTemplate(template);
        return b;
      },
      button: function (text,cx,cy,width,height){
        var b=$App.createElement("button");
        b.value=text;
        //b.style.padding=0;
        //b.style.margin=0;
        //$App.canvas.addElement(b,cx,cy,width,height);
        return b;
      },
      iframe: function(url,cx,cy,width,height){
        var div=$App.createElement("div");
        var frame=document.createElement("iframe");
        frame.style="width: 100%; height: 100%; left: 0; top: 0; position: absolute;background-color: white";
        Object.defineProperty(div,'value', {
          set: function(v){
            this.appJSData.value=v;
            this.iframe.src=v;
          },
          get: function(){
            return this.iframe.src;
          }
        });
        div.appendChild(frame);
        var button=document.createElement("button");
        button.div=div;
        button.onclick=function(){
          this.div.visible=false;
          if(window.onAction){
            window.onAction(this.div);
          }
        };
        button.style="position: absolute; right: 0; top: 0";
        button.innerHTML="x";
        div.appendChild(button);
        div.iframe=frame;
        div.closeButton=button;
        div.value=url;
        //$App.canvas.addElement(div,cx,cy,width,height);
        $App.$iframes.push(div);
        return div;
      },
      image: function (url,cx,cy,width,height){
        var b=$App.createElement("img");
        var asset=$App.assets[url];
        if(asset){
          var url=asset.url;
          if(!url.startsWith("data:")){
            url=(new URL(asset.url,document.baseURI)).href;
          }
          b.src=url;
        }else{
          b.src=url;
        }
        //$App.canvas.addElement(b,cx,cy,width,height);
        return b;
      },
      input: function (type,placeholdertext,cx,cy,width,height){
        //Legacy: wenn die ersten beiden argumente strings sind, passiert nichts, ansonsten wird type auf "text" gesetzt
        if(type!==undefined && type.split && placeholdertext!==undefined && placeholdertext.split){
        }else{
          return this.input("text",type,placeholdertext,cx,cy,width,height);
        }
        if(type) type=type.toLowerCase();
        if(type==="checkbox"){
          var b=$App.createElement("span");
          var cb=document.createElement("input");
          cb.type=type;
          var id=Math.floor(Math.random()*100000000);
          cb.id="checkbox-"+id;
          b.style="display: flex; text-align: center;align-items: center;justify-content: center;";
          b.appendChild(cb);
          b.box=cb;
          var label=document.createElement("label");
          label.htmlFor=cb.id;
          label.innerHTML=placeholdertext;
          b.appendChild(label);
          b.type="checkbox";
          Object.defineProperty(b,"disabled",{
            get: function(){
              return b.childNodes[0].disabled;
            },
            set: function(v){
              b.childNodes[0].disabled=v;
            }
          });
        }else if(type==="file"){
          var b=$App.createElement("input");
          b.type=type;
          //b.name="files[]";
          b.fr=new FileReader();
          b.fr.onload=(ev)=>{
            b.text=ev.target.result;
            b.text=b.text.replace(/\r\n/g,"\n");
            b.lines=b.text.split("\n");
            b.files[0].lineCount=b.lines.length;
            b.files[0].lines=b.lines;
            b.lineCount=b.files[0].lineCount;
          };
          b.onchange=function(ev){
            if(!this.files) return;
            let f=this.files[0];
            f.input=this;
            f.currentLine=0;
            this.fr.readAsText(f);
            f.nextLine=function(){
              let lines=this.input.lines;
              if(!lines||this.currentLine>=lines.length){
                return null;
              }
              this.currentLine++;
              return lines[this.currentLine-1];
            }
            this.currentLine=0;
            this.nextLine=f.nextLine;
          };
        }else if(type==="number"){
          var b=$App.createElement("input");
          b.type=type;
          b.step=0.00000000000000000001;
        }else{
          var b=$App.createElement("input");
          b.type=type;
        }
        Object.defineProperty(b,"value",{
          get: function(){
            if(b.type==="file"){
              return b.files[0];
            }
            if(b.type==="checkbox"){
              var valueProp=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"checked");
              var v=valueProp.get.call(b.box);
              return v;
            }
            var valueProp=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");
            var v=valueProp.get.call(b);
            if(b.type==="number"||b.type==="range"){
              return v*1;
            }else{
              return v;
            }
          },
          set: function(v){
            if(b.type==="checkbox"){
              var valueProp=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"checked");
              valueProp.set.call(b.box,v);
            }else{
              var valueProp=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value");
              valueProp.set.call(b,v);
            }
          }
        });
        b.placeholder=placeholdertext;
        b.style.textAlign="";
        //$App.canvas.addElement(b,cx,cy,width,height);
        return b;
      },
      datatable: function(array,cx,cy,width,height){
        var b=$App.createElement("div");
        var wrapper=document.createElement("div");
        wrapper.style.overflow="auto";
        wrapper.style.maxWidth="100%";
        b.style.overflow="hidden";
        wrapper.style.maxHeight="100%";
        b.table=document.createElement("table");
        b.table.className="datatable";
        b.table.style.minWidth="100%";
        b.table.style.minHeight="100%";
        b._showIndex=false;
        Object.defineProperty(b, 'showIndex', {
          set: function(v){
            this._showIndex=v;
            this.table.className=v? "datatable datatable-show-index": "datatable";
          },
          get: function(){
            return this._showIndex;
          }
        });
        wrapper.appendChild(b.table);
        b.appendChild(wrapper);
        b._array=null;
        b._rows;
        Object.defineProperty(b, 'array', {
          set: function(array) {
            this.value=-1;
            // if(array instanceof $App.Array){
            //   array=array.values;
            // } 
            while(this.table.firstChild){
              this.table.removeChild(this.table.firstChild);
            }
            b._rows=[];
            if(!array || array.length===0 || array[0]===null || array[0]===undefined) return;
            let obj=array[0];
            let stripQuotationMarks=false;
            if($App.language==="java" && "$data" in obj){
              obj=obj.$data;
              stripQuotationMarks=true;
            }
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
              if($App.language==="java" && "$data" in obj){
                obj=obj.$data;
              }
              let tr=document.createElement("tr");
              b._rows.push(tr);
              tr.index=i;
              tr.datatable=b;
              tr.onclick=function(){
                if(this.datatable.value===this.index){
                  this.datatable.value=-1;
                }else{
                  this.datatable.value=this.index;
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
          },
          get: function(){
            return this._options;
          }
        });
        b.selectedIndex=-1;
        Object.defineProperty(b, 'value', {
          /*selected index*/ 
          set: function(index) { 
            if(this.selectedIndex>=0){
              var tr=this._rows[this.selectedIndex];
              if(tr){
               tr.classList.remove("selected");
              }
            }
            this.selectedIndex=index;
            if(index>=0){
              var tr=this._rows[this.selectedIndex];
              if(tr){
               tr.classList.add("selected");
              }
            }
          },
          get: function(){
            return this.selectedIndex;
          }
        });
        b.array=array;
        //$App.canvas.addElement(b,cx,cy,width,height);
        return b;
      },
      textarea: function (placeholdertext,cx,cy,width,height){
        var b=$App.createElement("textarea");
        b.placeholder=placeholdertext;
        b.style.resize="none";
        //$App.canvas.addElement(b,cx,cy,width,height);
        b.style.textAlign="";
        return b;
      },
      select: function (options,cx,cy,width,height){
        var b=$App.createElement("select");
        b.options=options;
        //$App.canvas.addElement(b,cx,cy,width,height);
        return b;
      },
      label: function(text,cx,cy,width,height){
        var b=$App.createElement("div");
        b.style.overflow="auto";
        b.style.display="grid";
        b.$standardPositionValue="relative";
        //$App.canvas.addElement(b,cx,cy,width,height);
        Object.defineProperty(b,'value', {
          set: function(v){
            this.appJSData.value=v;
            this.innerHTML=v;
            //this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height);
          },
          get: function(){
            return this.appJSData.value;
          }
        });
        b.value=text;
        //b.updateAlignContent();
        b.updatePosition();
        return b;
      },
      label2: function(text,cx,cy,width,height){
        var b=$App.createElement("span");
        b.style.overflow="auto";
        b.style.display="flex";
        b.$standardPositionValue="relative";
        var innerDiv=document.createElement("span");
        b.innerDiv=innerDiv;
        b.appendChild(innerDiv);
        b.style.textAlign="center";
        //$App.canvas.addElement(b,cx,cy,width,height);
        Object.defineProperty(b,'value', {
          set: function(v){
            this.appJSData.value=v;
            this.innerDiv.innerHTML=v;
            //this.updatePosition(this.appJSData.cx,this.appJSData.cy, this.appJSData.width, this.appJSData.height);
          },
          get: function(){
            return this.appJSData.value;
          }
        });
        b.value=text;
        b.updateAlignContent();
        b.updatePosition();
        return b;
      },
      html: function(text,cx,cy,width,height){
        var b=$App.createElement("div");
        b.style.overflow="auto";
        b.$standardPositionValue="relative";
        //$App.canvas.addElement(b,cx,cy,width,height);
        Object.defineProperty(b,'value', {
          set: function(v){
            this.appJSData.value=v;
            this.innerHTML=v;
          },
          get: function(){
            return this.appJSData.value;
          }
        });
        b.value=text;
        b.updateAlignContent();
        b.updatePosition();
        return b;
      }
    },'Erlaubt das Hinzufuegen und Manipulieren der grafischen Benutzeroberflaeche (UI).',[
      {
        name: 'iframe', 
        returnType: 'IFrame',
        args: [{name: 'url', type: 'String', info: 'Webadresse der eingebetteten Webseite'}],
        info: 'Erzeugt ein neues iFrame, mit dem man eine Website in die eigene App einbetten kann.'
      },
      {
        name: 'button', 
        returnType: 'JButton',
        args: [{name: 'text', type: 'String', info: 'Aufschrift des Buttons'}],
        info: 'Erzeugt einen neuen Button mit der Aufschrift <code>text</code>, dem Mittelpunkt (<code>cx</code>|<code>cy</code>), der Breite <code>width</code> und der Hoehe <code>height</code>. Liefert den Button zurueck.'
      },
      {
        name: 'panel', 
        returnType: 'JPanel',
        args: [{name: 'template', type: 'String', info: 'Definition der Zeilen und Spalten des Panels. "" oder null bedeutet, dass es keine Spalten und Zeilen gibt. "3" bedeutet "3 gleich breite Spalten", "2fr 1fr" bedeutet "2 Spalten, die erste doppelt so breit wie die zweite". Hier sind alle Werte moeglich, die auch fuer die CSS-Eigenschaften "grid-template" oder "grid-template-columns" verwendet werden koennen.'}],
        info: 'Erzeugt ein neues Panel, ein Container fuer andere Elemente.'
      },
      {
        name: 'image', 
        returnType: 'JImage',
        args: [{name: 'url', type: 'String', info: 'URL zum Bild'}],
        info: 'Erzeugt ein neues Bild von der URL <code>url</code>, dem Mittelpunkt (<code>cx</code>|<code>cy</code>), der Breite <code>width</code> und der Hoehe <code>height</code>. Liefert das Bild zurueck.'
      },
      {
        name: 'input',
        language: 'js', 
        returnType: 'Input',
        args: [
          {
            name: 'text',
            type: 'String', 
            info: 'Art des Inputs'
          },
          {
            name: 'placeholdertext',
            type: 'String', 
            info: 'Text, der angezeigt wird, wenn das Element leer ist.'
          }
        ],
        info: 'Erzeugt ein neues Eingabefeld, in das der User etwas eingeben kann. Mit <code>type</code> legst du fest, was der User eingeben soll (normalerweise <code>"text"</code> oder <code>"number"</code>, es gibt aber <a href="https://www.w3schools.com/html/html_form_input_types.asp" target="_blank">noch viel mehr</a>). Du kannst ausserdem den Platzhaltertext <code>placeholdertext</code>, den Mittelpunkt (<code>cx</code>|<code>cy</code>), die Breite <code>width</code> und die Hoehe <code>height</code> festlegen. Liefert das Eingabefeld zurueck.'
      },
      {
        name: 'datatable',
        language: 'js', 
        returnType: 'Datatable',
        args: [
          {
            name: 'array',
            type: {
              baseType: 'Object',
              dimension: 1
            }, 
            info: 'Array mit Objekten, die dargestellt werden sollen'
          }
        ],
        info: 'Erzeugt eine neue Datatable, mit der du die Elemente eines Arrays anzeigen kannst.'
      },
      {
        name: 'textfield',
        language: 'java',
        returnType: 'JTextField',
        args: [
          {
            name: 'placeholdertext',
            type: 'String', 
            info: 'Text, der angezeigt wird, wenn das Element leer ist.'
          }
        ],
        info: 'Erzeugt ein neues Eingabefeld, in das der User Text eingeben kann. Du kannst den Platzhaltertext <code>placeholdertext</code>, den Mittelpunkt (<code>cx</code>|<code>cy</code>), die Breite <code>width</code> und die Hoehe <code>height</code> festlegen. Liefert das Element zurueck.'
      },
      {
        name: 'textarea', 
        returnType: 'JTextArea',
        args: [
          {
            name: 'placeholdertext',
            type: 'String', 
            info: 'Text, der angezeigt wird, wenn das Element leer ist.'
          }
        ],
        info: 'Erzeugt eine neue TextArea mit dem Platzhaltertext <code>placeholdertext</code>, dem Mittelpunkt (<code>cx</code>|<code>cy</code>), der Breite <code>width</code> und der Hoehe <code>height</code>. Liefert die TextArea zurueck.'
      },
      {
        name: 'select',
        returnType: 'JCombobox',
        args: [
          {
            name: 'options',
            type: 'String[]', 
            info: 'Optionen, die zur Auswahl stehen'
          }
        ],
        info: 'Erzeugt ein neues Select-Element mit den Auswahl-Optionen <code>options</code> (ein  Array), dem Mittelpunkt (<code>cx</code>|<code>cy</code>), der Breite <code>width</code> und der Hoehe <code>height</code>. Liefert das Select-Element zurueck.'
      },
      {
        name: 'label',
        returnType: 'JLabel',
        args: [
          {
            name: 'text',
            type: 'String', 
            info: 'Art des Inputs'
          }
        ], 
        info: 'Erzeugt ein neues Label mit dem Inhalt <code>text</code>, dem Mittelpunkt (<code>cx</code>|<code>cy</code>), der Breite <code>width</code> und der Hoehe <code>height</code>. Liefert das Label zurueck.'
      }
    ],'');
    
  
    $App.addObject('world',true,{
      delete: function(){
        $App.world.reset();
      },
      toString: function(){
        return $App.world.toString();
      },
      create: function(width,height){
        $App.world.create(width,height);
      },
      addRow: function(description){
        $App.world.addRow(description);
      },
      setup: function(description){
        $App.world.setup(description);
      },
      replaceTypes: function(oldType,newType){
        $App.world.replaceTypes(oldType,newType);
      },
      draw: async function(cx,cy,width,height){
        if($App.debug.enabled){
          await $App.world.drawAsync(cx,cy,width,height);
        }else{
          $App.world.draw(cx,cy,width,height);
        }
      },
      scroll(cx,cy){
        $App.world.setCenter(cx,cy);
      },
      scrollBy(dx,dy){
        $App.world.moveCenter(dx,dy);
      },
      zoom: function(factor){
        $App.world.setZoom(factor);
      },
      write: function(text,x,y,align){
        $App.world.write(text,x,y,align);
      },
      drawRect: function(x,y,w,h){
        $App.world.paintRect(x,y,w,h,false);
      },
      fillRect: function(x,y,w,h){
        $App.world.paintRect(x,y,w,h,true);
      },
      drawCircle: function(cx,cy,r,fill){
        $App.world.paintCircle(cx,cy,r,false);
      },
      fillCircle: function(cx,cy,r,fill){
        $App.world.paintCircle(cx,cy,r,true);
      },
      drawImage: function(asset,x,y,w,h,rotation,mirrored){
        $App.world.drawImage(asset,x,y,w,h,rotation,mirrored);
      },
      drawImagePart: function(asset,x,y,w,h,sx,sy,sw,sh,rotation,mirrored){
        $App.world.drawImage(asset,x,y,w,h,rotation,mirrored,sx,sy,sw,sh);
      },
      getType: function(x,y){
        return $App.world.getType(x,y);
      },
      setType: function(x,y,newType){
        $App.world.setType(x,y,newType);
      },
      setInfo: function(x,y,newInfo){
        $App.world.setInfo(x,y,newInfo);
      },
      getInfo: function(x,y){
        return $App.world.getInfo(x,y);
      },
      get mouseX(){
        if(!$App.canvas) return null;
        var c=$App.canvas.getCanvasX($App.mouse.x);
        var w=$App.world.getWorldBounds(c,0,0,0);
        return w.x;
      },
      get mouseY(){
        if(!$App.canvas) return null;
        var c=$App.canvas.getCanvasY($App.mouse.y);
        var w=$App.world.getWorldBounds(0,c,0,0);
        return w.y;
      },
      get mouseDown(){
        return $App.mouse.down;
      },
      mouseInRect(cx,cy,width,height){
        if(!$App.canvas) return false;
        var x=$App.canvas.getCanvasX($App.mouse.x);
        var y=$App.canvas.getCanvasY($App.mouse.y);
        var w=$App.world.getWorldBounds(x,y,0,0);
        x=w.x;
        y=w.y;
        return (x>=cx-width/2 && x<=cx+width/2 && y>=cy-height/2 && y<=cy+height/2);
      },
      mouseInCircle(cx,cy,r){
        if(!$App.canvas) return false;
        var x=$App.canvas.getCanvasX($App.mouse.x);
        var y=$App.canvas.getCanvasY($App.mouse.y);
        var w=$App.world.getWorldBounds(x,y,0,0);
        x=w.x;
        y=w.y;
        return ((x-cx)*(x-cx)+(y-cy)*(y-cy)<=r*r);
      }
    },'Erlaubt es, eine zweidimensionale Spielwelt zu verwenden, die aus einzelnen quadratischen Feldern (sog. "Tiles" = "Fliesen") besteht.',
    [
      {
        name: 'setup',
        returnType: null,
        args: [{name: 'description', type: 'String', info: 'Dieser Text definiert die Felder der Spielwelt: Jede Zeile definiert eine Zeile der Spielwelt.'}],
        info: 'Definiert die Felder (Tiles) der Spielwelt.'
      }, 
      {
        name: 'getType',
        returnType: "String", 
        args: [
          {name: 'x', type: 'double', info: 'x-Koordinate in der Welt'},
          {name: 'y', type: 'double', info: 'y-Koordinate in der Welt'}
        ],
        info: 'Gibt den Typ (das Zeichen) an der angegebenen Position zurueck. Falls es an der Position kein eindeutiges Zeichen gibt, wird null zurueckgegeben.'
      },
      {
        name: 'delete',
        returnType: null, 
        info: 'Loescht die aktuelle Spielwelt, damit z. B. eine neue erschaffen werden kann.'
      }, 
      {
        name: 'setType', 
        returnType: null,
        args: [
          {name: 'x', type: 'double', info: 'x-Koordinate in der Welt'},
          {name: 'y', type: 'double', info: 'y-Koordinate in der Welt'},
          {name: 'newType', type: 'String', info: 'Neuer Typ'}
        ],
        info: 'Aendert den Typ (das Zeichen) an der angegebenen Position.'
      },
      {
        name: 'getInfo',
        returnType: "String", 
        args: [
          {name: 'x', type: 'double', info: 'x-Koordinate in der Welt'},
          {name: 'y', type: 'double', info: 'y-Koordinate in der Welt'}
        ],
        info: 'Gibt die Information an der angegebenen Position zurueck.'
      }, 
      {
        name: 'setInfo', 
        returnType: null,
        args: [
          {name: 'x', type: 'double', info: 'x-Koordinate in der Welt'},
          {name: 'y', type: 'double', info: 'y-Koordinate in der Welt'},
          {name: 'newInfo', type: 'String', info: 'Neuer Typ'}
        ],
        info: 'Ã„ndert die Information an der angegebenen Position.'
      },
      {
        name: 'create',
        returnType: null,
        args: [
          {name: 'width', type: 'int', info: 'Anzahl Felder nebeneinander'},
          {name: 'height', type: 'int', info: 'Anzahl Felder untereinander'}
        ],
        info: 'Erschafft eine neue Spielwelt der angegebenen Groesse. Alle Typen werden auf " " gesetzt.'
      },
      {
        name: 'addRow',
        returnType: null,
        args: [{name: 'description', type: 'String', info: 'Dieser Text definiert die Felder der neuen Zeile.'}],
        info: 'Fuegt der Spielwelt eine neue Zeile hinzu.'
      },
      {
        name: 'replaceTypes',
        returnType: null,
        args: [
          {name: 'oldType', type: 'String', info: 'Felder mit diesem Typ erhalten den neuen Typ.'},
          {name: 'newType', type: 'String', info: 'Der neue Typ, den die Felder erhalten.'}
        ],
        info: 'Ã„ndert den Typ von allen Felder eines bestimmten Typs.'
      },
      {
        name: 'draw',
        returnType: null,
        args: [],
        info: 'Zeichnet die Welt. Implementiere die Funktion "onTileDraw", um zu festzulegen, wie die Felder gezeichnet werden sollen.'
      },
      {
        name: 'scroll',
        returnType: null, 
        args: [
          {name: 'cx', type: 'double', info: 'x-Koordinate, zu der gescrollt wird'},
          {name: 'cy', type: 'double', info: 'y-Koordinate, zu der gescrollt wird'}
        ],
        info: 'Verschiebt die Welt so, dass der angegebene Punkt im Mittelpunkt des Bildschirms liegt.'
      },
      {
        name: 'scrollBy',
        returnType: null, 
        args: [
          {name: 'dx', type: 'double', info: 'Scroll-Weite in x-Richtung'},
          {name: 'dy', type: 'double', info: 'Scroll-Weite in y-Richtung'}
        ],
        info: 'Verschiebt die Welt um die angegebenen Zahlen.'
      },
      {
        name: 'zoom',
        returnType: null, 
        args: [
          {name: 'factor', type: 'double', info: 'Die Staerke des Zoomens: 1 fuer Einpassung der Welt in den Bildschirm.'}
        ],
        info: 'Legt fest, wie weit in die Welt hinein- bzw. herausgezoomt wird.'
      },
      {
        name: 'write',
        returnType: null, 
        args: [
          {name: 'text', type: 'String', info: 'Der Text, der geschrieben werden soll. Verwende <code>&bsol;n</code> fuer Zeilenumbrueche.'}, {name: 'x', type: 'double', info: 'Die x-Koordinate des Texts.'}, {name: 'y', type: 'double', info: 'Die y-Koordinate des Texts.'}, {name: 'align', type: 'String', info: 'Eine Angabe aus bis zu 2 Woertern, die bestimmen, wie der Text am Punkt (<code>x</code>|<code>y</code>) ausgerichtet sein soll. Moegliche Woerter: <code>"left"</code>, <code>"center"</code>, <code>"right"</code> und <code>"top"</code>, <code>"middle"</code>, <code>"bottom"</code>.', hide: true}
        ],
        info: 'Schreibt Text in die Spielwelt.'
      },
      {
        name: 'drawRect',
        returnType: 'Path', 
        args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
        info: 'Zeichnet ein Rechteck in die Spielwelt und gibt dieses zurueck.'
      },
      {
        name: 'fillRect',
        returnType: 'Path', 
        args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
        info: 'Zeichnet ein ausgefuelltes Rechteck in die Spielwelt und gibt dieses zurueck.'
      },
      {
        name: 'drawCircle',
        returnType: 'Path', 
        args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
        info: 'Zeichnet einen Kreis in die Spielwelt und gibt dieses zurueck.'
      },
      {
        name: 'fillCircle',
        returnType: 'Path', 
        args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
        info: 'Zeichnet einen ausgefuellten Kreis in die Spielwelt und gibt dieses zurueck.'
      },
      {
        name: 'drawImage',
        returnType: null, 
        args: [{name: 'image', type: 'String', info: 'Bild-Asset. Muss vorher mittels <a href="#help-loadAsset"><code>loadAsset</code></a> geladen werden.'},{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}, {name: 'rotation', type: 'double', info: 'Winkel, um den das Bild gedreht werden soll.', hide: true}, {name: 'mirrored', type: 'boolean', info: 'true, wenn das Bild vertikal gespiegelt werden soll.', hide: true}],
        info: 'Zeichnet ein Bild in die Spielwelt. Dieses musst du vorher mittels "loadAsset" laden.'
      },
      {
        name: 'drawImagePart',
        returnType: null, 
        args: [{name: 'image', type: 'String', info: 'Bild-Asset. Muss vorher mittels <a href="#help-loadAsset"><code>loadAsset</code></a> geladen werden.'},{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'},{name: 'scx', type: 'double', info: 'x-Koordinate des Mittelpunkts des Ausschnittes.'}, {name: 'scy', type: 'double', info: 'y-Koordinate des Mittelpunkts des Ausschnittes.'}, {name: 'width', type: 'double', info: 'Breite des Ausschnittes.'}, {name: 'height', type: 'double', info: 'Hoehe des Ausschnittes.'}, {name: 'rotation', type: 'double', info: 'Winkel, um den das Bild gedreht werden soll.', hide: true}, {name: 'mirrored', type: 'boolean', info: 'true, wenn das Bild vertikal gespiegelt werden soll.', hide: true}],
        info: 'Zeichnet einen rechteckigen Ausschnitt eines Bild in die Spielwelt. Dieses musst du vorher mittels "loadAsset" laden.'
      },
      {
        name: 'mouseX',
        type: 'double',
        info: 'Die aktuelle x-Koordinate der Maus innerhalb der Spielwelt.'
      },
      {
        name: 'mouseY',
        type: 'double',
        info: 'Die aktuelle y-Koordinate der Maus innerhalb der Spielwelt.'
      },
      {
        name: 'mouseDown',
        type: 'boolean',
        info: 'Ist die Maus aktuell gedrueckt oder nicht (entspricht mouse.down).'
      },
      {
        name: 'mouseInRect',
        returnType: 'boolean', 
        args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'width', type: 'double', info: 'Breite.'}, {name: 'height', type: 'double', info: 'Hoehe.'}],
        info: 'Prueft, ob sich die Maus aktuell innerhalb eines Rechtecks in der Spielwelt befindet.'
      },
      {
        name: 'mouseInCircle',
        returnType: 'boolean', 
        args: [{name: 'cx', type: 'double', info: 'x-Koordinate des Mittelpunkts.'}, {name: 'cy', type: 'double', info: 'y-Koordinate des Mittelpunkts.'}, {name: 'r', type: 'double', info: 'Radius.'}],
        info: 'Prueft, ob sich die Maus aktuell innerhalb eines Kreises in der Spielwelt befindet.'
      }
    ],'');
  
    //console.realLog=console.log;
    console.realClear=console.clear;
    $App.addObject('console',true,{
      println: function(){
        console.log.apply(console,arguments);
        $App.console.log.apply($App.console,arguments);
      },
      print: function(){
        console.log.apply(console,arguments);
        $App.console.print.apply($App.console,arguments);
      },
      clear: function(){
        console.realClear();
        $App.console.clear();
      },
      show: function(){
        $App.showConsoleOnStart=true;
        $App.console.setVisible(true);
      },
      hide: function(){
        $App.showConsoleOnStart=false;
        $App.console.setVisible(false);
      },
      readLine: function(text){
        $App.console.readLine(text);
      }
    },'Erlaubt die Benutzung der Konsole.',
    [
      {
        name: 'log',
        returnType: null,
        args: [{name: 'text', type: 'String', info: 'Text, der ausgegeben werden soll.'}],
        info: 'Gibt den <code>text</code> in der Konsole aus.'
      }, 
      {
        name: 'show',
        returnType: null, 
        info: 'Zeigt die Konsole an.'
      }, 
      {
        name: 'hide', 
        returnType: null,
        info: 'Verbirgt die Konsole.'
      },
      {
        name: 'clear', 
        returnType: null,
        info: 'Verbirgt die Konsole.'
      },
      {
        name: "readLine",
        args: [{name: "prompt", type: 'String', info: 'Text, der als Aufforderung angezeigt wird.', optional: true }],
        returnType: "String",
        info: "Fordert den User auf, eine Zeile Text einzugeben."
      }
    ],'',"everywhere");
    
    $App.help.compileScreen();
    
    $App.setup(true);
    
    if($App.language==="js"){
      /**Vordefinierte Variablennamen speichern:*/
      $App.systemVariables={
        __VUE_DEVTOOLS_IFRAME__: true
      };
      (function(){
        for(var a in window){
          $App.systemVariables[a]=true;
        }
      })();
    }else{
      $main=null;
    }

}