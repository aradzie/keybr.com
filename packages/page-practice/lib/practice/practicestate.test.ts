import { Lesson, LessonKey, LessonKeys } from "@keybr/lesson";
import { FakePhoneticModel, type PhoneticModel } from "@keybr/phonetic-model";
import {
  type KeyStatsMap,
  newKeyStatsMap,
  type Result,
  ResultFaker,
} from "@keybr/result";
import { Settings } from "@keybr/settings";
import test from "ava";
import { PracticeState } from "./practicestate.ts";

test("compute announcements when no results", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel();
  const lesson = new FakeLesson(settings, model);
  const state = new PracticeState(settings, lesson, [], () => {});

  t.deepEqual(state.announcements, []);
});

test("compute announcements when the boosted key has results", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel();
  const lesson = new FakeLesson(settings, model);
  const results = new ResultFaker({
    letters: [FakePhoneticModel.letter1],
  }).nextResultList(1);
  const state = new PracticeState(settings, lesson, results, () => {});

  t.deepEqual(state.announcements, []);
});

test("compute announcements when the boosted key has no results", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel();
  const lesson = new FakeLesson(settings, model);
  const results = new ResultFaker({
    letters: [FakePhoneticModel.letter2],
  }).nextResultList(1);
  const state = new PracticeState(settings, lesson, results, () => {});

  t.deepEqual(state.announcements, [
    {
      lessonKey: new LessonKey({
        letter: FakePhoneticModel.letter1,
        samples: [],
        timeToType: null,
        bestTimeToType: null,
        confidence: null,
        bestConfidence: null,
      }).asBoosted(),
    },
  ]);
});

class FakeLesson extends Lesson {
  constructor(settings: Settings, model: PhoneticModel) {
    super(settings, model, new Set());
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    const keys = LessonKeys.includeAll(keyStatsMap);
    keys.boost(FakePhoneticModel.letter1);
    return keys;
  }

  override generate(lessonKeys: LessonKeys): string {
    return "text";
  }
}
