import { KeyboardProvider } from "@keybr/keyboard";
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
  styleWidth16,
} from "@keybr/widget";
import { mdiCheckCircle, mdiDeleteForever } from "@mdi/js";
import { type ReactNode, useState } from "react";
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
  return (
    <SettingsContext.Provider
      value={{
        settings: newSettings,
        updateSettings: (newSettings) => {
          setNewSettings(newSettings);
        },
      }}
    >
      <KeyboardProvider>
        <Content
          onSubmit={() => {
            onSubmit(newSettings);
          }}
        />
      </KeyboardProvider>
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
            defaultMessage="Lessons"
          />
        </Header>
        <LessonSettings />

        <div className={styles.spacer} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.typing.header"
            defaultMessage="Typing"
          />
        </Header>
        <TypingSettings />

        <div className={styles.spacer} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.keyboard.header"
            defaultMessage="Keyboard"
          />
        </Header>
        <KeyboardSettings />

        <div className={styles.spacer} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.miscellaneous.header"
            defaultMessage="Miscellaneous"
          />
        </Header>
        <MiscSettings />

        <div className={styles.footer}>
          <FieldList>
            <Field>
              <Button
                className={styleWidth16}
                icon={<Icon shape={mdiDeleteForever} />}
                label={formatMessage({
                  id: "settings.widget.reset.name",
                  defaultMessage: "Reset",
                })}
                title={formatMessage({
                  id: "settings.widget.reset.description",
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
                className={styleWidth16}
                icon={<Icon shape={mdiCheckCircle} />}
                label={formatMessage({
                  id: "settings.widget.done.name",
                  defaultMessage: "Done",
                })}
                title={formatMessage({
                  id: "settings.widget.done.description",
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
