export function decodeText(data: Uint8Array): string {
  return new TextDecoder(sniffTextEncoding(data)).decode(data);
}

export function sniffTextEncoding(data: Uint8Array): string {
  if (
    data.length >= 2 &&
    (data[0] & 0xff) === 0xfe &&
    (data[1] & 0xff) === 0xff
  ) {
    return "utf-16be";
  }
  if (
    data.length >= 2 &&
    (data[0] & 0xff) === 0xff &&
    (data[1] & 0xff) === 0xfe
  ) {
    return "utf-16le";
  }
  if (
    data.length >= 6 &&
    data[0] === 0 &&
    data[1] !== 0 &&
    data[2] === 0 &&
    data[3] !== 0 &&
    data[4] === 0 &&
    data[5] !== 0
  ) {
    return "utf-16be";
  }
  if (
    data.length >= 6 &&
    data[0] !== 0 &&
    data[1] === 0 &&
    data[2] !== 0 &&
    data[3] === 0 &&
    data[4] !== 0 &&
    data[5] === 0
  ) {
    return "utf-16le";
  }
  return "utf-8";
}
