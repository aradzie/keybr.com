import { type NumbersLesson } from "@keybr/lesson";
import { Explainer, FieldSet } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { BenfordProp } from "./BenfordProp.tsx";

export function NumbersLessonSettings({
  lesson,
}: {
  readonly lesson: NumbersLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <Explainer>Practice numbers only. No letters are used.</Explainer>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <BenfordProp />
      </FieldSet>
    </>
  );
}
