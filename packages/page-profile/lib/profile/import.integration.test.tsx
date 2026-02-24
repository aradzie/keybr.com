import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { type PageData, PageDataContext } from "@keybr/pages-shared";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, Result, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isNotNull } from "rich-assert";
import { FooterSection } from "./FooterSection.tsx";

const faker = new ResultFaker();

test("render import button", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <PageDataContext.Provider
        value={{ publicUser: { id: "abc" } } as PageData}
      >
        <FakeSettingsContext>
          <FakeResultContext initialResults={faker.nextResultList(10)}>
            <FooterSection />
          </FakeResultContext>
        </FakeSettingsContext>
      </PageDataContext.Provider>
    </FakeIntlProvider>,
  );

  // Check that import button exists
  const importButton = await r.findByText("Import data");
  isNotNull(importButton);

  r.unmount();
});

test("render all footer buttons", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <PageDataContext.Provider
        value={{ publicUser: { id: "abc" } } as PageData}
      >
        <FakeSettingsContext>
          <FakeResultContext initialResults={faker.nextResultList(10)}>
            <FooterSection />
          </FakeResultContext>
        </FakeSettingsContext>
      </PageDataContext.Provider>
    </FakeIntlProvider>,
  );

  // Check all footer buttons are rendered
  isNotNull(await r.findByText("Import data"));
  isNotNull(await r.findByText("Download data"));
  isNotNull(await r.findByText("Reset statistics"));

  r.unmount();
});
