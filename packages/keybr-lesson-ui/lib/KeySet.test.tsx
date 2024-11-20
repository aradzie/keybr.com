import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { LessonKey, LessonKeys } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { deepEqual, isNotNull } from "rich-assert";
import { KeySet } from "./KeySet.tsx";

test("render", async () => {
  const { letters } = FakePhoneticModel;

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

  const events: string[] = [];

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySet
          lessonKeys={lessonKeys}
          onKeyHoverIn={(key) => {
            events.push(`hover in ${key.letter}`);
          }}
          onKeyHoverOut={(key) => {
            events.push(`hover out ${key.letter}`);
          }}
          onKeyClick={(key) => {
            events.push(`click ${key.letter}`);
          }}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByText("A"));
  isNotNull(r.queryByText("B"));
  isNotNull(r.queryByText("C"));

  events.length = 0;
  await userEvent.hover(r.getByText("A"));
  deepEqual(events, ["hover in A"]);

  events.length = 0;
  await userEvent.unhover(r.getByText("A"));
  deepEqual(events, ["hover out A"]);

  events.length = 0;
  await userEvent.click(r.getByText("A"));
  deepEqual(events, ["hover in A", "click A"]);

  r.unmount();
});
