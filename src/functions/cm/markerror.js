import {WidgetType} from "@codemirror/view"
import {EditorView, Decoration} from "@codemirror/view"
import {ViewPlugin} from "@codemirror/view"

let errorArray=[];
let errorHandler={};

export function markerrors(newErrors,view){
  errorArray=newErrors;
  //errorPlugin.update({view: view});
  
}

class ErrorWidget extends WidgetType {
  constructor(text) { 
    super();
    this.text=text; 
  }

  toDOM() {
    let wrap = document.createElement("span")
    wrap.setAttribute("aria-hidden", "true")
    wrap.style="position: relative;";
    let m=document.createElement("span");
    m.className="error-marker"
    m.textContent=" ";
    m.style="position: absolute;border-bottom: 2pt solid red; display: inline-block; width: 2ex";
    let l=document.createElement("span");
    l.textContent=" ";
    l.style="position: absolute; border-bottom: 1pt dotted red; display: inline-block; width: 1000ex; left: -1000ex; top: -0.1ex";
    wrap.appendChild(l);
    wrap.appendChild(m);
    return wrap
  }

  ignoreEvent() { return false }
}



function errors(view) {
  let widgets = []
  for(let i=0;i<errorArray.length;i++){
    let e=errorArray[i];
    if(!e || !e.message || !e.line) continue;
    let deco = Decoration.widget({
      widget: new ErrorWidget(e.message),
      side: 1
    })
    widgets.push(deco.range(e.line.from+e.col))
  }
  
  return Decoration.set(widgets)
}


export const errorPlugin = ViewPlugin.fromClass(class {
  constructor(view) {
    this.decorations = errors(view)
  }

  update(update) {
    this.decorations = errors(update.view)
  }
}, {
  decorations: v => v.decorations,

  eventHandlers: {
    mousedown: (e, view) => {
      let target = e.target;
    }
  }
})