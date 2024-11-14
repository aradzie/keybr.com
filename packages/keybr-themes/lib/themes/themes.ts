export type Theme = {
  readonly id: string;
  readonly name: string;
};

export class ThemeList implements Iterable<Theme> {
  readonly #themes: readonly Theme[];

  constructor(themes: readonly Theme[]) {
    this.#themes = [...themes];
  }

  [Symbol.iterator](): IterableIterator<Theme> {
    return this.#themes[Symbol.iterator]();
  }

  get default(): Theme {
    return this.#themes[0];
  }

  find(id: string): Theme {
    return this.#themes.find((item) => item.id === id) ?? this.#themes[0];
  }
}

export const COLORS = new ThemeList([
  {
    id: "system",
    name: "System",
  },
  {
    id: "light",
    name: "Light",
  },
  {
    id: "dark",
    name: "Dark",
  },
  {
    id: "gray",
    name: "Gray",
  },
  {
    id: "yellow",
    name: "Yellow",
  },
  {
    id: "garden",
    name: "Garden",
  },
  {
    id: "coffee",
    name: "Coffee",
  },
  {
    id: "chocolate",
    name: "Chocolate",
  },
  {
    id: "honey",
    name: "Honey",
  },
  {
    id: "custom",
    name: "Custom...",
  },
]);

export const FONTS = new ThemeList([
  {
    id: "open-sans",
    name: "Open Sans",
  },
  {
    id: "roboto",
    name: "Roboto",
  },
  {
    id: "rubik",
    name: "Rubik",
  },
  {
    id: "shantell-sans",
    name: "Shantell Sans",
  },
  {
    id: "spectral",
    name: "Spectral",
  },
  {
    id: "nunito",
    name: "Nunito",
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
  },
  {
    id: "cormorant",
    name: "Cormorant",
  },
  {
    id: "sans-serif",
    name: "sans-serif",
  },
  {
    id: "serif",
    name: "serif",
  },
  {
    id: "monospace",
    name: "monospace",
  },
  {
    id: "cursive",
    name: "cursive",
  },
]);
