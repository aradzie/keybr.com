import { type BoundPageLink } from "@keybr/pages-shared";

export type PageMeta = {
  readonly pageLink: BoundPageLink;
  readonly title: string;
  readonly description: string;
  readonly entrypoint: string;
};
