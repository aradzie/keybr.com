import { Manifest, ManifestContext } from "@keybr/assets";
import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext, type Pages } from "@keybr/pages-shared";
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
          prefs: {
            color: "light",
            font: "opensans",
          },
        }}
      >
        <FakeIntlProvider>
          <Shell
            meta={
              {
                path: "/",
                meta: {
                  title: "example title",
                  description: "example description",
                },
              } as Pages.Meta
            }
          >
            <div>body</div>
          </Shell>
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = load(html);

  t.deepEqual($("html").attr(), {
    "prefix": "og: http://ogp.me/ns#",
    "lang": "en",
    "dir": "ltr",
    "data-color": "light",
    "data-font": "opensans",
  });
  t.true(html.includes("google"));
  t.true(html.includes("cloudflare"));
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
          prefs: {
            color: "light",
            font: "opensans",
          },
        }}
      >
        <FakeIntlProvider>
          <Shell
            meta={
              {
                path: "/",
                meta: {
                  title: "example title",
                  description: "example description",
                },
              } as Pages.Meta
            }
          >
            <div>body</div>
          </Shell>
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = load(html);

  t.deepEqual($("html").attr(), {
    "prefix": "og: http://ogp.me/ns#",
    "lang": "en",
    "dir": "ltr",
    "data-color": "light",
    "data-font": "opensans",
  });
  t.false(html.includes("google"));
  t.false(html.includes("cloudflare"));
});
