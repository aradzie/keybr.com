import { test } from "node:test";
import { Application } from "@fastr/core";
import { load } from "cheerio";
import { equal, isTrue } from "rich-assert";
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

  equal(response.status, 200);
  equal(response.headers.get("Content-Type"), "application/xml; charset=UTF-8");

  // Arrange.

  const urls = new Set<string>();

  const sitemap = xml2js(body, { compact: true }) as ElementCompact;
  const primaries = sitemap["urlset"]["url"];
  isTrue(Array.isArray(primaries));
  isTrue(primaries.length > 0);
  for (const primary of primaries) {
    urls.add(primary["loc"]._text);
    const alternates = primary["xhtml:link"];
    isTrue(Array.isArray(alternates));
    isTrue(alternates.length > 0);
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

    equal(response.status, 200);
    equal(response.headers.get("Content-Type"), "text/html; charset=UTF-8");

    const $ = load(await response.body.text());
    equal($("script#page-data").length, 1);
    equal($("#root").length, 1);
  }
});
