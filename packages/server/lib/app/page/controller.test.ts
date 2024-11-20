import { test } from "node:test";
import { Application } from "@fastr/core";
import { Cookie } from "@fastr/headers";
import { load } from "cheerio";
import { deepEqual, equal } from "rich-assert";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const context = new TestContext();

for (const path of [
  "/",
  "/account",
  "/help",
  "/high-scores",
  "/layouts",
  "/multiplayer",
  "/profile",
  "/profile/example1",
  "/profile/example2",
  "/profile/example3",
  "/profile/example4",
  "/profile/example5",
  "/typing-test",
  "/terms-of-service",
  "/privacy-policy",
]) {
  test(`load page "${path}"`, async () => {
    // Arrange.

    const request = startApp(context.get(Application, kMain));

    // Act.

    const response = await request
      .GET(path)
      .header("X-Forwarded-Host", "www.keybr.com")
      .header("X-Forwarded-Proto", "https")
      .send();

    // Assert.

    equal(response.status, 200);
    equal(response.headers.get("Content-Type"), "text/html; charset=UTF-8");

    const $ = load(await response.body.text());
    equal($("script#page-data").length, 1);
    equal($("#root").length, 1);
  });
}

test(`load custom theme from cookie`, async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request
    .GET("/")
    .header("X-Forwarded-Host", "www.keybr.com")
    .header("X-Forwarded-Proto", "https")
    .header(
      "Cookie",
      new Cookie([["prefs", '{"color":"dark","font":"spectral"}']]),
    )
    .send();

  // Assert.

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "text/html; charset=UTF-8");
  deepEqual(response.headers.getAll("Set-Cookie"), []);

  const $ = load(await response.body.text());
  equal($("html").attr("data-color"), "dark");
  equal($("html").attr("data-font"), "spectral");
});

test(`ignore invalid theme cookie`, async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request
    .GET("/")
    .header("X-Forwarded-Host", "www.keybr.com")
    .header("X-Forwarded-Proto", "https")
    .header("Cookie", new Cookie([["prefs", "%%%garbage%%%"]]))
    .send();

  // Assert.

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "text/html; charset=UTF-8");
  deepEqual(response.headers.getAll("Set-Cookie"), []);

  const $ = load(await response.body.text());
  equal($("html").attr("data-color"), "system");
  equal($("html").attr("data-font"), "open-sans");
});
