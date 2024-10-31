export type TextGenerator<MarkT = unknown> = {
  nextWord(): string;
  mark(): MarkT;
  reset(state: MarkT): void;
};

export type Mark = unknown;
