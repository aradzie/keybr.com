import test from "ava";
import { MAX_ID, MIN_ID, PublicId } from "./index.ts";

test("format with toString", (t) => {
  t.is(String(PublicId.of("55VDTK1")), "55vdtk1");
  t.is(String(PublicId.of("Z1QFG4B")), "z1qfg4b");
  t.is(String(PublicId.of("example1")), "example1");
  t.is(String(PublicId.of("example9")), "example9");
});

test("parse and format valid values", (t) => {
  t.deepEqual(
    { ...new PublicId(0x00000001) },
    {
      id: 0x00000001,
      publicId: "55vdtk1",
      example: false,
    },
  );
  t.deepEqual(
    { ...PublicId.of("55VDTK1") },
    {
      id: 0x00000001,
      publicId: "55vdtk1",
      example: false,
    },
  );
  t.deepEqual(
    { ...new PublicId(0x00000002) },
    {
      id: 0x00000002,
      publicId: "d1m45te",
      example: false,
    },
  );
  t.deepEqual(
    { ...PublicId.of("D1M45TE") },
    {
      id: 0x00000002,
      publicId: "d1m45te",
      example: false,
    },
  );
  t.deepEqual(
    { ...new PublicId(0x0fffffff) },
    {
      id: 0x0fffffff,
      publicId: "z1qfg4b",
      example: false,
    },
  );
  t.deepEqual(
    { ...PublicId.of("Z1QFG4B") },
    {
      id: 0x0fffffff,
      publicId: "z1qfg4b",
      example: false,
    },
  );
});

test("parse and format valid example values", (t) => {
  t.deepEqual(
    { ...new PublicId(-1) },
    {
      id: 1,
      publicId: "example1",
      example: true,
    },
  );
  t.deepEqual(
    { ...PublicId.of("example1") },
    {
      id: 1,
      publicId: "example1",
      example: true,
    },
  );
  t.deepEqual(
    { ...new PublicId(-9) },
    {
      id: 9,
      publicId: "example9",
      example: true,
    },
  );
  t.deepEqual(
    { ...PublicId.of("example9") },
    {
      id: 9,
      publicId: "example9",
      example: true,
    },
  );
});

test("report invalid values", (t) => {
  t.throws(() => {
    PublicId.of("");
  });
  t.throws(() => {
    PublicId.of("???");
  });
  t.throws(() => {
    PublicId.of("0");
  });
  t.throws(() => {
    PublicId.of("-1");
  });
  t.throws(() => {
    PublicId.of("x5vdtk1");
  });
  t.throws(() => {
    PublicId.of("example0");
  });
  t.throws(() => {
    PublicId.of("EXAMPLE1");
  });
  t.throws(() => {
    PublicId.of("example999");
  });
  t.throws(() => {
    new PublicId(Math.PI);
  });
  t.throws(() => {
    new PublicId(0x00000000);
  });
  t.throws(() => {
    new PublicId(0xffffffff);
  });
  t.throws(() => {
    new PublicId(MIN_ID - 1);
  });
  t.throws(() => {
    new PublicId(MAX_ID + 1);
  });
});

test("convert to user", (t) => {
  t.throws(() => {
    new PublicId(1).toUser();
  });
  t.deepEqual(PublicId.of("example1").toUser(), {
    id: "example1",
    name: "Example User 1",
    imageUrl: null,
    premium: false,
  });
});
