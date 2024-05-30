import { Syntax } from "@keybr/code";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import test from "ava";
import { CodeLesson } from "./code.ts";
import { lessonProps } from "./settings.ts";

test("generate code fragment", (t) => {
  const settings = new Settings().set(lessonProps.code.syntax, Syntax.HTML);
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();
  const lesson = new CodeLesson(settings, keyboard, model);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
  lesson.rng = model.rng;

  t.true(lesson.generate(lessonKeys).length > 0);
});
