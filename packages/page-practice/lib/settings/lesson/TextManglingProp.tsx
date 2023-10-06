import { useIntlNumbers } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Field,
  FieldList,
  Para,
  Range,
  styleSizeWide,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function TextManglingProp(): ReactNode {
  const { formatPercents } = useIntlNumbers();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.capitalLettersLabel"
            description="Input field label."
            defaultMessage="Add capital letters:"
          />
        </Field>
        <Field>
          <Range
            className={styleSizeWide}
            min={0}
            max={100}
            step={1}
            value={Math.round(settings.get(lessonProps.capitals) * 100)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.capitals, value / 100));
            }}
          />
        </Field>
        <Field>
          <Value value={formatPercents(settings.get(lessonProps.capitals))} />
        </Field>
      </FieldList>
      {false && (
        <Para>
          Adjust the amount of capital letters added to the lesson text.
        </Para>
      )}
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.punctuationLabel"
            description="Input field label."
            defaultMessage="Add punctuation characters:"
          />
        </Field>
        <Field>
          <Range
            className={styleSizeWide}
            min={0}
            max={100}
            step={1}
            value={Math.round(settings.get(lessonProps.punctuators) * 100)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.punctuators, value / 100),
              );
            }}
          />
        </Field>
        <Field>
          <Value
            value={formatPercents(settings.get(lessonProps.punctuators))}
          />
        </Field>
      </FieldList>
      {false && (
        <Para>
          Adjust the amount of punctuation characters added to the lesson text.
        </Para>
      )}
    </>
  );
}
