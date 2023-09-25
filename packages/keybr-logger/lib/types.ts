import { type Level } from "./level.ts";

export type Message = {
  readonly level: Level;
  readonly time: Date;
  readonly err: Error | null;
  readonly format: string;
  readonly args: readonly unknown[];
};

export type Transport = {
  readonly append: (message: Message) => void;
};
