import { lessonProps } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
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

export function TargetSpeedProp(): ReactNode {
  const { formatSpeed } = useFormatter();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.targetSpeed.label"
            defaultMessage="Target typing speed:"
          />
        </Field>
        <Field>
          <Range
            className={styleWidth16}
            min={lessonProps.targetSpeed.min}
            max={lessonProps.targetSpeed.max}
            step={1}
            value={settings.get(lessonProps.targetSpeed)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.targetSpeed, value));
            }}
          />
        </Field>
        <Field>
          <Value
            value={formatSpeed(settings.get(lessonProps.targetSpeed), {
              unit: true,
            })}
          />
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.targetSpeed.description"
          defaultMessage="The target speed is used to measure the confidence level and the color of a letter. The closer to the target speed, the greener. In the guided mode a letter is only unlocked when you pass a target speed threshold. When you unlock all letters, you can increase the target speed to go back to the learning mode and unlock the letters again, this time with a higher speed threshold. We recommend to increase the target speed in modest steps only when you have all letters above the target speed."
        />
      </Explainer>
    </>
  );
}
