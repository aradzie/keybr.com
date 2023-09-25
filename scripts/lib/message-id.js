"use strict";

const { createHash } = require("node:crypto");

function getHashDigest(
  content,
  hashType = "sha512",
  digestType = "base64",
  length = 6,
) {
  const hash = createHash(hashType);
  hash.update(content);
  return hash.digest(digestType).substring(0, length);
}

module.exports.getHashDigest = getHashDigest;
