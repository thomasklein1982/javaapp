
import { Java } from "../language/java";
import { htmlLanguage } from "@codemirror/lang-html";
//import {Tree, MountedTree, InnerParse, TreeNode, checkRanges, Range, materialize, enterFragments} from "@lezer/common";

export class SourceFile{
  constructor(name,fileType,project){
    this.name=name;
    this.fileType=fileType;
    this.useGlobalCSS=true;
    this.project=project;
    this.attributeErrors=null;
    this.errors=[];
    this.isHidden=false;
    this.superClazz=Java.clazzes.HtmlPage;
    /**der erste Kindknoten des ClassBody: */
    this.src="";
  }
  getSaveObject(){
    let o={};
    o.name=this.name;
    o.src=this.src;
    o.isHidden=this.isHidden;
    o.fileType=this.fileType;
    o.useGlobalCSS=this.useGlobalCSS;
    return o;
  }

  restoreFromSaveObject(obj){
    if(obj.name){
      this.name=obj.name;
    }else{
      this.name=null;
    }
    if(obj.src){
      this.src=obj.src;
    }else{
      this.src="";
    }
    if(obj.useGlobalCSS){
      this.useGlobalCSS=obj.useGlobalCSS;
    }else{
      this.useGlobalCSS=true;
    }
    this.fileType=obj.fileType;
    this.isHidden=false;
    if(obj.isHidden){
      this.isHidden=true;
    }
  }
  compile(){
    
  }
  compileDeclaration(){}
  compileDeclarationTypeParameters(){}
  compileMemberDeclarations(){}
  compileMethods(){}
  resolveSuperClazz(){}
  generateSrcAndTree(){}
  getMethodByPosition(){}
  getRealSuperClazz(){
    return this.superClazz;
  }
  getRuntimeInfos(){ }
  hasStaticMainMethod(){
    return false;
  }
  getAllAttributeNames(){
    return [];
  }
  isUIClazz(){return false;}
  isNative(){return false;}
  getStringifiedSourceCode(){
    let src=this.src;
    if(this.useGlobalCSS && this.project.css.trim().length>0){
      let css=this.project.prepareCSS(this.project.css);
      let pos=src.indexOf("<head");
      if(pos>=0){
        pos=src.indexOf(">",pos+1);
        if(pos>=0){

          src=src.substring(0,pos+1)+"\n<style>\n"+css+"\n</style>\n"+src.substring(pos+1);
        }
      }
    }
    // htmlLanguage.parser.parse=function parse(input, fragments, ranges) {
    //   let parse = this.startParse(input, fragments, ranges);
    //   console.log("hijacked");
    //   parse.startInner=function startInner() {
    //     console.log("startInner");
    //     let fragmentCursor = new FragmentCursor(this.fragments);
    //     let overlay = null;
    //     let covered = null;
    //     let cursor = new TreeCursor(new TreeNode(this.baseTree, this.ranges[0].from, 0, null), IterMode.IncludeAnonymous | IterMode.IgnoreMounts);
    //     scan: for (let nest, isCovered; ; ) {
    //       let enter = true, range;
    //       if (this.stoppedAt != null && cursor.from >= this.stoppedAt) {
    //         enter = false;
    //       } else if (fragmentCursor.hasNode(cursor)) {
    //         if (overlay) {
    //           let match = overlay.mounts.find((m) => m.frag.from <= cursor.from && m.frag.to >= cursor.to && m.mount.overlay);
    //           if (match)
    //             for (let r of match.mount.overlay) {
    //               let from = r.from + match.pos, to = r.to + match.pos;
    //               if (from >= cursor.from && to <= cursor.to && !overlay.ranges.some((r2) => r2.from < to && r2.to > from))
    //                 overlay.ranges.push({ from, to });
    //             }
    //         }
    //         enter = false;
    //       } else if (covered && (isCovered = checkCover(covered.ranges, cursor.from, cursor.to))) {
    //         enter = isCovered != 2;
    //       } else if (!cursor.type.isAnonymous && (nest = this.nest(cursor, this.input)) && (cursor.from < cursor.to || !nest.overlay)) {
    //         if (!cursor.tree)
    //           materialize(cursor);
    //         let oldMounts = fragmentCursor.findMounts(cursor.from, nest.parser);
    //         if (typeof nest.overlay == "function") {
    //           overlay = new ActiveOverlay(nest.parser, nest.overlay, oldMounts, this.inner.length, cursor.from, cursor.tree, overlay);
    //         } else {
    //           let ranges = punchRanges(this.ranges, nest.overlay || (cursor.from < cursor.to ? [new Range(cursor.from, cursor.to)] : []));
    //           if (ranges.length)
    //             checkRanges(ranges);
    //           if (ranges.length || !nest.overlay)
    //             this.inner.push(new InnerParse(nest.parser, ranges.length ? nest.parser.startParse(this.input, enterFragments(oldMounts, ranges), ranges) : nest.parser.startParse(""), nest.overlay ? nest.overlay.map((r) => new Range(r.from - cursor.from, r.to - cursor.from)) : null, cursor.tree, ranges.length ? ranges[0].from : cursor.from));
    //           if (!nest.overlay)
    //             enter = false;
    //           else if (ranges.length)
    //             covered = { ranges, depth: 0, prev: covered };
    //         }
    //       } else if (overlay && (range = overlay.predicate(cursor))) {
    //         if (range === true)
    //           range = new Range(cursor.from, cursor.to);
    //         if (range.from < range.to) {
    //           let last = overlay.ranges.length - 1;
    //           if (last >= 0 && overlay.ranges[last].to == range.from)
    //             overlay.ranges[last] = { from: overlay.ranges[last].from, to: range.to };
    //           else
    //             overlay.ranges.push(range);
    //         }
    //       }
    //       if (enter && cursor.firstChild()) {
    //         if (overlay)
    //           overlay.depth++;
    //         if (covered)
    //           covered.depth++;
    //       } else {
    //         for (; ; ) {
    //           if (cursor.nextSibling())
    //             break;
    //           if (!cursor.parent())
    //             break scan;
    //           if (overlay && !--overlay.depth) {
    //             let ranges = punchRanges(this.ranges, overlay.ranges);
    //             if (ranges.length) {
    //               checkRanges(ranges);
    //               this.inner.splice(overlay.index, 0, new InnerParse(overlay.parser, overlay.parser.startParse(this.input, enterFragments(overlay.mounts, ranges), ranges), overlay.ranges.map((r) => new Range(r.from - overlay.start, r.to - overlay.start)), overlay.target, ranges[0].from));
    //             }
    //             overlay = overlay.prev;
    //           }
    //           if (covered && !--covered.depth)
    //             covered = covered.prev;
    //         }
    //       }
    //     }
    //   };
    //   parse.advance=function advance() {
    //     if (this.baseParse) {
    //       let done2 = this.baseParse.advance();
    //       if (!done2)
    //         return null;
    //       this.baseParse = null;
    //       this.baseTree = done2;
    //       console.log("start inner ",this.startInner.toString());
    //       this.startInner();
    //       if (this.stoppedAt != null)
    //         for (let inner2 of this.inner)
    //           inner2.parse.stopAt(this.stoppedAt);
    //     }
    //     if (this.innerDone == this.inner.length) {
    //       let result = this.baseTree;
    //       if (this.stoppedAt != null)
    //         result = new Tree(result.type, result.children, result.positions, result.length, result.propValues.concat([[stoppedInner, this.stoppedAt]]));
    //       return result;
    //     }
    //     let inner = this.inner[this.innerDone], done = inner.parse.advance();
    //     if (done) {
    //       this.innerDone++;
    //       let props = Object.assign(/* @__PURE__ */ Object.create(null), inner.target.props);
    //       props[NodeProp.mounted.id] = new MountedTree(done, inner.overlay, inner.parser);
    //       inner.target.props = props;
    //     }
    //     return null;
    //   }
    //   for (; ; ) {
    //     let done = parse.advance();
    //     if (done)
    //       return done;
    //   }
    // }
    let tree=htmlLanguage.parser.parse(src);
    console.log(tree);
    let changes=[];
    tree.cursor().iterate((cursor)=>{
      let content;
      if(cursor.name==="AttributeName"){
        content=src.substring(cursor.from,cursor.to);
        if(content==="href" || content==="src"){
          let node=cursor.node;
          console.log(content,node.name);
          let attribute=node.parent;
          let value=attribute.lastChild;
          let sValue=src.substring(value.from,value.to);
          let tagname=attribute.parent.firstChild.nextSibling;
          let sTagname=src.substring(tagname.from,tagname.to);
          let len=sValue.length;
          if(sValue.substring(1,5)!=="http"){
            if(sTagname==="a"){
              if(sValue.substring(len-6,len-1)===".html"){
                let change={
                  from: value.from,
                  to: value.to,
                  ov: sValue,
                  nv: "javascript:$showPage("+JSON.stringify(sValue.substring(1,len-6))+")"
                }
                changes.push(change);
              }
            }
          }
        }
      }
      return true;
    });
    console.log(changes);
    if(changes.length>0){
      changes.sort((a,b)=>{
        return a.from-b.from;
      });
      let parts=[];
      let c=changes[0];
      //parts.push(src.substring(0,c.from));
      let last=0;
      for(let i=0;i<changes.length;i++){
        let c=changes[i];
        parts.push(src.substring(last,c.from));
        parts.push(c.nv);
        last=c.to;
      }
      parts.push(src.substring(last));
      src=parts.join("");
    }
    src=`<script>window.onerror=function(error, source, line, col, event){$reportError({error,line,col, file: ${JSON.stringify(this.name)}})}; function $reportError(data){window.parent.postMessage({type: 'reportError', data })}</script>`+src;
    src+=`\n<script>
      function $showPage(s){
        window.parent.postMessage({
          type: "showPage",
          data: s
        });
      }
      function $replaceObjectURLs(){
        console.log("replace object urls");
        let els=document.querySelectorAll("[href]");
        for(let i=0;i<els.length;i++){
          let e=els[i];
          let href=e.getAttribute('href');
          console.log("e",e,e.href,window.$servedFiles[e.href],e.getAttribute('href'));
          let file=window.$servedFiles[href];
          if(file){
            e.href=file.url;
          }
        }
        els=document.querySelectorAll("[src]");
        for(let i=0;i<els.length;i++){
          let e=els[i];
          let src=e.getAttribute('src');
          let file=window.$servedFiles[src];
          console.log("src",e,src,file);
          if(file){
            const s = document.createElement('script');
            s.src = file.url;
            document.body.appendChild(s);
            
          }
        }
      }
      window.$servedFiles=(`;
    src=JSON.stringify(src);
    src+="+JSON.stringify(window.$servedFiles)+\");console.log('served',window.$servedFiles);$replaceObjectURLs();</script>\";";
    src=src.replace(/</g,"\\x3C");
    return src;
  }
  getJavaScriptCode(){
    if(this.fileType==="html"){
      return this.getHtmlJavaScriptCode();
    }else{
      return this.getServeFileJavaScriptCode();
    }
  }
  getUIPreviewCode(){
    let code=this.project.getUIPreviewCode(this);
    return code;
  }
  getServeFileJavaScriptCode(){
    let src=this.src;
    let code=`\n$serveFile(${JSON.stringify(this.name+"."+this.fileType)},${JSON.stringify(src)},${JSON.stringify(this.fileType)})\n`;
    return code;
  }

