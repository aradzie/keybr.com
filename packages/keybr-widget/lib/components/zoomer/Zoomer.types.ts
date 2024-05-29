import { type ReactElement } from "react";

export type ZoomerProps = {
  readonly children: ReactElement<ZoomableProps>;
  readonly id?: string | null;
};

export type ZoomableProps = {
  readonly moving?: boolean;
};

export type ZoomablePosition = {
  readonly x: number;
  readonly y: number;
  readonly zoom: number;
};
