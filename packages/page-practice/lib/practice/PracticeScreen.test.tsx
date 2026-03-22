import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { lessonProps, LessonType } from "@keybr/lesson";
import { type PageData, PageDataContext } from "@keybr/pages-shared";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { render } from "@testing-library/react";
import { includes, isNotNull } from "rich-assert";
import { PracticeScreen } from "./PracticeScreen.tsx";

const faker = new ResultFaker();

test("render", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: null,
  };

  const r = render(
    <PageDataContext.Provider value={mockPageData}>
      <FakeIntlProvider>
        <FakeSettingsContext
          initialSettings={new Settings()
            .set(lessonProps.type, LessonType.CUSTOM)
            .set(lessonProps.customText.content, "abcdefghij")}
        >
          <FakeResultContext initialResults={faker.nextResultList(100)}>
            <PracticeScreen />
          </FakeResultContext>
        </FakeSettingsContext>
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  isNotNull(await r.findByTitle("Change lesson settings", { exact: false }));
  includes(r.container.textContent!, "abcdefghij");

  r.unmount();
});
