import { lessonProps } from "@keybr/lesson";
import { useFormatter } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import { Field, FieldList, Range, styleSizeWide, Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function TargetSpeedProp(): ReactNode {
  const { formatMessage } = useIntl();
  const fmt = useFormatter();
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
          title={formatMessage({
            id: "settings.targetSpeedTitle",
            description: "Input field title.",
            defaultMessage:
              "Set custom target typing speed that you want to achieve.",
          })}
          onChange={(value) => {
            updateSettings(settings.set(lessonProps.targetSpeed, value));
          }}
        />
      </Field>
      <Field>
        <Value
          value={fmt(settings.get(lessonProps.targetSpeed), { unit: true })}
        />
      </Field>
    </FieldList>
  );
}
