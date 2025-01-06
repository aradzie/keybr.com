import { type ReactNode } from "react";
import { Flyout } from "../flyout/index.ts";
import { type OptionListProps } from "./OptionList.types.ts";
import { OptionListButton } from "./OptionListButton.tsx";
import { OptionListMenu } from "./OptionListMenu.tsx";

export function OptionList({
  disabled,
  options,
  size,
  tabIndex,
  title,
  value,
  onSelect,
  ...props
}: OptionListProps): ReactNode {
  const option = options.find((option) => option.value === value) ?? {
    value: "",
    name: "-",
  };
  return (
    <Flyout disabled={disabled}>
      <Flyout.Trigger>
        <OptionListButton
          {...props}
          disabled={disabled}
          focused={false}
          label={option.name}
          size={size}
          tabIndex={tabIndex}
          title={title}
        />
      </Flyout.Trigger>
      <Flyout.Content width="anchor" position="block-end">
        <OptionListMenu
          options={options}
          selectedOption={option}
          onSelect={(option) => {
            if (onSelect != null) {
              onSelect(option.value);
            }
          }}
        />
      </Flyout.Content>
    </Flyout>
  );
}
