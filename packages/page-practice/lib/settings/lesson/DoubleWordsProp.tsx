import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { CheckBox, Explainer, Field, FieldList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function DoubleWordsProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.doubleWords.label",
              defaultMessage: "Double each word",
            })}
            checked={settings.get(lessonProps.doubleWords)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.doubleWords, value));
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        Repeat each word two times. Type a word for the first time to develop
        your muscle memory. Typing the same word for the second time should be
        easier.
      </Explainer>
    </>
  );
}
