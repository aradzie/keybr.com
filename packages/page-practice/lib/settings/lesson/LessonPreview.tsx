import { type Lesson } from "@keybr/lesson";
import { CurrentKeyRow, KeySetRow } from "@keybr/lesson-ui";
import { LCG } from "@keybr/rand";
import { useResults } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import {
  TextInput,
  toTextDisplaySettings,
  toTextInputSettings,
} from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { FieldSet } from "@keybr/widget";
import { type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";
import * as styles from "./LessonPreview.module.less";

export function LessonPreview({
  lesson,
}: {
  readonly lesson: Lesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const { results } = useResults();
  const keyStatsMap = useMemo(() => {
    return lesson.analyze(lesson.filter(results));
  }, [lesson, results]);
  const [lessonKeys, textInput] = useMemo(() => {
    lesson.rng = LCG(123);
    const lessonKeys = lesson.update(keyStatsMap);
    const fragment = lesson.generate(lessonKeys);
    const textInput = new TextInput(fragment, toTextInputSettings(settings));
    return [lessonKeys, textInput];
  }, [lesson, settings, keyStatsMap]);
  return (
    <FieldSet
      legend={formatMessage({
        id: "settings.previewLesson.label",
        defaultMessage: "Lesson Preview",
      })}
    >
      <div className={styles.preview}>
        <KeySetRow lessonKeys={lessonKeys} />
        <CurrentKeyRow lessonKeys={lessonKeys} />
        <StaticText
          settings={toTextDisplaySettings(settings)}
          lines={textInput.getLines()}
        />
      </div>
    </FieldSet>
  );
}
