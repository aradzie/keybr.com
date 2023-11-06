import { type GuidedLesson } from "@keybr/lesson";
import { Explainer, FieldSet } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AlphabetSizeProp } from "./AlphabetSizeProp.tsx";
import { DoubleWordsProp } from "./DoubleWordsProp.tsx";
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
      <Explainer>
        <FormattedMessage
          id="lessonType.guided.description"
          description="Message text."
          defaultMessage="Generate typing lessons with random words using the phonetic rules of your language. The key set is expanded dynamically based on your performance. This mode is for the beginners."
        />
      </Explainer>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptions.legend",
          description: "Header text.",
          defaultMessage: "Lesson Options",
        })}
      >
        <TargetSpeedProp />
        <DoubleWordsProp />
        <AlphabetSizeProp />
        <TextManglingProp />
        <LessonLengthProp />
      </FieldSet>
    </>
  );
}
