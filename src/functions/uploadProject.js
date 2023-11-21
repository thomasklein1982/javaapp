import {upload} from './helper.js';
import { Project } from "../classes/Project.js";

export async function uploadProject(){
  let s=await upload({accept: "text/html"});
  if(!s) return null;
  let p=new Project();
  await p.fromSaveString(s.code);
  return p;
}