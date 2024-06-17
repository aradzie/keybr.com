import { Dir } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import {
  Description,
  Explainer,
  Field,
  FieldList,
  Icon,
  IconButton,
  Range,
  styleWidth16,
  Value,
} from "@keybr/widget";
import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function TargetSpeedProp(): ReactNode {
  const { formatSpeed } = useFormatter();
  const { settings, updateSettings } = useSettings();
  const targetSpeed = settings.get(lessonProps.targetSpeed);
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
            value={targetSpeed}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.targetSpeed, value));
            }}
          />
        </Field>
        <Field>
          <Dir swap="icon">
            <IconButton
              icon={<Icon shape={mdiSkipPrevious} />}
              disabled={targetSpeed === lessonProps.targetSpeed.min}
              onClick={() => {
                updateSettings(
                  settings.set(
                    lessonProps.targetSpeed,
                    Math.ceil(targetSpeed / 5) * 5 - 5,
                  ),
                );
              }}
            />
            <IconButton
              icon={<Icon shape={mdiSkipNext} />}
              disabled={targetSpeed === lessonProps.targetSpeed.max}
              onClick={() => {
                updateSettings(
                  settings.set(
                    lessonProps.targetSpeed,
                    Math.floor(targetSpeed / 5) * 5 + 5,
                  ),
                );
              }}
            />
          </Dir>
        </Field>
        <Field>
          <Value value={formatSpeed(targetSpeed, { unit: true })} />
        </Field>
      </FieldList>
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.targetSpeed.description"
            defaultMessage="The target speed is used to measure the confidence level and the color of a letter. The closer to the target speed, the greener. In the guided mode a letter is only unlocked when you pass a target speed threshold. When you unlock all letters, you can increase the target speed to go back to the learning mode and unlock the letters again, this time with a higher speed threshold. We recommend to increase the target speed in modest steps only when you have all letters above the target speed."
          />
        </Description>
      </Explainer>
    </>
  );
}
