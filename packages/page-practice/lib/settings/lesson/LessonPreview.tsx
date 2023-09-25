import { type Lesson } from "@keybr/lesson";
import { CurrentKeyRow, KeySetRow } from "@keybr/lesson-ui";
import { LCG } from "@keybr/rand";
import { ResultGroups, useResults } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { TextInput } from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { FieldSet } from "@keybr/widget";
import { type ReactNode, useMemo } from "react";
import { useIntl } from "react-intl";

export function LessonPreview({
  lesson,
}: {
  readonly lesson: Lesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const { results } = useResults();
  const { layout } = settings;
  const group = useMemo(
    () => ResultGroups.byLayoutFamily(results).get(layout.family),
    [results, layout],
  );
  const keyStatsMap = useMemo(() => lesson.analyze(group), [lesson, group]);
  lesson.rng = LCG(123);
  const lessonKeys = lesson.update(keyStatsMap);
  const fragment = lesson.generate(lessonKeys);
  const textInput = new TextInput(fragment, settings);

  return (
    <FieldSet
      legend={formatMessage({
        id: "settings.previewLabel",
        description: "Fieldset label.",
        defaultMessage: "Lesson Preview",
      })}
    >
      <KeySetRow lessonKeys={lessonKeys} />
      <CurrentKeyRow lessonKeys={lessonKeys} />
      <StaticText settings={settings} chars={textInput.getChars()} />
    </FieldSet>
  );
}
