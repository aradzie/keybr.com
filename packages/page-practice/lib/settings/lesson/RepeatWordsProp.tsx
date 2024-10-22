import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { Description, Explainer, Field, FieldList, Range } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function RepeatWordsProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <Range
            min={0}
            max={30}
            step={1}
            value={settings.get(lessonProps.repeatWords)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.repeatWords, value));
            }}
          />
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
