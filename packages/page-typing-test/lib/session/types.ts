import { type LineData } from "@keybr/textinput";
import {
  type TextDisplaySettings,
  type TextInputSettings,
} from "@keybr/textinput-settings";

export type TimeLimit = {
  readonly type: "time";
  readonly time: number;
};

export type LengthLimit = {
  readonly type: "length";
  readonly length: number;
};

export type Limit = TimeLimit | LengthLimit;

export type Progress = {
  /** Time passed in millis. */
  readonly time: number;
  /** Chars inputted. */
  readonly length: number;
  /** Progress made, [0, 1]. */
  readonly progress: number;
};

export type SessionSettings = {
  readonly limit: Limit;
  readonly textInput: TextInputSettings;
  readonly textDisplay: TextDisplaySettings;
  readonly numLines: number;
  readonly numCols: number;
};

export type SessionLineData = LineData & {
  readonly index: number;
  readonly mark: unknown;
  readonly text: string;
  readonly progress: Progress | null;
};
