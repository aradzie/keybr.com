import { type Layout } from "@keybr/keyboard";
import { type AnyUser } from "@keybr/pages-shared";

export type Entry = {
  readonly user: AnyUser;
  readonly layout: Layout;
  readonly speed: number;
  readonly score: number;
};

export type EntriesProps = {
  readonly entries: readonly Entry[];
};
