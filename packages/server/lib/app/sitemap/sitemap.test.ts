import { Application } from "@fastr/core";
import cheerio from "cheerio";
import { type ElementCompact, xml2js } from "xml-js";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";

test("load sitemap.xml", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request
    .GET("/sitemap.xml")
    .header("X-Forwarded-Host", "www.keybr.com")
    .header("X-Forwarded-Proto", "https")
    .send();
  const body = await response.body.text();

  // Assert.

  t.is(response.status, 200);
  t.is(response.headers.get("Content-Type"), "application/xml; charset=UTF-8");

  // Arrange.

  const urls = new Set<string>();

  const sitemap = xml2js(body, { compact: true }) as ElementCompact;
  const primaries = sitemap["urlset"]["url"];
  t.true(Array.isArray(primaries));
  t.true(primaries.length > 0);
  for (const primary of primaries) {
    urls.add(primary["loc"]._text);
    const alternates = primary["xhtml:link"];
    t.true(Array.isArray(alternates));
    t.true(alternates.length > 0);
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

    t.is(response.status, 200);
    t.is(response.headers.get("Content-Type"), "text/html; charset=UTF-8");

    const $ = cheerio.load(await response.body.text());
    t.is($("script#page-data").length, 1);
    t.is($("main").length, 1);
    t.is($("nav").length, 1);
  }
});
