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
    id: "coffee-light",
    name: "Coffee (Light)",
  },
  {
    id: "coffee-dark",
    name: "Coffee (Dark)",
  },
  {
    id: "custom",
    name: "Custom",
  },
]);

export const FONTS = new ThemeList([
  {
    id: "opensans",
    name: "Open Sans",
  },
  {
    id: "roboto",
    name: "Roboto",
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
]);