  getHtmlJavaScriptCode(){
    let code="class "+this.name+" extends HtmlPage";
    code+="{";
    code+="\nstatic $self;\n";//=$new("+this.name+");";
    code+=`static async $createSelf(){
      ${this.name}.$self=$new(${this.name});
      ${this.name}.$self.$el.id="${this.name}.html";
      let code=${this.getStringifiedSourceCode()};
      ${this.name}.$self.$el.srcdoc=code;
      let p=new Promise((fulfill,reject)=>{
        ${this.name}.$self.$el.onload=async (ev)=>{
          fulfill();
        }
        ${this.name}.$self.$el.onerror=(ev)=>{
          reject();
        } 
      }); 
      await p;
    }`;
    code+="\nasync $constructor(){";
    code+="await super.$constructor();";
    code+="\nreturn this;"
    code+="\n}";

    code+="\n}";
    return code;
  }

  getMethod(name,staticAccess){
    
    let m;
    m=this.superClazz.getMethod(name,staticAccess);
    if(m && m.error){
      m=null;
    }
    if(!m){
      return {
        error: "Die Klasse '"+this.name+"' hat keine "+(staticAccess? "statische ":"")+"Methode namens '"+name+"'."
      };
    }
    if(staticAccess){
      if(m.isStatic && m.isStatic() || m.static){
        return m;
      }else{
        return {
          error: "Die Methode '"+name+"' ist nicht statisch."
        };
      }
    }else{
      if(m.isStatic && m.isStatic() || m.static){
        return {
          error: "Die Methode '"+name+"' ist statisch. Verwende '"+this.name+"."+name+"(...)' um darauf zuzugreifen."
        };
      }else{
        return m;
      }
    }
  }

  toString(){
    return this.name;
  }

  
}