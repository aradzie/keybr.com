import { useIntlNumbers } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Explainer,
  Field,
  FieldList,
  Range,
  styleWidthWide,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function TextManglingProp(): ReactNode {
  const { formatPercents } = useIntlNumbers();
  const { settings, updateSettings } = useSettings();
  const { formatMessage } = useIntl();
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
            className={styleWidthWide}
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
            className={styleWidthWide}
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
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.programming.label",
              defaultMessage: "Add programming characters",
            })}
            checked={settings.get(lessonProps.programming)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.programming, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.programming.description"
          defaultMessage="Add programming characters to the lesson text. Use this option to practice typing the programming characters. Programming characters will be added only if you have all letters above the target speed."
        />
      </Explainer>
    </>
  );
}
