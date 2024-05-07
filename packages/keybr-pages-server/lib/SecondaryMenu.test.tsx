import { FakeIntlProvider, PreferredLocaleContext } from "@keybr/intl";
import { PageDataContext, Sitemap } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { SecondaryMenu } from "./SecondaryMenu.tsx";

test("render", (t) => {
  const r = render(
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
          <SecondaryMenu currentLink={Sitemap.practice.bind(null)} />
        </FakeIntlProvider>
      </PreferredLocaleContext.Provider>
    </PageDataContext.Provider>,
  );

  t.not(r.queryByText("Polski"), null);
  t.not(r.queryByText("English"), null);

  r.unmount();
});
