export function checkSemikolon(node,source){
  if(node.nextSibling.type.isError || node.nextSibling.name!==";"){
    throw source.createError("';' erwartet.",node.nextSibling);
  }
}