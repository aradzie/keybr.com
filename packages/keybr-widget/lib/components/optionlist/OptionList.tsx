import { type ReactNode, useState } from "react";
import { useHotkeysHandler } from "../../hooks/use-hotkeys.ts";
import { type OptionListProps } from "./OptionList.types.ts";
import { OptionListButton } from "./OptionListButton.tsx";
import { OptionListMenu } from "./OptionListMenu.tsx";

export function OptionList({
  className,
  disabled,
  options,
  tabIndex,
  title,
  value,
  onBlur,
  onFocus,
  onSelect,
  ...props
}: OptionListProps): ReactNode {
  const [focused, setFocused] = useState(false);
  const {
    open,
    setOpen,
    option,
    selectedOption,
    handleOpen,
    handleNavigate,
    handleSelect,
  } = useOptionList({
    disabled,
    options,
    value,
    onSelect,
  });
  return (
    <OptionListButton
      {...props}
      className={className}
      focused={focused}
      open={open}
      option={option}
      tabIndex={tabIndex}
      title={title}
      onBlur={(event) => {
        if (!disabled) {
          setFocused(false);
          setOpen(false);
          if (onBlur != null) {
            onBlur(event);
          }
        }
      }}
      onFocus={(event) => {
        if (!disabled) {
          setFocused(true);
          if (onFocus != null) {
            onFocus(event);
          }
        }
      }}
      onKeyDown={useHotkeysHandler(
        ["Space", handleOpen],
        ["Enter", handleSelect],
        ["Home", () => handleNavigate("first")],
        ["ArrowUp", () => handleNavigate("prev")],
        ["ArrowDown", () => handleNavigate("next")],
        ["End", () => handleNavigate("last")],
      )}
      onClick={(event) => {
        event.preventDefault();
        handleOpen();
      }}
    >
      {open && (
        <OptionListMenu
          options={options}
          selectedOption={selectedOption}
          onSelect={(option) => {
            setOpen(false);
            if (onSelect != null) {
              onSelect(option.value);
            }
          }}
        />
      )}
    </OptionListButton>
  );
}

function useOptionList({
  options,
  disabled,
  value,
  onSelect,
}: OptionListProps) {
  const option = options.find((option) => option.value === value) ?? {
    value: "",
    name: "-",
  };

  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(option);

  const handleOpen = (): void => {
    if (disabled) {
      return;
    }
    if (!open) {
      setOpen(true);
      setSelectedOption(option);
    } else {
      setOpen(false);
    }
  };

  const handleNavigate = (dir: "first" | "prev" | "next" | "last"): void => {
    if (disabled) {
      return;
    }
    if (!open) {
      setOpen(true);
      setSelectedOption(option);
    } else {
      const { length } = options;
      let index = options.indexOf(selectedOption);
      if (index === -1) {
        index = 0;
      }
      switch (dir) {
        case "first":
          index = 0;
          break;
        case "prev":
          index -= 1;
          if (index < 0) {
            index = length - 1;
          }
          break;
        case "next":
          index += 1;
          if (index >= length) {
            index = 0;
          }
          break;
        case "last":
          index = length - 1;
          break;
      }
      setSelectedOption(options[index]);
    }
  };

  const handleSelect = (): void => {
    if (disabled) {
      return;
    }
    if (open) {
      setOpen(false);
      if (onSelect != null) {
        onSelect(selectedOption.value);
      }
    }
  };

  return {
    open,
    setOpen,
    option,
    selectedOption,
    handleOpen,
    handleNavigate,
    handleSelect,
  };
}
