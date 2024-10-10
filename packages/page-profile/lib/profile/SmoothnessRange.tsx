import { Field, FieldList, Range } from "@keybr/widget";
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
    <FieldList>
      <Field.Filler />
      <Field>
        <label>
          {formatMessage(
            defineMessage({
              id: "profile.smoothness.label",
              defaultMessage: "Smoothness:",
            }),
          )}
        </label>
      </Field>
      <Field>
        <Range
          size={16}
          disabled={disabled}
          min={0}
          max={100}
          step={10}
          value={Math.round(value * 100)}
          title={formatMessage(
            defineMessage({
              id: "profile.smoothness.description",
              defaultMessage: "Eliminate noise to see the long-term trend.",
            }),
          )}
          onChange={(value) => {
            onChangeValue(value / 100);
          }}
        />
      </Field>
      <Field.Filler />
    </FieldList>
  );
}
