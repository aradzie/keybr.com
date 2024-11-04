import { test } from "node:test";
import { Application } from "@fastr/core";
import { assert } from "chai";
import { load } from "cheerio";
import { type ElementCompact, xml2js } from "xml-js";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const context = new TestContext();

test("load sitemap.xml", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request
    .GET("/sitemap.xml")
    .header("X-Forwarded-Host", "www.keybr.com")
    .header("X-Forwarded-Proto", "https")
    .send();
  const body = await response.body.text();

  // Assert.

  assert.strictEqual(response.status, 200);
  assert.strictEqual(
    response.headers.get("Content-Type"),
    "application/xml; charset=UTF-8",
  );

  // Arrange.

  const urls = new Set<string>();

  const sitemap = xml2js(body, { compact: true }) as ElementCompact;
  const primaries = sitemap["urlset"]["url"];
  assert.isTrue(Array.isArray(primaries));
  assert.isTrue(primaries.length > 0);
  for (const primary of primaries) {
    urls.add(primary["loc"]._text);
    const alternates = primary["xhtml:link"];
    assert.isTrue(Array.isArray(alternates));
    assert.isTrue(alternates.length > 0);
    for (const alternate of alternates) {
      urls.add(alternate._attributes["href"]);
    }
  }

  for (const url of urls) {
    // Act.

    const response = await request
      .GET(new URL(url).pathname)
      .header("X-Forwarded-Host", "www.keybr.com")
      .header("X-Forwarded-Proto", "https")
      .send();

    // Assert.

    assert.strictEqual(response.status, 200);
    assert.strictEqual(
      response.headers.get("Content-Type"),
      "text/html; charset=UTF-8",
    );

    const $ = load(await response.body.text());
    assert.strictEqual($("script#page-data").length, 1);
    assert.strictEqual($("#root").length, 1);
  }
});
