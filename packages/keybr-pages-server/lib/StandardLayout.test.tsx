import { Manifest, ManifestContext } from "@keybr/assets";
import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext, PageLinkTemplate } from "@keybr/pages-shared";
import test from "ava";
import cheerio from "cheerio";
import { renderToStaticMarkup } from "react-dom/server";
import { StandardLayout } from "./StandardLayout.tsx";

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
          extra: {},
        }}
      >
        <FakeIntlProvider>
          <StandardLayout
            pageMeta={{
              pageLink: new PageLinkTemplate<null>({
                path: "/path",
                name: {
                  id: "name",
                  defaultMessage: "name",
                },
                title: {
                  id: "title",
                  defaultMessage: "title",
                },
              }).bind(null),
              title: "example title",
              description: "example description",
              entrypoint: "foobar",
            }}
          >
            <div>body</div>
          </StandardLayout>
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = cheerio.load(html);

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
          extra: {},
        }}
      >
        <FakeIntlProvider>
          <StandardLayout
            pageMeta={{
              pageLink: new PageLinkTemplate<null>({
                path: "/path",
                name: {
                  id: "name",
                  defaultMessage: "name",
                },
                title: {
                  id: "title",
                  defaultMessage: "title",
                },
              }).bind(null),
              title: "example title",
              description: "example description",
              entrypoint: "foobar",
            }}
          >
            <div>body</div>
          </StandardLayout>
        </FakeIntlProvider>
      </PageDataContext.Provider>
    </ManifestContext.Provider>,
  );

  const $ = cheerio.load(html);

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
