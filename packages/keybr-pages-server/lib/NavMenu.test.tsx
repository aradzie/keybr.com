import { FakeIntlProvider, PreferredLocaleContext } from "@keybr/intl";
import { PageDataContext, Sitemap } from "@keybr/pages-shared";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { NavMenu } from "./NavMenu.tsx";

test("render", (t) => {
  const renderer = TestRenderer.create(
    <PageDataContext.Provider
      value={{
        base: "https://www.keybr.com/",
        locale: "en",
        user: null,
        publicUser: {
          id: "userId",
          name: "userName",
          imageUrl: "imageUrl",
          premium: false,
        },
        settings: null,
        prefs: null,
        extra: {},
      }}
    >
      <PreferredLocaleContext.Provider value="pl">
        <FakeIntlProvider>
          <NavMenu currentLink={Sitemap.practice.bind(null)} />
        </FakeIntlProvider>
      </PreferredLocaleContext.Provider>
    </PageDataContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});
