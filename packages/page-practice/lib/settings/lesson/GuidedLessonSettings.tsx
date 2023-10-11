import { type GuidedLesson } from "@keybr/lesson";
import { FieldSet, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AlphabetSizeProp } from "./AlphabetSizeProp.tsx";
import { LessonLengthProp } from "./LessonLengthProp.tsx";
import { TargetSpeedProp } from "./TargetSpeedProp.tsx";
import { TextManglingProp } from "./TextManglingProp.tsx";

export function GuidedLessonSettings({
  lesson,
}: {
  readonly lesson: GuidedLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <Para>
        <FormattedMessage
          id="lessonType.guided.description"
          description="Description text."
          defaultMessage="Generate typing lessons with random words using the phonetic rules of your language. The key set is expanded dynamically based on your performance. This mode is for the beginners."
        />
      </Para>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <AlphabetSizeProp />
        <TargetSpeedProp />
        <TextManglingProp />
        <LessonLengthProp />
      </FieldSet>
    </>
  );
}
