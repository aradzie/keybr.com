import { Language } from "@keybr/layout";
import { textDisplaySettings } from "@keybr/textinput";
import { Tab, TabList } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { limit_30_seconds } from "../../session/index.ts";
import { TextGeneratorSettings } from "./TextGeneratorSettings.tsx";
import { type CompositeSettings, type SettingsEditorProps } from "./types.ts";
import { TypingSettings } from "./TypingSettings.tsx";

export const defaultSettings: CompositeSettings = {
  limit: limit_30_seconds,
  textSource: { type: "common-words", language: Language.EN },
  textInput: { stopOnError: false, forgiveErrors: false },
  textDisplay: { ...textDisplaySettings },
};

export function SettingsEditor(props: SettingsEditorProps): ReactNode {
  const [tabIndex, setTabIndex] = useState(0);
  return (
    <TabList
      selectedIndex={tabIndex}
      onSelect={(tabIndex) => {
        setTabIndex(tabIndex);
      }}
    >
      <Tab label="Text">
        <TextGeneratorSettings {...props} />
      </Tab>

      <Tab label="Typing">
        <TypingSettings {...props} />
      </Tab>
    </TabList>
  );
}
