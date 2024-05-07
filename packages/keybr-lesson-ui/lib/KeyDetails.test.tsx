import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { KeyDetails } from "./KeyDetails.tsx";

test.serial("render uncalibrated", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: null,
    bestTimeToType: null,
    confidence: null,
    bestConfidence: null,
  });

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyDetails lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("Not calibrated, need more samples."), null);
  t.is(r.queryByText("Learning rate:"), null);

  r.unmount();
});

test.serial("render calibrated", (t) => {
  const lessonKey = new LessonKey({
    letter: FakePhoneticModel.letter1,
    samples: [],
    timeToType: 100,
    bestTimeToType: 100,
    confidence: 1.0,
    bestConfidence: 1.0,
  });

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyDetails lessonKey={lessonKey} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.is(r.queryByText("Not calibrated, need more samples."), null);
  t.not(r.queryByText("Learning rate:"), null);

  r.unmount();
});
