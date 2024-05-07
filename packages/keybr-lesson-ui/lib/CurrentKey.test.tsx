import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey, LessonKeys } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { CurrentKey } from "./CurrentKey.tsx";

const { letters } = FakePhoneticModel;

test.serial("render no key", (t) => {
  const lessonKeys = new LessonKeys([
    new LessonKey({
      letter: letters[0],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
      confidence: 1.0,
      bestConfidence: 1.0,
    }).asIncluded(),
  ]);

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <CurrentKey lessonKeys={lessonKeys} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("All keys are unlocked."), null);
  t.is(r.queryByText("Learning rate:"), null);

  r.unmount();
});

test.serial("render key", (t) => {
  const lessonKeys = new LessonKeys([
    new LessonKey({
      letter: letters[0],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
      confidence: 1.0,
      bestConfidence: 1.0,
    }).asFocused(),
  ]);

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <CurrentKey lessonKeys={lessonKeys} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.is(r.queryByText("All keys are unlocked."), null);
  t.not(r.queryByText("Learning rate:"), null);

  r.unmount();
});
