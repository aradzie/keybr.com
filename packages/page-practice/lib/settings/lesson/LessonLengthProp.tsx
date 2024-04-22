import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Explainer,
  Field,
  FieldList,
  Range,
  styleWidth16,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function LessonLengthProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.lessonLength.label"
            defaultMessage="Add words to lessons:"
          />
        </Field>
        <Field>
          <Range
            className={styleWidth16}
            min={1}
            max={100}
            step={1}
            value={Math.round(settings.get(lessonProps.length) * 100)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.length, value / 100));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.lessonLength.description"
          defaultMessage="Adjust the number of words in the lesson text. Making lessons longer can improve your learning."
        />
      </Explainer>
    </>
  );
}
