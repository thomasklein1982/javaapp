
export function Definition(node,source,scope){
  return {
    code: source.getText(node)
  }
}