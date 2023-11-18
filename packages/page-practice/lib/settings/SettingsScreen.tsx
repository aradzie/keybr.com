import { KeyboardContext, keyboardProps, loadKeyboard } from "@keybr/keyboard";
import { Screen } from "@keybr/pages-shared";
import { type Settings, SettingsContext, useSettings } from "@keybr/settings";
import { TypingSettings } from "@keybr/textinput-ui";
import {
  Button,
  ExplainerBoundary,
  Field,
  FieldList,
  Header,
  Icon,
  styleWidthWide,
} from "@keybr/widget";
import { mdiCheckCircle, mdiDeleteForever } from "@mdi/js";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ExplainSettings } from "./ExplainSettings.tsx";
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
    const geometry = newSettings.get(keyboardProps.geometry);
    return loadKeyboard(layout, geometry);
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
  const { settings, updateSettings } = useSettings();
  return (
    <Screen>
      <ExplainerBoundary>
        <ExplainSettings />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.lessons.header"
            description="Header text."
            defaultMessage="Lessons"
          />
        </Header>
        <LessonSettings />

        <div className={styles.spacer} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.typing.header"
            description="Header text."
            defaultMessage="Typing"
          />
        </Header>
        <TypingSettings />

        <div className={styles.spacer} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.keyboard.header"
            description="Header text."
            defaultMessage="Keyboard"
          />
        </Header>
        <KeyboardSettings />

        <div className={styles.spacer} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.miscellaneous.header"
            description="Header text."
            defaultMessage="Miscellaneous"
          />
        </Header>
        <MiscSettings />

        <div className={styles.footer}>
          <FieldList>
            <Field>
              <Button
                className={styleWidthWide}
                icon={<Icon shape={mdiDeleteForever} />}
                label={formatMessage({
                  id: "settings.widget.reset.name",
                  description: "Widget name.",
                  defaultMessage: "Reset",
                })}
                title={formatMessage({
                  id: "settings.widget.reset.description",
                  description: "Widget description.",
                  defaultMessage: "Reset all settings to the default values.",
                })}
                onClick={() => {
                  updateSettings(settings.reset());
                }}
              />
            </Field>
            <Field.Filler />
            <Field>
              <Button
                className={styleWidthWide}
                icon={<Icon shape={mdiCheckCircle} />}
                label={formatMessage({
                  id: "settings.widget.done.name",
                  description: "Widget name.",
                  defaultMessage: "Done",
                })}
                title={formatMessage({
                  id: "settings.widget.done.description",
                  description: "Widget description.",
                  defaultMessage:
                    "Save all settings and return to the practice.",
                })}
                onClick={() => {
                  onSubmit();
                }}
              />
            </Field>
          </FieldList>
        </div>
      </ExplainerBoundary>
    </Screen>
  );
}
