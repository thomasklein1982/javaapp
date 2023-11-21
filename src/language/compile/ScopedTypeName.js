import { FieldAccess } from "./FieldAccess";

export function ScopedTypeName(node,source,scope){
  console.log("scoped field access");
  let fa=FieldAccess(node,source,scope);
  
  throw (source.createError("Der Ausdruck ist unvollständig.",node));
}