export function decodeText(data: ArrayBufferLike) {
  return new TextDecoder(sniffTextEncoding(data)).decode(data);
}

export function sniffTextEncoding(data: ArrayBufferLike): string {
  const buffer = new Uint8Array(data);
  if (
    buffer.length >= 2 &&
    (buffer[0] & 0xff) === 0xfe &&
    (buffer[1] & 0xff) === 0xff
  ) {
    return "utf-16be";
  }
  if (
    buffer.length >= 2 &&
    (buffer[0] & 0xff) === 0xff &&
    (buffer[1] & 0xff) === 0xfe
  ) {
    return "utf-16le";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] === 0 &&
    buffer[1] !== 0 &&
    buffer[2] === 0 &&
    buffer[3] !== 0 &&
    buffer[4] === 0 &&
    buffer[5] !== 0
  ) {
    return "utf-16be";
  }
  if (
    buffer.length >= 6 &&
    buffer[0] !== 0 &&
    buffer[1] === 0 &&
    buffer[2] !== 0 &&
    buffer[3] === 0 &&
    buffer[4] !== 0 &&
    buffer[5] === 0
  ) {
    return "utf-16le";
  }
  return "utf-8";
}
