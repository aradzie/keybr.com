import { KeyboardContext, keyboardProps, loadKeyboard } from "@keybr/keyboard";
import { Screen } from "@keybr/pages-shared";
import { type Settings, SettingsContext, useSettings } from "@keybr/settings";
import { TypingSettings } from "@keybr/textinput-ui";
import { Button, Field, FieldList, Header, Icon } from "@keybr/widget";
import { mdiCheckCircle } from "@mdi/js";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { KeyboardSettings } from "./KeyboardSettings.tsx";
import { LessonSettings } from "./LessonSettings.tsx";
import { MiscSettings } from "./MiscSettings.tsx";
import * as styles from "./SettingsScreen.module.less";

export function SettingsScreen({
  onSubmit,
}: {
  readonly onSubmit: (newSettings: Settings) => void;
}): ReactNode {
  const { settings } = useSettings();
  const [newSettings, setNewSettings] = useState(settings);
  const keyboard = useMemo(() => {
    const layout = newSettings.get(keyboardProps.layout);
    const full = newSettings.get(keyboardProps.full);
    return loadKeyboard(layout, { full });
  }, [newSettings]);
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
  return (
    <Screen>
      <Header level={1}>
        <FormattedMessage
          id="settings.lessonsTabLabel"
          description="Header text."
          defaultMessage="Lessons"
        />
      </Header>
      <LessonSettings />

      <div className={styles.spacer} />

      <Header level={1}>
        <FormattedMessage
          id="settings.typingTabLabel"
          description="Header text."
          defaultMessage="Typing"
        />
      </Header>
      <TypingSettings />

      <div className={styles.spacer} />

      <Header level={1}>
        <FormattedMessage
          id="settings.keyboardTabLabel"
          description="Header text."
          defaultMessage="Keyboard"
        />
      </Header>
      <KeyboardSettings />

      <div className={styles.spacer} />

      <Header level={1}>
        <FormattedMessage
          id="settings.miscellaneousTabLabel"
          description="Header text."
          defaultMessage="Miscellaneous"
        />
      </Header>
      <MiscSettings />

      <div className={styles.spacer} />

      <FieldList>
        <Field.Filler />
        <Field>
          <Button
            icon={<Icon shape={mdiCheckCircle} />}
            label={formatMessage({
              id: "settings.doneButtonLabel",
              description: "Input field label.",
              defaultMessage: "Done",
            })}
            onClick={() => {
              onSubmit();
            }}
          />
        </Field>
      </FieldList>
    </Screen>
  );
}
