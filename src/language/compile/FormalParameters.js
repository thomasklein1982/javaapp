
export function FormalParameters(node,source,scope){
  //TODO: Unklar, wo FormalParameters auftreten, ausser bei Lambda-Ausdruecken ohne Argumente
  let code=source.getText(node);
  return {
    code: code,
    params: []
  }
}