import { Icon } from "@keybr/widget";
import { mdiBrightness4, mdiBrightness5 } from "@mdi/js";
import { type TextSizeOption, type ThemeOption } from "./types.ts";

export class OptionList<T extends { id: string }> {
  constructor(public readonly all: readonly T[]) {}

  findOption(id: string): T {
    let option = this.all.find((item) => item.id === id);
    if (option == null) {
      option = this.all[0];
    }
    return option;
  }

  findNext(option: T): T {
    let index = this.all.findIndex((item) => item === option) + 1;
    if (index === this.all.length) {
      index = 0;
    }
    return this.all[index];
  }
}

export const THEMES = new OptionList<ThemeOption>([
  {
    id: "light",
    icon: <Icon shape={mdiBrightness5} />,
    title: "Light Colors",
  },
  {
    id: "dark",
    icon: <Icon shape={mdiBrightness4} />,
    title: "Dark Colors",
  },
]);

export const TEXT_SIZES = new OptionList<TextSizeOption>([
  {
    id: "normal",
    title: "Normal Text Size",
  },
  {
    id: "large",
    title: "Large Text Size",
  },
  {
    id: "huge",
    title: "Huge Text Size",
  },
]);
