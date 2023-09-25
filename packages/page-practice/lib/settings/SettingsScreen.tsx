import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { type Settings, SettingsContext, useSettings } from "@keybr/settings";
import { Button, Field, FieldList, Icon, Tab, TabList } from "@keybr/widget";
import { mdiCheckCircle } from "@mdi/js";
import { type ReactNode, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { LayoutSettings } from "./LayoutSettings.tsx";
import { LessonSettings } from "./LessonSettings.tsx";
import { MiscSettings } from "./MiscSettings.tsx";
import * as styles from "./SettingsScreen.module.less";
import { TypingSettings } from "./TypingSettings.tsx";

export function SettingsScreen({
  onSubmit,
}: {
  readonly onSubmit: (newSettings: Settings) => void;
}): ReactNode {
  const { settings } = useSettings();
  const [newSettings, setNewSettings] = useState(settings);
  const keyboard = useMemo(
    () => loadKeyboard(newSettings.layout, { full: true }),
    [newSettings.layout],
  );

  return (
    <SettingsContext.Provider
      value={{
        settings: newSettings,
        updateSettings: (newSettings) => {
          setNewSettings(newSettings);
        },
      }}
    >
      <KeyboardContext.Provider value={keyboard}>
        <Content
          onSubmit={() => {
            onSubmit(newSettings);
          }}
        />
      </KeyboardContext.Provider>
    </SettingsContext.Provider>
  );
}

function Content({ onSubmit }: { readonly onSubmit: () => void }): ReactNode {
  const { formatMessage } = useIntl();
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className={styles.settings}>
      <TabList
        selectedIndex={tabIndex}
        onSelect={(tabIndex) => {
          setTabIndex(tabIndex);
        }}
      >
        <Tab
          label={formatMessage({
            id: "settings.lessonsTabLabel",
            description: "Tab label.",
            defaultMessage: "Lessons",
          })}
        >
          <LessonSettings />
        </Tab>

        <Tab
          label={formatMessage({
            id: "settings.typingTabLabel",
            description: "Tab label.",
            defaultMessage: "Typing",
          })}
        >
          <TypingSettings />
        </Tab>

        <Tab
          label={formatMessage({
            id: "settings.keyboardLayoutTabLabel",
            description: "Tab label.",
            defaultMessage: "Keyboard Layout",
          })}
        >
          <LayoutSettings />
        </Tab>

        <Tab
          label={formatMessage({
            id: "settings.miscellaneousTabLabel",
            description: "Tab label.",
            defaultMessage: "Miscellaneous",
          })}
        >
          <MiscSettings />
        </Tab>
      </TabList>

      <FieldList>
        <Field.Filler />
        <Field>
          <Button
            icon={<Icon shape={mdiCheckCircle} />}
            label={formatMessage({
              id: "settings.doneButtonLabel",
              description: "Button label.",
              defaultMessage: "Done",
            })}
            title={formatMessage({
              id: "settings.doneButtonTitle",
              description: "Button title.",
              defaultMessage: "Save changes and start practicing.",
            })}
            onClick={() => {
              onSubmit();
            }}
          />
        </Field>
      </FieldList>
    </div>
  );
}
