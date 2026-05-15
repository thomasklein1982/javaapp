

let SQLite=await initSqlJs({
  locateFile: (file) => {
    let code=window.sqljsWasmCode.toString();
    code=code.substring(36,code.length-18);
    //console.log(code);
    const wasm_strbuffer = atob(code);
    let wasm_codearray = new Uint8Array(wasm_strbuffer.length);
    for (let i in wasm_strbuffer) wasm_codearray[i] = wasm_strbuffer.charCodeAt(i);

    let url=URL.createObjectURL(new Blob([wasm_codearray], { type: 'application/wasm' }));
    return url;},
});

const SQL = new SQLite.Database();
export default SQL;