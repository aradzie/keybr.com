import { type IncomingHeaders } from "@fastr/headers";
import { Manifest, ManifestContext } from "@keybr/assets";
import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext, Pages } from "@keybr/pages-shared";
import test from "ava";
import { load } from "cheerio";
import { renderToStaticMarkup } from "react-dom/server";
import { Shell } from "./Shell.tsx";

test("render", (t) => {
  const html = renderToStaticMarkup(
    <ManifestContext.Provider value={Manifest.fake}>
      <PageDataContext.Provider
        value={{
          base: "https://www.keybr.com/",
          locale: "en",
          user: null,
          publicUser: {
            id: null,
            name: "name",
            imageUrl: null,
          },
          settings: null,
          prefs: null,
        }}
      >
        <FakeIntlProvider>
          <Shell page={Pages.practice} headers={fakeHeaders()} />
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = load(html);

  t.deepEqual($("html").attr(), {
    "prefix": "og: http://ogp.me/ns#",
    "lang": "en",
    "dir": "ltr",
    "data-color": "system",
    "data-font": "opensans",
  });
  t.true(html.includes("google"));
  t.true(html.includes("cloudflare"));
  t.is($("nav").length, 0);
});

test("render alt", (t) => {
  const html = renderToStaticMarkup(
    <ManifestContext.Provider value={Manifest.fake}>
      <PageDataContext.Provider
        value={{
          base: "https://www.keybr.com/",
          locale: "en",
          user: null,
          publicUser: {
            id: "abc",
            name: "name",
            imageUrl: null,
            premium: true,
          },
          settings: null,
          prefs: null,
        }}
      >
        <FakeIntlProvider>
          <Shell page={Pages.practice} headers={fakeHeaders()} />
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = load(html);

  t.deepEqual($("html").attr(), {
    "prefix": "og: http://ogp.me/ns#",
    "lang": "en",
    "dir": "ltr",
    "data-color": "system",
    "data-font": "opensans",
  });
  t.false(html.includes("google"));
  t.false(html.includes("cloudflare"));
  t.is($("nav").length, 0);
});

test("render for a bot", (t) => {
  const html = renderToStaticMarkup(
    <ManifestContext.Provider value={Manifest.fake}>
      <PageDataContext.Provider
        value={{
          base: "https://www.keybr.com/",
          locale: "en",
          user: null,
          publicUser: {
            id: null,
            name: "name",
            imageUrl: null,
          },
          settings: null,
          prefs: null,
        }}
      >
        <FakeIntlProvider>
          <Shell
            page={Pages.practice}
            headers={fakeHeaders({ useragent: "Googlebot" })}
          />
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = load(html);

  t.deepEqual($("html").attr(), {
    "prefix": "og: http://ogp.me/ns#",
    "lang": "en",
    "dir": "ltr",
    "data-color": "system",
    "data-font": "opensans",
  });
  t.is($("nav").length, 1);
});

function fakeHeaders(entries: Record<string, string> = {}) {
  const map = new Map(Object.entries(entries));
  return {
    get(name) {
      return map.get(name.toLowerCase()) ?? null;
    },
  } as IncomingHeaders;
}
