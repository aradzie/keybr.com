import { SpeedUnit, uiProps } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import {
  Description,
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function MiscSettings(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.interfaceOptions.legend",
          defaultMessage: "Interface Options",
        })}
      >
        <SpeedUnitProp />
      </FieldSet>
    </>
  );
}

function SpeedUnitProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.typingSpeedUnit.caption"
            defaultMessage="Measure typing speed in:"
          />
        </Field>
        <Field>
          <OptionList
            options={SpeedUnit.ALL.map((item) => ({
              value: item.id,
              name: formatMessage(item.name),
            }))}
            value={settings.get(uiProps.speedUnit).id}
            onSelect={(id) => {
              updateSettings(
                settings.set(uiProps.speedUnit, SpeedUnit.ALL.get(id)),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.typingSpeedUnit.description"
            defaultMessage="For the purpose of typing measurement, each word is standardized to be five characters or keystrokes in English, including spaces and punctuation."
          />
        </Description>
      </Explainer>
    </>
  );
}
