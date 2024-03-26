import { Manifest, ManifestContext } from "@keybr/assets";
import { FakeIntlProvider } from "@keybr/intl";
import { ThemeContext } from "@keybr/lnf";
import {
  type PageData,
  PageDataContext,
  PageLinkTemplate,
} from "@keybr/pages-shared";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { StandardLayout } from "./StandardLayout.tsx";
import { type PageMeta } from "./types.ts";

test("render", (t) => {
  const pageMeta: PageMeta = {
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
  };
  const pageData: PageData = {
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
      themeName: "light",
      textSize: "normal",
    },
    extra: {},
  };

  const renderer = TestRenderer.create(
    <ManifestContext.Provider value={Manifest.fake}>
      <ThemeContext.Provider
        value={{
          fullscreenState: null,
          themeName: "light",
          textSize: "normal",
          toggleFullscreen: () => {},
          switchTheme: () => {},
          switchTextSize: () => {},
        }}
      >
        <PageDataContext.Provider value={pageData}>
          <FakeIntlProvider>
            <StandardLayout pageMeta={pageMeta}>
              <div>body</div>
            </StandardLayout>
          </FakeIntlProvider>
        </PageDataContext.Provider>
      </ThemeContext.Provider>
    </ManifestContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render alt", (t) => {
  const pageMeta: PageMeta = {
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
  };
  const pageData: PageData = {
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
      themeName: "light",
      textSize: "normal",
    },
    extra: {},
  };

  const renderer = TestRenderer.create(
    <ManifestContext.Provider value={Manifest.fake}>
      <ThemeContext.Provider
        value={{
          fullscreenState: null,
          themeName: "light",
          textSize: "normal",
          toggleFullscreen: () => {},
          switchTheme: () => {},
          switchTextSize: () => {},
        }}
      >
        <PageDataContext.Provider value={pageData}>
          <FakeIntlProvider>
            <StandardLayout pageMeta={pageMeta}>
              <div>body</div>
            </StandardLayout>
          </FakeIntlProvider>
        </PageDataContext.Provider>
      </ThemeContext.Provider>
    </ManifestContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});
