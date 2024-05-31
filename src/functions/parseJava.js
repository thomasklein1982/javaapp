// import {EditorView} from "codemirror"
// import { EditorState } from "@codemirror/state";
// import {java} from "@codemirror/lang-java"
import { javaLanguage } from "@codemirror/lang-java";

export function parseJava(src,withoutClazz){
  let lang;
  if(withoutClazz){
    lang=javaLanguage.configure({top: "ClassContent"});
  }else{
    lang=javaLanguage;
  }
  let tree=lang.parser.parse(src);
  if(src.length>0){
    console.log("parseJava",src.length,src.substring(src.length-300));
    console.log(tree);
  }
  return tree;
}

// const offscreenEditor=new EditorView({
//   state: EditorState.create({
//     doc: "",
//     extensions: [
//       EditorView.updateListener.of((viewUpdate) => {
//         parsingDone(viewUpdate);
//       }),
//       java()
//     ]
//   })
// });

// let parsingResolve;
// export async function parseJava(src){
//   var p=new Promise(function(resolve,reject){
//     parsingResolve=null;
//     let chunksize=1000;
//     let remaining=src;
//     offscreenEditor.dispatch({
//       changes: {from: 0, to: offscreenEditor.viewState.state.doc.length, insert: src}
//     });
//     let offset=0;
//     while(remaining.length>0){
//       let part=remaining.substring(0,chunksize);
//       remaining=remaining.substring(chunksize);
//       if(remaining.length<=0){
//         parsingResolve=resolve;
//       }
//       offscreenEditor.dispatch({
//         changes: {from: offset, to: offset+part.length,insert: part}
//       });
//       offset+=chunksize;
//     }
//   });
//   let viewUpdate=await p;
//   return viewUpdate;
// }

// function parsingDone(viewUpdate){
//   if(!parsingResolve) return;
//   parsingResolve(viewUpdate);
// }