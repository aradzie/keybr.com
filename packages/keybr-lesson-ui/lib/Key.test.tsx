import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { Key } from "./Key.tsx";

test("render excluded", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key
          lessonKey={new LessonKey({
            letter: FakePhoneticModel.letter1,
            samples: [],
            timeToType: null,
            bestTimeToType: null,
            confidence: null,
            bestConfidence: null,
          }).asExcluded()}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  assert.isNotNull(r.container.querySelector(".lessonKey_excluded"));

  r.unmount();
});

test("render included", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key
          lessonKey={new LessonKey({
            letter: FakePhoneticModel.letter1,
            samples: [],
            timeToType: null,
            bestTimeToType: null,
            confidence: null,
            bestConfidence: null,
          }).asIncluded()}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  assert.isNotNull(r.container.querySelector(".lessonKey_included"));

  r.unmount();
});

test("render focused", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key
          lessonKey={new LessonKey({
            letter: FakePhoneticModel.letter1,
            samples: [],
            timeToType: null,
            bestTimeToType: null,
            confidence: null,
            bestConfidence: null,
          }).asFocused()}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  assert.isNotNull(r.container.querySelector(".lessonKey_focused"));

  r.unmount();
});
