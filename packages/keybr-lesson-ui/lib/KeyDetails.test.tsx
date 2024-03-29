import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyDetails } from "./KeyDetails.tsx";

test("render uncalibrated", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  });

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyDetails className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render calibrated", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: 100,
    bestTimeToType: 100,
    confidence: 1.0,
    bestConfidence: 1.0,
  });

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyDetails className="custom" lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});
