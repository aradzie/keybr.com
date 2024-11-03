import { test } from "node:test";
import { Syntax } from "@keybr/code";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import { flattenStyledText } from "@keybr/textinput";
import { assert } from "chai";
import { CodeLesson } from "./code.ts";
import { lessonProps } from "./settings.ts";

test("generate code fragment", () => {
  const settings = new Settings().set(lessonProps.code.syntax, Syntax.HTML);
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();
  const lesson = new CodeLesson(settings, keyboard, model);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
  lesson.rng = model.rng;

  const text = lesson.generate(lessonKeys);
  assert.isTrue(flattenStyledText(text).length > 0);
});
