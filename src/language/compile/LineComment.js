

export function LineComment(node,source,scope,errors){
  return {
    code: "/*"+source.getText(node)+"*/",
    type: null
  };
}