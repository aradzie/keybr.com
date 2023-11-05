import { keyboardProps } from "@keybr/keyboard";
import { type Lesson } from "@keybr/lesson";
import { CurrentKeyRow, KeySetRow } from "@keybr/lesson-ui";
import { LCG } from "@keybr/rand";
import { ResultGroups, useResults } from "@keybr/result";
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
  const layout = settings.get(keyboardProps.layout);
  const keyStatsMap = useMemo(() => {
    return lesson.analyze(
      ResultGroups.byLayoutFamily(results).get(layout.family),
    );
  }, [lesson, results, layout]);
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
        description: "Header text.",
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
