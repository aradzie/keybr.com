const cache = new WeakMap<Blob, string>();

export function getBlobUrl(blob: Blob): string {
  let url = cache.get(blob) ?? null;
  if (url == null) {
    cache.set(blob, (url = URL.createObjectURL(blob)));
  }
  return url;
}
