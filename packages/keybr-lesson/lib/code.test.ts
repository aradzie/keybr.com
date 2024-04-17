import { Syntax } from "@keybr/code";
import { allCodePoints } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import test from "ava";
import { CodeLesson } from "./code.ts";
import { lessonProps } from "./settings.ts";

test("generate code fragment", (t) => {
  const settings = new Settings().set(lessonProps.code.syntax, Syntax.HTML);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new CodeLesson(settings, model, allCodePoints());
  const lessonKeys = lesson.update(lesson.analyze([]));
  lesson.rng = model.rng;

  t.true(lesson.generate(lessonKeys).length > 0);
});
