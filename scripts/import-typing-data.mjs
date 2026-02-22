#!/usr/bin/env node

/**
 * Import typing data from JSON format to keybr.com user stats.
 * This script converts JSON export to keybr's binary format.
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read keybr's compiled modules
const projectRoot = resolve(__dirname, "..");

// We'll need to import from the actual source and let keybr's build handle it
// For now, let's use a direct binary approach

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: node scripts/import-typing-data.mjs <user-id> <input-file>");
    console.error("Example: node scripts/import-typing-data.mjs 1 ~/Downloads/typing-data.json");
    process.exit(1);
  }

  const userId = parseInt(args[0], 10);
  const inputFile = args[1];

  if (isNaN(userId)) {
    console.error("Invalid user ID");
    process.exit(1);
  }

  console.log(`Importing typing data for user ${userId} from ${inputFile}`);

  // Read the JSON data
  const jsonContent = await readFile(inputFile, "utf-8");
  const jsonData = JSON.parse(jsonContent);

  console.log(`Found ${jsonData.length} typing results in JSON file`);

  // Convert to binary format
  const binaryData = convertToBinaryFormat(jsonData);

  // Write to user stats file
  const statsFile = getUserStatsFile(userId);
  await mkdir(dirname(statsFile), { recursive: true });
  await writeFile(statsFile, binaryData);

  console.log(`Wrote ${jsonData.length} results to ${statsFile}`);
  console.log(`File size: ${binaryData.length} bytes`);
  console.log("Import complete!");
}

function getUserStatsFile(userId) {
  const paddedId = String(userId).padStart(9, "0");
  const dir1 = paddedId.slice(0, 3);
  const dir2 = paddedId.slice(3, 6);
  const filename = paddedId;

  const dataDir = resolve(process.env.HOME, ".local/state/keybr");
  return resolve(dataDir, "user_stats", dir1, dir2, filename);
}

function convertToBinaryFormat(results) {
  const chunks = [];

  // Header: "KEYB" signature (4 bytes) + version 2 (4 bytes, little-endian)
  chunks.push(Buffer.from([0x4B, 0x45, 0x59, 0x42])); // "KEYB"
  chunks.push(Buffer.from([0x00, 0x00, 0x00, 0x02])); // Version 2 (little-endian)

  for (const result of results) {
    const resultBuffer = encodeResult(result);
    chunks.push(resultBuffer);
  }

  return Buffer.concat(chunks);
}

function encodeResult(result) {
  const buffers = [];

  // Get layout and text type IDs
  const layoutId = getLayoutId(result.layout);
  const textTypeId = getTextTypeId(result.textType);

  // Layout ID (1 byte)
  buffers.push(Buffer.from([layoutId]));

  // Text type ID (1 byte)
  buffers.push(Buffer.from([textTypeId]));

  // Timestamp (4 bytes, seconds since epoch, big-endian)
  const timestamp = Math.floor(new Date(result.timeStamp).getTime() / 1000);
  const timestampBuf = Buffer.alloc(4);
  timestampBuf.writeUInt32BE(timestamp, 0);
  buffers.push(timestampBuf);

  // Time (VLQ - variable length quantity)
  buffers.push(encodeVLQ(result.time));

  // Length (VLQ)
  buffers.push(encodeVLQ(result.length));

  // Errors (VLQ)
  buffers.push(encodeVLQ(result.errors));

  // Histogram size (VLQ)
  buffers.push(encodeVLQ(result.histogram.length));

  // Histogram entries
  for (const sample of result.histogram) {
    buffers.push(encodeVLQ(sample.codePoint));
    buffers.push(encodeVLQ(sample.hitCount));
    buffers.push(encodeVLQ(sample.missCount));
    buffers.push(encodeVLQ(sample.timeToType));
  }

  return Buffer.concat(buffers);
}

function encodeVLQ(value) {
  if (value < 0 || value > 0x0FFFFFFF) {
    throw new Error(`Value out of range for VLQ encoding: ${value}`);
  }

  const bytes = [];
  do {
    bytes.push(value & 0x7F);
    value >>>= 7;
  } while (value > 0);

  // Set continuation bit (0x80) on all but the last byte
  for (let i = 0; i < bytes.length - 1; i++) {
    bytes[i] |= 0x80;
  }

  return Buffer.from(bytes);
}

// Layout IDs from keybr (extracted from packages/keybr-keyboard/lib/layout.ts)
function getLayoutId(layoutName) {
  const layouts = {
    "de-de": 32,
    "en-us": 16,
    "en-gb": 17,
    "fr-fr": 48,
    "es-es": 80,
    "it-it": 64,
    "pl-pl": 88,
    "pt-br": 96,
    "pt-pt": 98,
    "ru-ru": 112,
    "sv-se": 128,
    "tr-tr-q": 137,
    "tr-tr-f": 138,
    "uk-ua": 120,
    "cs-cz": 129,
    "el-gr": 131,
    "he-il": 132,
    "ro-ro": 160,
    "hu-hu": 135,
    "fi-fi": 74,
    "et-ee": 75,
    "lv-lv": 73,
    "lt-lt": 72,
    "nl-nl": 133,
    "nl-be": 134,
    "nb-no": 136,
    "da-dk": 167,
    "th-th": 154,
    "ar-sa": 141,
    "fa-ir": 145,
    "ja-jp": 176,
    // Variants
    "en-dvorak": 24,
    "en-colemak": 25,
    "en-colemak-dh": 27,
    "en-colemak-dh-matrix": 28,
    "en-workman": 26,
    "en-canary": 30,
    "en-canary-matrix": 29,
    "de-ch": 33,
    "fr-ca": 49,
    "fr-ch": 50,
  };

  return layouts[layoutName.toLowerCase()] || 16; // Default to en-us
}

// Text type IDs from keybr (packages/keybr-result/lib/texttype.ts)
function getTextTypeId(textTypeName) {
  const textTypes = {
    "generated": 1,
    "natural": 2,
    "numbers": 3,
    "code": 4,
  };

  const name = textTypeName.toLowerCase();
  return textTypes[name] || 1; // Default to generated
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
