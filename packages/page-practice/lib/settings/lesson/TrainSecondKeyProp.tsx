import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Description,
  Explainer,
  Field,
  FieldList,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function TrainSecondKeyProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label={formatMessage({
              id: "settings.trainSecondKey.label",
              defaultMessage: "Train second key",
            })}
            checked={settings.get(lessonProps.guided.trainSecondKey)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.guided.trainSecondKey, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.trainSecondKey.description"
            defaultMessage="Occasionally mix in words for a second key alongside the one you are focused on: the next letter to unlock, or, once every letter is unlocked, your second-weakest key."
          />
        </Description>
      </Explainer>
    </>
  );
}
