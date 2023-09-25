import { type Reader, Writer } from "@keybr/binary";

export const HEADER_SIGNATURE = 0x4b455942;
export const HEADER_VERSION = 2;
export const HEADER = new Writer()
  .putInt32(HEADER_SIGNATURE)
  .putInt32(HEADER_VERSION)
  .buffer();

export function validateHeader(reader: Reader): boolean {
  return (
    reader.remaining() >= HEADER.byteLength &&
    reader.getUint32() === HEADER_SIGNATURE &&
    reader.getUint32() === HEADER_VERSION
  );
}
