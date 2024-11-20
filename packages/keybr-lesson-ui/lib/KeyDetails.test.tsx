import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { isNotNull, isNull } from "rich-assert";
import { KeyDetails } from "./KeyDetails.tsx";

test("render uncalibrated", () => {
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

  isNotNull(r.queryByText("Not calibrated, need more samples."));
  isNull(r.queryByText("Learning rate:"));

  r.unmount();
});

test("render calibrated", () => {
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

  isNull(r.queryByText("Not calibrated, need more samples."));
  isNotNull(r.queryByText("Learning rate:"));

  r.unmount();
});
