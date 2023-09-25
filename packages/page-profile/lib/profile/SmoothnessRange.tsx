import { Field, Range, styleSizeWide } from "@keybr/widget";
import { type ReactNode } from "react";
import { defineMessage, useIntl } from "react-intl";

export function SmoothnessRange({
  value,
  disabled,
  onChangeValue,
}: {
  readonly value: number;
  readonly disabled: boolean;
  readonly onChangeValue: (value: number) => void;
}): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <>
      <Field>
        <label>
          {formatMessage(
            defineMessage({
              id: "profile.smoothnessLabel",
              description: "Input field label.",
              defaultMessage: "Smoothness:",
            }),
          )}
        </label>
      </Field>
      <Field>
        <Range
          className={styleSizeWide}
          disabled={disabled}
          min={0}
          max={100}
          step={10}
          value={Math.round(value * 100)}
          onChange={(value) => {
            onChangeValue(value / 100);
          }}
          title={formatMessage(
            defineMessage({
              id: "profile.smoothnessTitle",
              description: "Input field title.",
              defaultMessage: "Eliminate noise to see the long-term trend.",
            }),
          )}
        />
      </Field>
    </>
  );
}
