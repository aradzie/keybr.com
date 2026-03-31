import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { lessonProps, LessonType } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import { includes, isNotNull } from "rich-assert";
import { PracticeScreen } from "./PracticeScreen.tsx";

// ---------------------------------------------------------------------------
// Blur debounce — ad refresh regression tests
// ---------------------------------------------------------------------------
// Reproduces the bug reported in https://github.com/aradzie/keybr.com/issues/168:
// third-party ad scripts steal focus briefly and then return it, which was
// causing onResetLesson() to fire and interrupting the lesson mid-session.

const faker = new ResultFaker();

test("transient blur (ad refresh) does not reset the lesson", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={new Settings()
          .set(lessonProps.type, LessonType.CUSTOM)
          .set(lessonProps.customText.content, "abcdefghij")}
      >
        <FakeResultContext initialResults={faker.nextResultList(0)}>
          <PracticeScreen />
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Wait for the async practice screen to fully load.
  isNotNull(await r.findByTitle("Change lesson settings", { exact: false }));

  const textarea = r.container.querySelector("textarea");
  isNotNull(textarea);

  // Grab the lesson text before the blur cycle.
  const textBefore = r.container.textContent!;
  includes(textBefore, "abcdefghij");

  // Focus → blur → rapid re-focus (< 300 ms debounce) simulates an ad refresh.
  await act(async () => {
    textarea!.focus();
  });
  await act(async () => {
    textarea!.blur();
    textarea!.focus();
  });

  // The lesson text should be unchanged — the transient blur must not have
  // triggered a lesson reset.
  includes(r.container.textContent!, "abcdefghij");

  r.unmount();
});
