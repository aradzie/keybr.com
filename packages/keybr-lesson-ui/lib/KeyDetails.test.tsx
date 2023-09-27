import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey, MIN_TIME } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyDetails } from "./KeyDetails.tsx";

test("render uncalibrated", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: NaN,
    bestTimeToType: NaN,
  });

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyDetails className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render calibrated", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: MIN_TIME,
    bestTimeToType: MIN_TIME,
  });

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyDetails className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
