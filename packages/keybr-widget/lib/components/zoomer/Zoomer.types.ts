import type { ReactElement } from "react";

export type ZoomerProps = {
  readonly children: ReactElement<ZoomableProps>;
};

export type ZoomableProps = {
  readonly moving?: boolean;
};
