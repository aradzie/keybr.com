import { FakeIntlProvider } from "@keybr/intl";
import { type PageData, PageDataContext } from "@keybr/pages-shared";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { ProfileApp } from "./ProfileApp.tsx";

const faker = new ResultFaker();

test.serial("render", async (t) => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <PageDataContext.Provider
        value={{ publicUser: { id: "abc" } } as PageData}
      >
        <FakeSettingsContext>
          <FakeResultContext initialResults={faker.nextResultList(100)}>
            <ProfileApp />
          </FakeResultContext>
        </FakeSettingsContext>
      </PageDataContext.Provider>
    </FakeIntlProvider>,
  );

  t.not(await r.findByText("Typing Speed"), null);
  t.not(await r.findByText("Key Typing Speed"), null);

  r.unmount();
});
