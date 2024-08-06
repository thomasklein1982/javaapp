import {upload} from './helper.js';
import { Project } from "../classes/Project.js";

export async function uploadProject(){
  let s=await upload({accept: "text/html,text/htm"});
  if(!s) return null;
  // console.log("Länge Projekt",s.code.length);
  // console.log(s.code.substring(0,300));
  // console.log(s.code.substring(s.code.length-300));
  let p=new Project();
  let ok=true;
  try{
    ok=p.fromSaveString(s.code);
  }catch(e){
    ok=false;
  }
  if(ok) return p;
  else return null;
}