import { Application } from "@fastr/core";
import { Cookie } from "@fastr/headers";
import cheerio from "cheerio";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";

for (const url of [
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
  "/word-count",
  "/terms-of-service",
  "/privacy-policy",
]) {
  test(`load page "${url}"`, async (t) => {
    // Arrange.

    const request = startApp(t.context.get(Application, kMain));

    // Act.

    const response = await request
      .GET(url)
      .header("X-Forwarded-Host", "www.keybr.com")
      .header("X-Forwarded-Proto", "https")
      .send();

    // Assert.

    t.is(response.status, 200);
    t.is(response.headers.get("Content-Type"), "text/html; charset=UTF-8");

    const $ = cheerio.load(await response.body.text());
    t.is($("script#page-data").length, 1);
    t.is($("main").length, 1);
    t.is($("nav").length, 1);
  });
}

test(`load custom theme from cookie`, async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

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

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "text/html; charset=UTF-8");
  t.deepEqual(response.headers.getAll("Set-Cookie"), []);

  const $ = cheerio.load(await response.body.text());
  t.is($("html").attr("data-color"), "dark");
  t.is($("html").attr("data-font"), "spectral");
});

test(`ignore invalid theme cookie`, async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request
    .GET("/")
    .header("X-Forwarded-Host", "www.keybr.com")
    .header("X-Forwarded-Proto", "https")
    .header("Cookie", new Cookie([["prefs", "%%%garbage%%%"]]))
    .send();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "text/html; charset=UTF-8");
  t.deepEqual(response.headers.getAll("Set-Cookie"), []);

  const $ = cheerio.load(await response.body.text());
  t.is($("html").attr("data-color"), "light");
  t.is($("html").attr("data-font"), "opensans");
});
