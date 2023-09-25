import { homedir } from "node:os";
import { join } from "node:path";
import test from "ava";
import { Env } from "./env.ts";

test("get string", (t) => {
  t.throws(() => Env.getString("A_STRING"), {
    message: "Missing env property 'A_STRING'",
  });
  t.is(Env.getString("A_STRING", "abc"), "abc");

  process.env.A_STRING = "";
  t.is(Env.getString("A_STRING"), "");
  t.is(Env.getString("A_STRING", "abc"), "");

  process.env.A_STRING = "xyz";
  t.is(Env.getString("A_STRING"), "xyz");
  t.is(Env.getString("A_STRING", "abc"), "xyz");
});

test("get number", (t) => {
  t.throws(() => Env.getNumber("A_NUMBER"), {
    message: "Missing env property 'A_NUMBER'",
  });
  t.is(Env.getNumber("A_NUMBER", 999), 999);

  process.env.A_NUMBER = "-0123";
  t.is(Env.getNumber("A_NUMBER"), -123);
  t.is(Env.getNumber("A_NUMBER", 999), -123);

  process.env.A_NUMBER = "abc";
  t.throws(() => Env.getNumber("A_NUMBER"), {
    message: "Invalid env property 'A_NUMBER': Invalid numeric value 'abc'",
  });
  t.throws(() => Env.getNumber("A_NUMBER", 999), {
    message: "Invalid env property 'A_NUMBER': Invalid numeric value 'abc'",
  });
});

test("get boolean", (t) => {
  t.throws(() => Env.getBoolean("A_BOOLEAN"), {
    message: "Missing env property 'A_BOOLEAN'",
  });
  t.is(Env.getBoolean("A_BOOLEAN", true), true);

  process.env.A_BOOLEAN = "true";
  t.is(Env.getBoolean("A_BOOLEAN"), true);
  t.is(Env.getBoolean("A_BOOLEAN", false), true);

  process.env.A_BOOLEAN = "abc";
  t.throws(() => Env.getBoolean("A_BOOLEAN"), {
    message: "Invalid env property 'A_BOOLEAN': Invalid boolean value 'abc'",
  });
  t.throws(() => Env.getBoolean("A_BOOLEAN", false), {
    message: "Invalid env property 'A_BOOLEAN': Invalid boolean value 'abc'",
  });
});

test("get port", (t) => {
  t.throws(() => Env.getPort("A_PORT"), {
    message: "Missing env property 'A_PORT'",
  });
  t.is(Env.getPort("A_PORT", 999), 999);

  process.env.A_PORT = "-0123";
  t.throws(() => Env.getPort("A_PORT"), {
    message: "Invalid env property 'A_PORT': Invalid port number '-0123'",
  });
  t.throws(() => Env.getPort("A_PORT", 999), {
    message: "Invalid env property 'A_PORT': Invalid port number '-0123'",
  });

  process.env.A_PORT = "8080";
  t.is(Env.getPort("A_PORT"), 8080);
  t.is(Env.getPort("A_PORT", 9999), 8080);
});

test("get path", (t) => {
  t.throws(() => Env.getPath("A_PATH"), {
    message: "Missing env property 'A_PATH'",
  });
  t.is(Env.getPath("A_PATH", "/a/b/c"), "/a/b/c");

  process.env.A_PATH = "";
  t.throws(() => Env.getPath("A_PATH"), {
    message: "Invalid env property 'A_PATH': Empty path string",
  });
  t.throws(() => Env.getPath("A_PATH", "/a/b/c"), {
    message: "Invalid env property 'A_PATH': Empty path string",
  });

  process.env.A_PATH = "//x//y//.//0//..//z";
  t.is(Env.getPath("A_PATH"), "/x/y/z");
  t.is(Env.getPath("A_PATH", "/a/b/c"), "/x/y/z");

  process.env.A_PATH = "x/y/z";
  t.is(Env.getPath("A_PATH"), join(process.cwd(), "x/y/z"));
  t.is(Env.getPath("A_PATH", "/a/b/c"), join(process.cwd(), "x/y/z"));

  process.env.A_PATH = "~";
  t.is(Env.getPath("A_PATH"), join(homedir()));
  t.is(Env.getPath("A_PATH", "/a/b/c"), join(homedir()));

  process.env.A_PATH = "~/x/y/z";
  t.is(Env.getPath("A_PATH"), join(homedir(), "/x/y/z"));
  t.is(Env.getPath("A_PATH", "/a/b/c"), join(homedir(), "/x/y/z"));

  process.env.A_PATH = "~xyz";
  t.is(Env.getPath("A_PATH"), join(process.cwd(), "~xyz"));
  t.is(Env.getPath("A_PATH", "/a/b/c"), join(process.cwd(), "~xyz"));
});
