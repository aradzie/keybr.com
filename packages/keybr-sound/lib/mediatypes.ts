const audio = new Audio();

const supportedMediaTypes = [
  [".aac", "audio/aac;"],
  [".mp3", "audio/mpeg;"],
  [".ogg", 'audio/ogg; codecs="vorbis"'],
  [".wav", 'audio/wav; codecs="1"'],
].filter(([ext, mediaType]) => {
  switch (audio.canPlayType(mediaType)) {
    case "maybe":
    case "probably":
      return true;
    default:
      return false;
  }
});

export function pickPlayableUrl(urls: readonly string[]): string | null {
  let index;
  for (let url of urls) {
    index = url.indexOf("#");
    if (index !== -1) {
      url = url.substring(0, index);
    }
    index = url.indexOf("?");
    if (index !== -1) {
      url = url.substring(0, index);
    }
    for (const [ext] of supportedMediaTypes) {
      if (url.endsWith(ext)) {
        return url;
      }
    }
  }
  return null;
}
