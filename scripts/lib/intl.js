import { createHash } from "node:crypto";

export function messageIdHash(
  content,
  hashType = "sha512",
  digestType = "base64",
  length = 6,
) {
  const hash = createHash(hashType);
  hash.update(content);
  return hash.digest(digestType).substring(0, length);
}
