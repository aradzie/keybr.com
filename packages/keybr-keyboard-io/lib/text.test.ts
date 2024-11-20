import { test } from "node:test";
import { equal } from "rich-assert";
import { decodeText, sniffTextEncoding } from "./text.ts";

test("decode UTF-16BE BOM", async () => {
  const data = Buffer.of(0xfe, 0xff, 0x00, 0x61, 0x00, 0x62, 0x00, 0x63);
  equal(sniffTextEncoding(data), "utf-16be");
  equal(decodeText(data), "abc");
});

test("decode UTF-16BE no BOM", async () => {
  const data = Buffer.of(0x00, 0x61, 0x00, 0x62, 0x00, 0x63);
  equal(sniffTextEncoding(data), "utf-16be");
  equal(decodeText(data), "abc");
});

test("decode UTF-16LE BOM", () => {
  const data = Buffer.of(0xff, 0xfe, 0x61, 0x00, 0x62, 0x00, 0x63, 0x00);
  equal(sniffTextEncoding(data), "utf-16le");
  equal(decodeText(data), "abc");
});

test("decode UTF-16LE no BOM", () => {
  const data = Buffer.of(0x61, 0x00, 0x62, 0x00, 0x63, 0x00);
  equal(sniffTextEncoding(data), "utf-16le");
  equal(decodeText(data), "abc");
});

test("decode UTF-8 BOM", async () => {
  const data = Buffer.of(0xef, 0xbb, 0xbf, 0x61, 0x62, 0x63);
  equal(sniffTextEncoding(data), "utf-8");
  equal(decodeText(data), "abc");
});

test("decode UTF-8 no BOM", async () => {
  const data = Buffer.of(0x61, 0x62, 0x63);
  equal(sniffTextEncoding(data), "utf-8");
  equal(decodeText(data), "abc");
});
