import { createHash } from "node:crypto";
import { transform } from "@formatjs/ts-transformer";

export function getHashDigest(
  content,
  hashType = "sha512",
  digestType = "base64",
  length = 6,
) {
  const hash = createHash(hashType);
  hash.update(content);
  return hash.digest(digestType).substring(0, length);
}

export function intlTransformer() {
  return transform({
    removeDefaultMessage: true,
    overrideIdFn: (id) => getHashDigest(id),
  });
}
