import { homedir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { equal, throws } from "rich-assert";
import { Env } from "./env.ts";

test("get string", () => {
  throws(() => Env.getString("A_STRING"), /Missing env property 'A_STRING'/);
  equal(Env.getString("A_STRING", "abc"), "abc");

  process.env.A_STRING = "";
  equal(Env.getString("A_STRING"), "");
  equal(Env.getString("A_STRING", "abc"), "");

  process.env.A_STRING = "xyz";
  equal(Env.getString("A_STRING"), "xyz");
  equal(Env.getString("A_STRING", "abc"), "xyz");
});

test("get number", () => {
  throws(() => Env.getNumber("A_NUMBER"), /Missing env property 'A_NUMBER'/);
  equal(Env.getNumber("A_NUMBER", 999), 999);

  process.env.A_NUMBER = "-0123";
  equal(Env.getNumber("A_NUMBER"), -123);
  equal(Env.getNumber("A_NUMBER", 999), -123);

  process.env.A_NUMBER = "abc";
  throws(
    () => Env.getNumber("A_NUMBER"),
    /Invalid env property 'A_NUMBER': Invalid numeric value 'abc'/,
  );
  throws(
    () => Env.getNumber("A_NUMBER", 999),
    /Invalid env property 'A_NUMBER': Invalid numeric value 'abc'/,
  );
});

test("get boolean", () => {
  throws(() => Env.getBoolean("A_BOOLEAN"), /Missing env property 'A_BOOLEAN'/);
  equal(Env.getBoolean("A_BOOLEAN", true), true);

  process.env.A_BOOLEAN = "true";
  equal(Env.getBoolean("A_BOOLEAN"), true);
  equal(Env.getBoolean("A_BOOLEAN", false), true);

  process.env.A_BOOLEAN = "abc";
  throws(
    () => Env.getBoolean("A_BOOLEAN"),
    /Invalid env property 'A_BOOLEAN': Invalid boolean value 'abc'/,
  );
  throws(
    () => Env.getBoolean("A_BOOLEAN", false),
    /Invalid env property 'A_BOOLEAN': Invalid boolean value 'abc'/,
  );
});

test("get port", () => {
  throws(() => Env.getPort("A_PORT"), /Missing env property 'A_PORT'/);
  equal(Env.getPort("A_PORT", 999), 999);

  process.env.A_PORT = "-0123";
  throws(
    () => Env.getPort("A_PORT"),
    /Invalid env property 'A_PORT': Invalid port number '-0123'/,
  );
  throws(
    () => Env.getPort("A_PORT", 999),
    /Invalid env property 'A_PORT': Invalid port number '-0123'/,
  );

  process.env.A_PORT = "8080";
  equal(Env.getPort("A_PORT"), 8080);
  equal(Env.getPort("A_PORT", 9999), 8080);
});

test("get path", () => {
  throws(() => Env.getPath("A_PATH"), /Missing env property 'A_PATH'/);
  equal(Env.getPath("A_PATH", "/a/b/c"), "/a/b/c");

  process.env.A_PATH = "";
  throws(
    () => Env.getPath("A_PATH"),
    /Invalid env property 'A_PATH': Empty path string/,
  );
  throws(
    () => Env.getPath("A_PATH", "/a/b/c"),
    /Invalid env property 'A_PATH': Empty path string/,
  );

  process.env.A_PATH = "//x//y//.//0//..//z";
  equal(Env.getPath("A_PATH"), "/x/y/z");
  equal(Env.getPath("A_PATH", "/a/b/c"), "/x/y/z");

  process.env.A_PATH = "x/y/z";
  equal(Env.getPath("A_PATH"), join(process.cwd(), "x/y/z"));
  equal(Env.getPath("A_PATH", "/a/b/c"), join(process.cwd(), "x/y/z"));

  process.env.A_PATH = "~";
  equal(Env.getPath("A_PATH"), join(homedir()));
  equal(Env.getPath("A_PATH", "/a/b/c"), join(homedir()));

  process.env.A_PATH = "~/x/y/z";
  equal(Env.getPath("A_PATH"), join(homedir(), "/x/y/z"));
  equal(Env.getPath("A_PATH", "/a/b/c"), join(homedir(), "/x/y/z"));

  process.env.A_PATH = "~xyz";
  equal(Env.getPath("A_PATH"), join(process.cwd(), "~xyz"));
  equal(Env.getPath("A_PATH", "/a/b/c"), join(process.cwd(), "~xyz"));
});
