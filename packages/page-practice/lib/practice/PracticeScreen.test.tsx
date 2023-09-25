import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext, LessonType, Settings } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { PracticeScreen } from "./PracticeScreen.tsx";

const faker = new ResultFaker();

test.serial("render", async (t) => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={
          new Settings({
            lessonType: LessonType.CUSTOM,
            textContent: "abcdefghij",
          })
        }
      >
        <FakeResultContext initialResults={faker.nextResultList(100)}>
          <PracticeScreen onConfigure={() => {}} />
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(await r.findByText("Speed:"), null);
  t.not(await r.findByText("Accuracy:"), null);
  t.not(await r.findByText("Score:"), null);
  t.not(await r.findByText("Settings..."), null);
  t.true(r.container.textContent?.includes("abcdefghij"));

  r.unmount();
});
