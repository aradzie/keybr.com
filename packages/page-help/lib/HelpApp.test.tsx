import { FakeIntlProvider } from "@keybr/intl";
import { type PageData, PageDataContext } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { HelpApp } from "./HelpApp.tsx";

test.serial("render", (t) => {
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
      color: "light",
      font: "opensans",
    },
    extra: {},
  };

  const r = render(
    <PageDataContext.Provider value={pageData}>
      <FakeIntlProvider>
        <HelpApp />
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  t.not(r.queryByText("Learn to type faster"), null);

  r.unmount();
});
