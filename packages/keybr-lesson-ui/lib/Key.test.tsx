import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { equal, isNotNull } from "rich-assert";
import { Key } from "./Key.tsx";

test("render excluded", () => {
  const key = new LessonKey({
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
        <Key lessonKey={key} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  const elem = r.container.querySelector(".lessonKey_excluded");
  isNotNull(elem);
  equal(Key.attached(elem), key);

  r.unmount();
});

test("render included", () => {
  const key = new LessonKey({
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
        <Key lessonKey={key} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  const elem = r.container.querySelector(".lessonKey_included");
  isNotNull(elem);
  equal(Key.attached(elem), key);

  r.unmount();
});

test("render focused", () => {
  const key = new LessonKey({
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
        <Key lessonKey={key} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  const elem = r.container.querySelector(".lessonKey_focused");
  isNotNull(elem);
  equal(Key.attached(elem), key);

  r.unmount();
});
