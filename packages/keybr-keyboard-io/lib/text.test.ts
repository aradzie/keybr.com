import { strictEqual } from "node:assert";
import { test } from "node:test";
import { decodeText, sniffTextEncoding } from "./text.ts";

test("decode UTF-16BE BOM", async () => {
  const data = Buffer.of(0xfe, 0xff, 0x00, 0x61, 0x00, 0x62, 0x00, 0x63);
  strictEqual(sniffTextEncoding(data), "utf-16be");
  strictEqual(decodeText(data), "abc");
});

test("decode UTF-16BE no BOM", async () => {
  const data = Buffer.of(0x00, 0x61, 0x00, 0x62, 0x00, 0x63);
  strictEqual(sniffTextEncoding(data), "utf-16be");
  strictEqual(decodeText(data), "abc");
});

test("decode UTF-16LE BOM", () => {
  const data = Buffer.of(0xff, 0xfe, 0x61, 0x00, 0x62, 0x00, 0x63, 0x00);
  strictEqual(sniffTextEncoding(data), "utf-16le");
  strictEqual(decodeText(data), "abc");
});

test("decode UTF-16LE no BOM", () => {
  const data = Buffer.of(0x61, 0x00, 0x62, 0x00, 0x63, 0x00);
  strictEqual(sniffTextEncoding(data), "utf-16le");
  strictEqual(decodeText(data), "abc");
});

test("decode UTF-8 BOM", async () => {
  const data = Buffer.of(0xef, 0xbb, 0xbf, 0x61, 0x62, 0x63);
  strictEqual(sniffTextEncoding(data), "utf-8");
  strictEqual(decodeText(data), "abc");
});

test("decode UTF-8 no BOM", async () => {
  const data = Buffer.of(0x61, 0x62, 0x63);
  strictEqual(sniffTextEncoding(data), "utf-8");
  strictEqual(decodeText(data), "abc");
});
