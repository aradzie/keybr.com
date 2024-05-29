import { clsx } from "clsx";
import { type ReactNode, useEffect, useRef } from "react";
import * as iconStyles from "../icon/Icon.module.less";
import { type OptionListOption } from "./OptionList.types.ts";
import * as styles from "./OptionListMenu.module.less";
import { ensureVisible } from "./scroll.ts";

export function OptionListMenu({
  options,
  selectedOption,
  onSelect,
}: {
  readonly options: readonly OptionListOption[];
  readonly selectedOption: OptionListOption;
  readonly onSelect: (value: OptionListOption) => void;
}): ReactNode {
  const list = useRef(null);
  const item = useRef(null);
  useEffect(() => {
    ensureVisible(list.current, item.current);
  });
  return (
    <ul ref={list} role="menu" className={styles.root}>
      {options.map((option, index) => (
        <li
          key={index}
          ref={option === selectedOption ? item : null}
          role="menuitem"
          className={clsx(
            styles.item,
            iconStyles.altIcon,
            option === selectedOption && styles.item_selected,
          )}
          onClick={(event) => {
            event.preventDefault();
            onSelect(option);
          }}
        >
          {option.name}
        </li>
      ))}
    </ul>
  );
}
