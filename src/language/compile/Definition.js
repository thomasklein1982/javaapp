
export function Definition(node,source,scope){
  let code=source.getText(node);
  if(code.indexOf(" ")>=0){
    throw source.createError("Eine Definition darf keine Leerzeichen enthalten.",node);
  }
  return {
    code
  }
}