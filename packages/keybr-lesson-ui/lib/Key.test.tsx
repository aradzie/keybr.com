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
    timeToType: NaN,
    bestTimeToType: NaN,
  }).asExcluded();

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render included", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: NaN,
    bestTimeToType: NaN,
  }).asIncluded();

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render boosted", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: NaN,
    bestTimeToType: NaN,
  }).asBoosted();

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Key className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
