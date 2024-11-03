import { test } from "node:test";
import { assert } from "chai";
import { MAX_ID, MIN_ID, PublicId } from "./index.ts";

test("format with toString", () => {
  assert.strictEqual(String(PublicId.of("55VDTK1")), "55vdtk1");
  assert.strictEqual(String(PublicId.of("Z1QFG4B")), "z1qfg4b");
  assert.strictEqual(String(PublicId.of("example1")), "example1");
  assert.strictEqual(String(PublicId.of("example9")), "example9");
});

test("parse and format valid values", () => {
  assert.deepStrictEqual(
    { ...new PublicId(0x00000001) },
    {
      id: 0x00000001,
      publicId: "55vdtk1",
      example: false,
    },
  );
  assert.deepStrictEqual(
    { ...PublicId.of("55VDTK1") },
    {
      id: 0x00000001,
      publicId: "55vdtk1",
      example: false,
    },
  );
  assert.deepStrictEqual(
    { ...new PublicId(0x00000002) },
    {
      id: 0x00000002,
      publicId: "d1m45te",
      example: false,
    },
  );
  assert.deepStrictEqual(
    { ...PublicId.of("D1M45TE") },
    {
      id: 0x00000002,
      publicId: "d1m45te",
      example: false,
    },
  );
  assert.deepStrictEqual(
    { ...new PublicId(0x0fffffff) },
    {
      id: 0x0fffffff,
      publicId: "z1qfg4b",
      example: false,
    },
  );
  assert.deepStrictEqual(
    { ...PublicId.of("Z1QFG4B") },
    {
      id: 0x0fffffff,
      publicId: "z1qfg4b",
      example: false,
    },
  );
});

test("parse and format valid example values", () => {
  assert.deepStrictEqual(
    { ...new PublicId(-1) },
    {
      id: 1,
      publicId: "example1",
      example: true,
    },
  );
  assert.deepStrictEqual(
    { ...PublicId.of("example1") },
    {
      id: 1,
      publicId: "example1",
      example: true,
    },
  );
  assert.deepStrictEqual(
    { ...new PublicId(-9) },
    {
      id: 9,
      publicId: "example9",
      example: true,
    },
  );
  assert.deepStrictEqual(
    { ...PublicId.of("example9") },
    {
      id: 9,
      publicId: "example9",
      example: true,
    },
  );
});

test("report invalid values", () => {
  assert.throws(() => {
    PublicId.of("");
  });
  assert.throws(() => {
    PublicId.of("???");
  });
  assert.throws(() => {
    PublicId.of("0");
  });
  assert.throws(() => {
    PublicId.of("-1");
  });
  assert.throws(() => {
    PublicId.of("x5vdtk1");
  });
  assert.throws(() => {
    PublicId.of("example0");
  });
  assert.throws(() => {
    PublicId.of("EXAMPLE1");
  });
  assert.throws(() => {
    PublicId.of("example999");
  });
  assert.throws(() => {
    new PublicId(Math.PI);
  });
  assert.throws(() => {
    new PublicId(0x00000000);
  });
  assert.throws(() => {
    new PublicId(0xffffffff);
  });
  assert.throws(() => {
    new PublicId(MIN_ID - 1);
  });
  assert.throws(() => {
    new PublicId(MAX_ID + 1);
  });
});

test("convert to user", () => {
  assert.throws(() => {
    new PublicId(1).toUser();
  });
  assert.deepStrictEqual(PublicId.of("example1").toUser(), {
    id: "example1",
    name: "Example User 1",
    imageUrl: null,
    premium: false,
  });
});
