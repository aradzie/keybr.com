const cache = new WeakMap<Blob, string>();

export function getBlobUrl(blob: Blob): string {
  let url = cache.get(blob) ?? null;
  if (url == null) {
    cache.set(blob, (url = URL.createObjectURL(blob)));
  }
  return url;
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", (ev) => {
      resolve(String(reader.result));
    });
    reader.addEventListener("error", (ev) => {
      reject(new Error());
    });
    reader.readAsDataURL(blob);
  });
}

export function dataUrlToBlob(url: string): Promise<Blob> {
  return fetch(url).then((r) => r.blob());
}
