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
  Value,
} from "@keybr/widget";
import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function TargetSpeedProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="t_Target_typing_speed:"
            defaultMessage="Target typing speed:"
          />
        </Field>
        <TargetSpeedFields
          value={settings.get(lessonProps.targetSpeed)}
          onChange={(value) => {
            updateSettings(settings.set(lessonProps.targetSpeed, value));
          }}
        />
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

export function TargetSpeedFields({
  value,
  onChange,
}: {
  readonly value: number;
  readonly onChange: (value: number) => void;
}): ReactNode {
  const { formatSpeed } = useFormatter();
  const { min, max } = lessonProps.targetSpeed;
  return (
    <>
      <Field>
        <Range
          size={16}
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={onChange}
        />
      </Field>
      <Field>
        <Dir swap="icon">
          <IconButton
            icon={<Icon shape={mdiSkipPrevious} />}
            disabled={value === min}
            onClick={() => {
              onChange(Math.ceil(value / 5) * 5 - 5);
            }}
          />
          <IconButton
            icon={<Icon shape={mdiSkipNext} />}
            disabled={value === max}
            onClick={() => {
              onChange(Math.floor(value / 5) * 5 + 5);
            }}
          />
        </Dir>
      </Field>
      <Field>
        <Value value={formatSpeed(value)} />
      </Field>
    </>
  );
}
