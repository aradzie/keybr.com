/**
 * Triggers a browser download for a blob with the given filename.
 * @param blob - The blob content to download
 * @param name - The filename to save as
 */
export function download(blob: Blob, name: string): void {
  const a = document.createElement("a");
  a.setAttribute("href", URL.createObjectURL(blob));
  a.setAttribute("download", name);
  a.setAttribute("hidden", "");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
