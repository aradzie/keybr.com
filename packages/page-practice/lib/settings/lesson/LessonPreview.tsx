import { type Lesson } from "@keybr/lesson";
import { CurrentKeyRow, KeySetRow } from "@keybr/lesson-ui";
import { LCG } from "@keybr/rand";
import { makeKeyStatsMap, useResults } from "@keybr/result";
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
  const { lessonKeys, textInput } = useMemo(() => {
    const lessonKeys = lesson.update(
      makeKeyStatsMap(lesson.letters, lesson.filter(results)),
    );
    const textInput = new TextInput(
      lesson.generate(lessonKeys, LCG(123)),
      toTextInputSettings(settings),
    );
    return { lessonKeys, textInput };
  }, [settings, lesson, results]);
  return (
    <FieldSet
      legend={formatMessage({
        id: "t_Lesson_preview:",
        defaultMessage: "Lesson preview",
      })}
    >
      <div className={styles.root}>
        <KeySetRow lessonKeys={lessonKeys} />
        <CurrentKeyRow lessonKeys={lessonKeys} />
        <div className={styles.text}>
          <StaticText
            settings={toTextDisplaySettings(settings)}
            lines={textInput.lines}
          />
        </div>
      </div>
    </FieldSet>
  );
}
