import { type GuidedLesson, lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Field,
  FieldList,
  FieldSet,
  Para,
  Range,
  styleSizeWide,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
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
        {formatMessage({
          id: "lessonType.guided.description",
          description: "Description text.",
          defaultMessage:
            "Generate typing lessons with random words using the phonetic rules of your language. The key set is expanded dynamically based on your performance. This mode is for the beginners.",
        })}
      </Para>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <AlphabetSize />
        <TargetSpeedProp />
        <TextManglingProp />
        <LessonLengthProp />
      </FieldSet>
    </>
  );
}

function AlphabetSize(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field>
        {formatMessage({
          id: "settings.alphabetSizeLabel",
          description: "Input field label.",
          defaultMessage: "Unlock more letters:",
        })}
      </Field>
      <Field>
        <Range
          className={styleSizeWide}
          min={1}
          max={100}
          step={1}
          value={Math.round(
            settings.get(lessonProps.guided.alphabetSize) * 100,
          )}
          onChange={(value) => {
            updateSettings(
              settings.set(lessonProps.guided.alphabetSize, value / 100),
            );
          }}
        />
      </Field>
    </FieldList>
  );
}
