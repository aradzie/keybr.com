import { lessonProps } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import { Field, FieldList, Range, styleSizeWide, Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function TargetSpeedProp(): ReactNode {
  const { formatMessage } = useIntl();
  const { formatSpeed } = useFormatter();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field>
        {formatMessage({
          id: "settings.targetSpeedLabel",
          description: "Input field label.",
          defaultMessage: "Target typing speed:",
        })}
      </Field>
      <Field>
        <Range
          className={styleSizeWide}
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
  );
}
