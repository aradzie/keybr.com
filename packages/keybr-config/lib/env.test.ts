import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assert } from "chai";
import { Env } from "./env.ts";

test("get string", () => {
  assert.throws(
    () => Env.getString("A_STRING"),
    "Missing env property 'A_STRING'",
  );
  assert.strictEqual(Env.getString("A_STRING", "abc"), "abc");

  process.env.A_STRING = "";
  assert.strictEqual(Env.getString("A_STRING"), "");
  assert.strictEqual(Env.getString("A_STRING", "abc"), "");

  process.env.A_STRING = "xyz";
  assert.strictEqual(Env.getString("A_STRING"), "xyz");
  assert.strictEqual(Env.getString("A_STRING", "abc"), "xyz");
});

test("get number", () => {
  assert.throws(
    () => Env.getNumber("A_NUMBER"),
    "Missing env property 'A_NUMBER'",
  );
  assert.strictEqual(Env.getNumber("A_NUMBER", 999), 999);

  process.env.A_NUMBER = "-0123";
  assert.strictEqual(Env.getNumber("A_NUMBER"), -123);
  assert.strictEqual(Env.getNumber("A_NUMBER", 999), -123);

  process.env.A_NUMBER = "abc";
  assert.throws(
    () => Env.getNumber("A_NUMBER"),
    "Invalid env property 'A_NUMBER': Invalid numeric value 'abc'",
  );
  assert.throws(
    () => Env.getNumber("A_NUMBER", 999),
    "Invalid env property 'A_NUMBER': Invalid numeric value 'abc'",
  );
});

test("get boolean", () => {
  assert.throws(
    () => Env.getBoolean("A_BOOLEAN"),
    "Missing env property 'A_BOOLEAN'",
  );
  assert.strictEqual(Env.getBoolean("A_BOOLEAN", true), true);

  process.env.A_BOOLEAN = "true";
  assert.strictEqual(Env.getBoolean("A_BOOLEAN"), true);
  assert.strictEqual(Env.getBoolean("A_BOOLEAN", false), true);

  process.env.A_BOOLEAN = "abc";
  assert.throws(
    () => Env.getBoolean("A_BOOLEAN"),
    "Invalid env property 'A_BOOLEAN': Invalid boolean value 'abc'",
  );
  assert.throws(
    () => Env.getBoolean("A_BOOLEAN", false),
    "Invalid env property 'A_BOOLEAN': Invalid boolean value 'abc'",
  );
});

test("get port", () => {
  assert.throws(() => Env.getPort("A_PORT"), "Missing env property 'A_PORT'");
  assert.strictEqual(Env.getPort("A_PORT", 999), 999);

  process.env.A_PORT = "-0123";
  assert.throws(
    () => Env.getPort("A_PORT"),
    "Invalid env property 'A_PORT': Invalid port number '-0123'",
  );
  assert.throws(
    () => Env.getPort("A_PORT", 999),
    "Invalid env property 'A_PORT': Invalid port number '-0123'",
  );

  process.env.A_PORT = "8080";
  assert.strictEqual(Env.getPort("A_PORT"), 8080);
  assert.strictEqual(Env.getPort("A_PORT", 9999), 8080);
});

test("get path", () => {
  assert.throws(() => Env.getPath("A_PATH"), "Missing env property 'A_PATH'");
  assert.strictEqual(Env.getPath("A_PATH", "/a/b/c"), "/a/b/c");

  process.env.A_PATH = "";
  assert.throws(
    () => Env.getPath("A_PATH"),
    "Invalid env property 'A_PATH': Empty path string",
  );
  assert.throws(
    () => Env.getPath("A_PATH", "/a/b/c"),
    "Invalid env property 'A_PATH': Empty path string",
  );

  process.env.A_PATH = "//x//y//.//0//..//z";
  assert.strictEqual(Env.getPath("A_PATH"), "/x/y/z");
  assert.strictEqual(Env.getPath("A_PATH", "/a/b/c"), "/x/y/z");

  process.env.A_PATH = "x/y/z";
  assert.strictEqual(Env.getPath("A_PATH"), join(process.cwd(), "x/y/z"));
  assert.strictEqual(
    Env.getPath("A_PATH", "/a/b/c"),
    join(process.cwd(), "x/y/z"),
  );

  process.env.A_PATH = "~";
  assert.strictEqual(Env.getPath("A_PATH"), join(homedir()));
  assert.strictEqual(Env.getPath("A_PATH", "/a/b/c"), join(homedir()));

  process.env.A_PATH = "~/x/y/z";
  assert.strictEqual(Env.getPath("A_PATH"), join(homedir(), "/x/y/z"));
  assert.strictEqual(
    Env.getPath("A_PATH", "/a/b/c"),
    join(homedir(), "/x/y/z"),
  );

  process.env.A_PATH = "~xyz";
  assert.strictEqual(Env.getPath("A_PATH"), join(process.cwd(), "~xyz"));
  assert.strictEqual(
    Env.getPath("A_PATH", "/a/b/c"),
    join(process.cwd(), "~xyz"),
  );
});
