import { type NumbersLesson } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Field,
  FieldList,
  FieldSet,
  Link,
  Para,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function NumbersLessonSettings({
  lesson,
}: {
  readonly lesson: NumbersLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();

  return (
    <>
      <Para>Practice numbers only. No letters are used.</Para>

      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptionsLegend",
          description: "Fieldset legend.",
          defaultMessage: "Lesson Options",
        })}
      >
        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.benfordsLawLabel",
                description: "Checkbox label.",
                defaultMessage: "Benford's law",
              })}
              title={formatMessage({
                id: "settings.benfordsLawTitle",
                description: "Checkbox title.",
                defaultMessage: "Generate numbers following the Benford's law.",
              })}
              checked={true}
              onChange={(value) => {}}
            />
          </Field>
        </FieldList>

        <Para>
          <FormattedMessage
            id="settings.benfordsLawDescription"
            description="Freeform text."
            defaultMessage="<a>Benford's law</a> is an observation that in many real-life numerical data sets, the leading digit is likely to be small."
            values={{
              a: (chunks: ReactNode): ReactNode => (
                <Link
                  href="https://en.wikipedia.org/wiki/Benford's_law"
                  target="_blank"
                  external={true}
                >
                  {chunks}
                </Link>
              ),
            }}
          />
        </Para>
      </FieldSet>
    </>
  );
}
