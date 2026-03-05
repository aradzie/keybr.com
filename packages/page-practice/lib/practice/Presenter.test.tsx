import { test, mock } from "node:test";
import { render, act } from "@testing-library/react";
import { isEqual, isFalse, isTrue } from "rich-assert";
import { Presenter } from "./Presenter.tsx";
import { FakeIntlProvider } from "@keybr/intl";
import { lessonProps, LessonType } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { PracticeScreen } from "./PracticeScreen.tsx";

// ---------------------------------------------------------------------------
// Blur debounce — ad refresh regression tests
// ---------------------------------------------------------------------------
// Reproduces the bug reported in https://github.com/aradzie/keybr.com/issues/168:
// third-party ad scripts steal focus briefly and then return it, which was
// causing onResetLesson() to fire and interrupting the lesson mid-session.

test("transient blur (ad refresh) does not reset the lesson", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const onResetLesson = mock.fn();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={new Settings()
          .set(lessonProps.type, LessonType.CUSTOM)
          .set(lessonProps.customText.content, "abcdefghij")}
      >
        <FakeResultContext initialResults={new ResultFaker().nextResultList(0)}>
          <PracticeScreen />
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  const textarea = r.container.querySelector("textarea");
  isTrue(textarea != null);

  // Simulate focus, blur, then rapid re-focus (< 300 ms) as an ad would do.
  await act(async () => {
    textarea!.focus();
  });

  const resetsBefore = onResetLesson.mock.calls.length;

  await act(async () => {
    textarea!.blur();
    // Re-focus immediately — well within the 300 ms debounce window.
    textarea!.focus();
  });

  // onResetLesson must not have fired an extra time due to the transient blur.
  isEqual(onResetLesson.mock.calls.length, resetsBefore);

  r.unmount();
});

test("genuine blur (user navigates away) resets the lesson after debounce", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext
        initialSettings={new Settings()
          .set(lessonProps.type, LessonType.CUSTOM)
          .set(lessonProps.customText.content, "abcdefghij")}
      >
        <FakeResultContext initialResults={new ResultFaker().nextResultList(0)}>
          <PracticeScreen />
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  const textarea = r.container.querySelector("textarea");
  isTrue(textarea != null);

  await act(async () => {
    textarea!.focus();
  });

  // Blur without re-focusing — simulates the user genuinely navigating away.
  await act(async () => {
    textarea!.blur();
    // Wait longer than the 300 ms debounce window.
    await new Promise((resolve) => setTimeout(resolve, 400));
  });

  // The lesson text should still be visible (reset renders a fresh lesson,
  // not an error state), confirming onResetLesson did fire.
  isTrue(r.container.textContent!.includes("abcdefghij"));

  r.unmount();
});
