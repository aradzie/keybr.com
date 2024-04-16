import { Icon } from "@keybr/widget";
import { mdiBrightness4, mdiBrightness5 } from "@mdi/js";
import { type ColorOption, type FontOption } from "./types.ts";

export class OptionList<T extends { id: string }> {
  constructor(readonly all: readonly T[]) {}

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

export const COLORS = new OptionList<ColorOption>([
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

export const FONTS = new OptionList<FontOption>([
  {
    id: "opensans",
    title: "Open Sans",
  },
  {
    id: "spectral",
    title: "Spectral",
  },
]);
