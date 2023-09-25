const supportedMediaTypes = [
  [".aac", "audio/aac;"],
  [".mp3", "audio/mpeg;"],
  [".ogg", 'audio/ogg; codecs="vorbis"'],
  [".wav", 'audio/wav; codecs="1"'],
].filter(([ext, mediaType]) => {
  const audio = new Audio();
  const canPlayType = audio.canPlayType(mediaType);
  return canPlayType === "probably" || canPlayType === "maybe";
});

export function pickUrl(urls: readonly string[]): string | null {
  let p: number;
  for (let url of urls) {
    p = url.indexOf("#");
    if (p !== -1) {
      url = url.substring(0, p);
    }
    p = url.indexOf("?");
    if (p !== -1) {
      url = url.substring(0, p);
    }
    for (const [ext] of supportedMediaTypes) {
      if (url.endsWith(ext)) {
        return url;
      }
    }
  }
  return null;
}
