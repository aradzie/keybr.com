import { messages } from "@keybr/lesson-ui";
import { SpeedUnit, uiProps } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Explainer, Field, FieldList, FieldSet, RadioBox } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function MiscSettings(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <>
      <FieldSet
        legend={formatMessage({
          id: "settings.interfaceOptionsLegend",
          description: "Fieldset legend.",
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
            id="settings.typingSpeedUnitCaption"
            description="Radio button group caption."
            defaultMessage="Measure typing speed in:"
          />
        </Field>
        <Field>
          <RadioBox
            checked={settings.get(uiProps.speedUnit) === SpeedUnit.WPM}
            name="speed-unit"
            label={formatMessage(messages.wpmName)}
            title={formatMessage(messages.wpmDescription)}
            onSelect={() =>
              updateSettings(settings.set(uiProps.speedUnit, SpeedUnit.WPM))
            }
          />
        </Field>
        <Field>
          <RadioBox
            checked={settings.get(uiProps.speedUnit) === SpeedUnit.CPM}
            name="speed-unit"
            label={formatMessage(messages.cpmName)}
            title={formatMessage(messages.cpmDescription)}
            onSelect={() =>
              updateSettings(settings.set(uiProps.speedUnit, SpeedUnit.CPM))
            }
          />
        </Field>
        <Field>
          <RadioBox
            checked={settings.get(uiProps.speedUnit) === SpeedUnit.CPS}
            name="speed-unit"
            label={formatMessage(messages.cpsName)}
            title={formatMessage(messages.cpsDescription)}
            onSelect={() =>
              updateSettings(settings.set(uiProps.speedUnit, SpeedUnit.CPS))
            }
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.typingSpeedUnitDescription"
          description="Radio button group description."
          defaultMessage="For the purpose of typing measurement, each word is standardized to be five characters or keystrokes in English, including spaces and punctuation."
        />
      </Explainer>
    </>
  );
}
