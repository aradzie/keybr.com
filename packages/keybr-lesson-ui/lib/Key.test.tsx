import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { Key } from "./Key.tsx";

test("render excluded", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  }).asExcluded();

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render included", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  }).asIncluded();

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render focused", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  }).asFocused();

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});
