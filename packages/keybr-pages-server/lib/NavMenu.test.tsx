import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext, Sitemap } from "@keybr/pages-shared";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { NavMenu } from "./NavMenu.tsx";

test("render", (t) => {
  const testRenderer = TestRenderer.create(
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
      <FakeIntlProvider>
        <NavMenu currentLink={Sitemap.practice.bind(null)} />
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  t.snapshot(testRenderer.toJSON());
});
