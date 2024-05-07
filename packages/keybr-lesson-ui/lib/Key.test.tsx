import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { Key } from "./Key.tsx";

test.serial("render excluded", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  }).asExcluded();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(r.container.querySelector(".lessonKey_excluded"), null);

  r.unmount();
});

test.serial("render included", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  }).asIncluded();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(r.container.querySelector(".lessonKey_included"), null);

  r.unmount();
});

test.serial("render focused", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  }).asFocused();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(r.container.querySelector(".lessonKey_focused"), null);

  r.unmount();
});
