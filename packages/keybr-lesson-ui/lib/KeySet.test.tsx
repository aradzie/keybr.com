import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey, LessonKeys } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { KeySet } from "./KeySet.tsx";

const { letters } = FakePhoneticModel;

test.serial("render", (t) => {
  const lessonKeys = new LessonKeys([
    new LessonKey({
      letter: letters[0],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
      confidence: 1.0,
      bestConfidence: 1.0,
    }).asFocused(),
    new LessonKey({
      letter: letters[1],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
      confidence: 1.0,
      bestConfidence: 1.0,
    }).asIncluded(),
    new LessonKey({
      letter: letters[2],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
      confidence: 1.0,
      bestConfidence: 1.0,
    }).asForced(),
    new LessonKey({
      letter: letters[3],
      samples: [],
      timeToType: 100,
      bestTimeToType: 100,
      confidence: 1.0,
      bestConfidence: 1.0,
    }),
  ]);

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySet lessonKeys={lessonKeys} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("A"), null);
  t.not(r.queryByText("B"), null);
  t.not(r.queryByText("C"), null);

  r.unmount();
});
