
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
      enableOnNextFrame: false,
      language: window.language? window.language:'js',
      setupData: null,
      lazyLoading: false,
      $sharedVariables: null,
      $iframes: [],
      resizeObserver: null,
      watchedObject: null,
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
      gameloop: {
        FPS: 60,
        currentFrame: 0,
        startTime: Date.now(),
        MAX_FRAMES: 1000000,
        customHandler: null,
        updatePhysicalGamepads: function(){
          let gps=navigator.getGamepads();
          let index=0;
          for(let i=0;i<gps.length;i++){
            let g=gps[i];
            if(!g) continue;
            let vg=$App.$gamepads[index];
            index++;
            if(!vg) return;
            vg.updatePhysicalGamepad(g);
          }
        },
        handler: async function(){
          this.updatePhysicalGamepads();
          let now=Date.now();
          let dt=now-this.startTime;
          if(dt*this.FPS>900){
            this.startTime=now;
            if((window.onNextFrame||this.customHandler) && !$App.debug.paused && $App.enableOnNextFrame){
              if(this.customHandler){
                try{
                  await this.customHandler.run();
                }catch(e){
                  $App.handleException(e);
                }
              }else{
                try{
                  await window.onNextFrame();
                }catch(e){
                  $App.handleException(e);
                }
              }
            }
          }
          
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
        resetCallDepth: function(){
          this.callDepth=0;
        },
        incCallDepth: function(){
          this.callDepth++;
        },
        decCallDepth: function(){
          if(this.callDepth>0){
            this.callDepth--;
          }else{
            this.callDepth=0;
          }

        },
        getCallDepth: function(){
          return this.callDepth;
        },
        isCallDepthZero: function(){
          return this.callDepth===0;
        },
        resolve: null,
        mainTemplate: {},
        line: async function(line,name, $scope){
          if(window===window.top) return;
          this.$scope=$scope;
          this.lastLine=line;
          this.lastName=name;
          if(this.paused || this.breakpoints[line]===name || this.isCallDepthZero() && this.stepAbove){
            //console.log("pause",this.isCallDepthZero(),this.paused, this.stepAbove);
            this.paused=true;
            this.stepAbove=false;
            this.resetCallDepth();
            if($App.body.overlay){
              $App.body.overlay.style.display='';
            }
            console.log("post debug pause");
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
            $App.debug.resetCallDepth();
          }else if(data.type==="debug-step-above"){
            console.log("step above");
            this.paused=false;
            this.stepAbove=true;
            $App.debug.resetCallDepth();
            this.resolve();
          }else if(data.type==="getScope"){
            console.log("get scope",this.$scope);
            let $scope=this.$scope.getData(JSON.parse(data.template));
            console.log("getScope",data.template);
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
      ui: null,
      showConsoleOnStart: true,
      hideConsoleIfUIPresentAfterSetup: false
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
    
    
    $App.setup=async function(dontStart){
      this.loadAssets();
      
      if(!dontStart && document.body){
        this.resizeObserver=new ResizeObserver((entries)=>{
          for(const entry of entries){
            //const boxSize=entry.borderBoxSize;
            entry.target.resize();
          }
        });
        this.body.element=document.body;
        this.body.element.style="padding: 0; margin: 0; width: 100%; height: 100%; overflow: hidden;";
        this.body.element.parentElement.style=this.body.element.style;
        
        var root=document.createElement("div");
        this.body.root=root;
        root.style="position: fixed;width:100%;height:100%";
        root.className="app-root";
        root.id="app-root";
        
        this.body.element.appendChild(root);
        let left=document.createElement("div");
        left.style="position: absolute; width: 30%; height: 100%; left: 0; top: 0; display: none; z-index: 100;";
        let right=document.createElement("div");
        right.style="position: absolute; width: 100%; height: 100%; right: 0; top: 0; display: grid; box-sizing: border-box";
        right.$canvas=this.canvas;
        this.body.right=right;
        root.appendChild(left);
        root.appendChild(right);
        left.appendChild(this.console.element);
        this.ui=document.createElement("div");
        this.ui.className="main-ui-container";
        this.ui.style="width: 100%; height: 100%;";
        right.appendChild(this.ui);
        this.body.overlay=document.createElement("div");
        this.body.overlay.style="display: none; position: absolute; width: 100%; height: 100%; top: 0; right: 0; background-color: #00000030";
        right.appendChild(this.body.overlay);
        this.toast=new $App.Toast(right);
        
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
          await $App.gameloop.handler();
          //this.gamepad.updatePhysicalGamepad();
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
        //this.addMouseStateHandler(this.canvas.el);
        this.console.element.focus();
        
      }else{
        setTimeout(()=>{
          this.setup();
        },10);
      }
    }
    
    $App.setWatchedObject=function(obj){
      this.watchedObject=obj;
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
        //$App.canvas.resize(w,h);
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
      if($App.console.readResolve){
        $App.console.readResolve(k);
      }
      var kb=$App.keyboard;
      kb.down[k]=true;
      if(kb.lastKeycodeDown!==k){
        kb.lastKeycodeDown=k;
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
      if($App.debug.paused) return;
      if(window.onKeyUp){
        try{
          window.onKeyUp(k);
        }catch(e){
          $App.handleException(e);
        }
      }
    };
    
    
    
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
      },false);
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
      },false);
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
      },false);
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
      this.rightReducedWidth="70%";
      this.leftZIndex=100;
      this.element=document.createElement("div");
      this.element.onclick=()=>{
        if(this.readResolve){
          this.readResolve(0);
          this.element.focus();
          return;
        }
        if(!this.readInput) return;
        this.readInput.focus();
      };
      this.element.style="font-family: monospace; font-size: 1rem; overscroll-behavior: none; width: 100%; height: 100%; background-color: #222222; color: white;";
      this.element.className="console";
      this.items={};
      this.localItems={};
      this.watchedVariables=[];
      this.visible=false;
      this.readResolve=null;
      this.output=[];
      this.outputDiv=document.createElement("div");
      this.outputDiv.style="height: 100%; overflow: auto;";
      this.element.appendChild(this.outputDiv);
      this.nextLine();
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
      nextLine: function(){
        this.currentLineDiv=document.createElement("div");
        this.currentLineDiv.style.whiteSpace="pre-wrap";
        this.currentLineDiv.style.minHeight="2ex";
        this.outputDiv.appendChild(this.currentLineDiv);
        this.outputDiv.scrollTop=this.outputDiv.scrollHeight;
        this.outputDiv.scrollLeft=0;
        //this.output+="\n";
        this.output.push("");
      },
      getTextContent(){
        return this.output;
      },
      /**println */
      log: function(){
        let div=this.currentLineDiv;
        let args=[];
        for(let i=0;i<arguments.length;i++){
          let obj=arguments[i];
          if(obj===undefined) obj="";
          let item;
          if(typeof obj==="object"){
            item=$App.console.createConsoleItem(null,false,true);
            item.update(obj);
            item=item.element;
          }else{
            item=document.createElement("span");
            //item.style.marginRight="1em";
            item.textContent=obj;
          }
          this.output[this.output.length-1]+=item.textContent;
          div.appendChild(item);
        }
        this.nextLine();
        //this.outputDiv.appendChild(div);
      },
      print: function(){
        let div=this.currentLineDiv;
        for(let i=0;i<arguments.length;i++){
          let obj=arguments[i];
          if(obj===undefined) obj="";
          let item;
          if(typeof obj==="object"){
            item=$App.console.createConsoleItem(null,false,true);
            item.update(obj);
            item=item.element;
          }else{
            item=document.createElement("span");
            //item.style.marginRight="1em";
            item.textContent=obj;
          }
          this.output[this.output.length-1]+=item.textContent;
          div.appendChild(item);
        }
        //this.outputDiv.appendChild(div);
        
      },
      read: async function(){
        let p=new Promise((resolve,reject)=>{
          this.readResolve=resolve;
        });
        let res=await p;
        this.readResolve=null;
        return res;
      },
      readLine: async function(prompt){
        if(prompt) this.print(prompt);
        let inp=document.createElement("input");
        this.readInput=inp;
        inp.type="text";
        inp.style="width: 2em; background-color: #222222; outline: none;border: none; color: white; box-sizing: border-box;font-family: monospace; padding: 0; margin: 0;";
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
          let e=document.createElement("span");
          let v=this.value;
          e.textContent=v;
          this.replaceWith(e);
          this.resolve(v);
        };
        let p=new Promise((resolve,reject)=>{
          inp.resolve=resolve;
        });
        let q=await p;
        this.nextLine();
        return q;
      },
      clear: function(){
        while(this.outputDiv.firstChild){
          this.outputDiv.removeChild(this.outputDiv.firstChild);
        }
        this.log("");
        this.output=[""];
      },
      update: function(){
        //console.log("update global 1");
        if(window.parent!==window && !$App.debug.paused){
          let data=$getMainData();
          if(data){
            window.parent.postMessage({
              type: "update-scope-main",
              data
            },"*");
          }
        }
        // if($App.language==="js"){
        //   this.updateFromObject(window,sharedVariables);
        // }else if($App.language==="java"){
        //   this.updateFromObject($App.debug.object? $App.debug.object : $main,sharedVariables);
        // }
        // if(window.parent!==window && sharedVariables){
        //   window.parent.postMessage({
        //     type: "update-shared-variables",
        //     sharedVariables: sharedVariables
        //   },"*");
        // }
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
      hideIfUI: function(){
        let parent=this.element.parentElement;
        if(parent){
          let right=parent.nextElementSibling;
          if($App.ui.firstChild){
            this.setVisible(false);
          }
        }
      },
      setVisible: function(v){
        this.rightReducedWidth="70%";
        this.leftZIndex=100;
        this.visible=v;
        let parent=this.element.parentElement;
        if(parent){
          parent.style.display=v? "block": "none";
          this.adaptSize();
        }
      },
      adaptSize: function(){
        let parent=this.element.parentElement;
        if(parent){
          parent.style.zIndex=this.leftZIndex;
          let right=parent.nextElementSibling;
          if(!$App.ui.firstChild){
            right.style.width="0%";
            parent.style.width="100%";
          }else{
            parent.style.width="30%";
            if(this.visible){
              right.style.width=this.rightReducedWidth;
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
    };
    
    $App.addEventHandler=function addEventHandler(name,args,info,details){
      
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
    $App.addEventHandler("onGamepad",[{name: 'button', type: 'String', info: 'Der Name des Buttons, der gedrueckt wurde, also z. B. "A" oder "Y" oder "left".'}],'Wird ausgefuehrt, wenn der Benutzer einen Teil des Gamepads beruehrt oder die zugeordnete Taste auf der Tastatur drueckt.','');
    $App.addEventHandler("onGamepadRelease",[{name: 'button', type: 'String', info: 'Der Name des Buttons, der losgelassen wurde, also z. B. "A" oder "Y" oder "left".'}],'Wird ausgefuehrt, wenn der Benutzer die Beruehrung des Gamepads beendet oder aufhoert, die zugeordnete Taste auf der Tastatur zu druecken.','');
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
    },'Erlaubt das Speichern und Laden von Daten.',
    [
      {name: 'keys', type: { baseType: 'String', dimension: 1}, info: 'Ein String-Array mit allen Keys, die von der App verwendet werden.'},
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
        return (new Date()).getSeconds();
      },
      get min(){
        return (new Date()).getMinutes();
      },
      get h(){
        return (new Date()).getHours();
      },
      get day(){
        return (new Date()).getDate();
      },
      get month(){
        return (new Date()).getMonth()+1;
      },
      get year(){
        return (new Date()).getFullYear();
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
      {name: 'sec', info: 'Die Sekundenzahl der aktuellen Uhrzeit (0-59).', type: 'int'},
      {name: 'min', type: 'int', info: 'Die Minutenzahl der aktuellen Uhrzeit (0-59).'},
      {name: 'h', type: 'int', info: 'Die Stundenzahl der aktuellen Uhrzeit (0-23).'},
      {name: 'day', type: 'int', info: 'Der aktuelle Tag im Monat (1-31).'},
      {name: 'month', type: 'int', info: 'Der aktuelle Monat (1-12).'},{name: 'year', type: 'int', info: 'Die aktuelle Jahreszahl.'}, 
    ], "everywhere");
    
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
  
    //console.realLog=console.log;
    console.realClear=console.clear;
    
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
    var gamepad;
}