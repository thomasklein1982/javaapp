import { downloadZip } from "client-zip";

export async function downloadFilesAsZip(zipfileName, files){
  let blob=await downloadZip(files).blob();
  const link = document.createElement("a");
  let url=URL.createObjectURL(blob);
  link.href = url;
  link.download = zipfileName;
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}