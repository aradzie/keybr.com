import {
  type Line,
  type TextDisplaySettings,
  type TextInputSettings,
} from "@keybr/textinput";

export enum DurationType {
  Time = 1,
  Length = 2,
}

export type Duration = {
  readonly type: DurationType;
  readonly value: number;
};

export type Progress = {
  /** Time passed in millis. */
  readonly time: number;
  /** Chars inputted. */
  readonly length: number;
  /** Progress made, [0, 1]. */
  readonly progress: number;
};

export type SessionSettings = {
  readonly duration: Duration;
  readonly textInput: TextInputSettings;
  readonly textDisplay: TextDisplaySettings;
  readonly numLines: number;
  readonly numCols: number;
};

export type SessionLineData = Line & {
  readonly index: number;
  readonly mark: unknown;
  readonly text: string;
  readonly progress: Progress | null;
};
