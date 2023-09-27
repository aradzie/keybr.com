import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey, LessonKeys } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeySet } from "./KeySet.tsx";

const { letters } = FakePhoneticModel;

test("render", (t) => {
  const lessonKeys = new LessonKeys([
    new LessonKey({
      letter: letters[0],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
    }).asBoosted(),
    new LessonKey({
      letter: letters[1],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
    }).asIncluded(),
    new LessonKey({
      letter: letters[2],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
    }).asForced(),
    new LessonKey({
      letter: letters[3],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
    }),
  ]);

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySet className="custom" lessonKeys={lessonKeys} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
