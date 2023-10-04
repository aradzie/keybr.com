import {
  type TextDisplaySettings,
  type TextInputSettings,
} from "@keybr/textinput";
import { type TextSource } from "../../generator/index.ts";
import { type Limit } from "../../session/index.ts";

export type CompositeSettings = {
  readonly limit: Limit;
  readonly textSource: TextSource;
  readonly textInput: TextInputSettings;
  readonly textDisplay: TextDisplaySettings;
};

export type SettingsEditorProps = {
  readonly settings: CompositeSettings;
  readonly patchSettings: (settings: CompositeSettings) => void;
};
