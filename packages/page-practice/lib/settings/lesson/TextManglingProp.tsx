import { useIntlNumbers } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Explainer,
  Field,
  FieldList,
  Range,
  styleWidth16,
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
            id="settings.capitalLetters.label"
            defaultMessage="Add capital letters:"
          />
        </Field>
        <Field>
          <Range
            className={styleWidth16}
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
      <Explainer>
        <FormattedMessage
          id="settings.capitalLetters.description"
          defaultMessage="Adjust the amount of capital letters added to the lesson text. Use this option to practice typing the capital letters. We recommend to increase this value only if you have all letters above the target speed."
        />
      </Explainer>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.punctuation.label"
            defaultMessage="Add punctuation characters:"
          />
        </Field>
        <Field>
          <Range
            className={styleWidth16}
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
      <Explainer>
        <FormattedMessage
          id="settings.punctuation.description"
          defaultMessage="Adjust the amount of basic punctuation characters added to the lesson text. Use this option to practice typing the punctuation characters. We recommend to increase this value only if you have all letters above the target speed."
        />
      </Explainer>
    </>
  );
}
