import { test } from "node:test";
import { deepEqual, equal, throws } from "rich-assert";
import { MAX_ID, MIN_ID, PublicId } from "./index.ts";

test("format with toString", () => {
  equal(String(PublicId.of("55VDTK1")), "55vdtk1");
  equal(String(PublicId.of("Z1QFG4B")), "z1qfg4b");
  equal(String(PublicId.of("example1")), "example1");
  equal(String(PublicId.of("example9")), "example9");
});

test("parse and format valid values", () => {
  deepEqual(
    { ...new PublicId(0x00000001) },
    {
      id: 0x00000001,
      publicId: "55vdtk1",
      example: false,
    },
  );
  deepEqual(
    { ...PublicId.of("55VDTK1") },
    {
      id: 0x00000001,
      publicId: "55vdtk1",
      example: false,
    },
  );
  deepEqual(
    { ...new PublicId(0x00000002) },
    {
      id: 0x00000002,
      publicId: "d1m45te",
      example: false,
    },
  );
  deepEqual(
    { ...PublicId.of("D1M45TE") },
    {
      id: 0x00000002,
      publicId: "d1m45te",
      example: false,
    },
  );
  deepEqual(
    { ...new PublicId(0x0fffffff) },
    {
      id: 0x0fffffff,
      publicId: "z1qfg4b",
      example: false,
    },
  );
  deepEqual(
    { ...PublicId.of("Z1QFG4B") },
    {
      id: 0x0fffffff,
      publicId: "z1qfg4b",
      example: false,
    },
  );
});

test("parse and format valid example values", () => {
  deepEqual(
    { ...new PublicId(-1) },
    {
      id: 1,
      publicId: "example1",
      example: true,
    },
  );
  deepEqual(
    { ...PublicId.of("example1") },
    {
      id: 1,
      publicId: "example1",
      example: true,
    },
  );
  deepEqual(
    { ...new PublicId(-9) },
    {
      id: 9,
      publicId: "example9",
      example: true,
    },
  );
  deepEqual(
    { ...PublicId.of("example9") },
    {
      id: 9,
      publicId: "example9",
      example: true,
    },
  );
});

test("report invalid values", () => {
  throws(() => {
    PublicId.of("");
  });
  throws(() => {
    PublicId.of("???");
  });
  throws(() => {
    PublicId.of("0");
  });
  throws(() => {
    PublicId.of("-1");
  });
  throws(() => {
    PublicId.of("x5vdtk1");
  });
  throws(() => {
    PublicId.of("example0");
  });
  throws(() => {
    PublicId.of("EXAMPLE1");
  });
  throws(() => {
    PublicId.of("example999");
  });
  throws(() => {
    new PublicId(Math.PI);
  });
  throws(() => {
    new PublicId(0x00000000);
  });
  throws(() => {
    new PublicId(0xffffffff);
  });
  throws(() => {
    new PublicId(MIN_ID - 1);
  });
  throws(() => {
    new PublicId(MAX_ID + 1);
  });
});

test("convert to user", () => {
  throws(() => {
    new PublicId(1).toUser();
  });
  deepEqual(PublicId.of("example1").toUser(), {
    id: "example1",
    name: "Example User 1",
    imageUrl: null,
    premium: false,
  });
});
