import { useIntlNumbers } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Description,
  Explainer,
  Field,
  FieldList,
  Range,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function RepeatWordsProp(): ReactNode {
  const { formatPercents } = useIntlNumbers();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.repeatWords.label"
            defaultMessage="Repeat each word:"
          />
        </Field>
        <Field>
          <Range
            min={lessonProps.repeatWords.min}
            max={lessonProps.repeatWords.max}
            step={1}
            value={settings.get(lessonProps.repeatWords)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.repeatWords, value));
            }}
          />
        </Field>
        <Field>
          <Value value={settings.get(lessonProps.repeatWords)} />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.repeatWords.description"
            defaultMessage="Repeat each word a number of times. Type a word for the first time to develop your muscle memory. Typing the same word consecutively should be easier."
          />
        </Description>
      </Explainer>
    </>
  );
}
