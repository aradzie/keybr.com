import { KeyboardProvider } from "@keybr/keyboard";
import { Screen } from "@keybr/pages-shared";
import { SettingsContext, useSettings } from "@keybr/settings";
import { TypingSettings } from "@keybr/textinput-ui";
import {
  Button,
  ExplainerBoundary,
  Field,
  FieldList,
  Header,
  Icon,
  Spacer,
  useView,
} from "@keybr/widget";
import { mdiCheckCircle, mdiDeleteForever } from "@mdi/js";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { views } from "../views.tsx";
import { ExplainSettings } from "./ExplainSettings.tsx";
import { KeyboardSettings } from "./KeyboardSettings.tsx";
import { LessonSettings } from "./LessonSettings.tsx";
import { MiscSettings } from "./MiscSettings.tsx";
import * as styles from "./SettingsScreen.module.less";

export function SettingsScreen() {
  const { settings, updateSettings } = useSettings();
  const { setView } = useView(views);
  const [newSettings, updateNewSettings] = useState(settings);
  return (
    <SettingsContext.Provider
      value={{
        settings: newSettings,
        updateSettings: updateNewSettings,
      }}
    >
      <KeyboardProvider>
        <Content
          onSubmit={() => {
            updateSettings(newSettings);
            setView("practice");
          }}
        />
      </KeyboardProvider>
    </SettingsContext.Provider>
  );
}

function Content({ onSubmit }: { readonly onSubmit: () => void }) {
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

        <Spacer size={5} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.typing.header"
            defaultMessage="Typing"
          />
        </Header>
        <TypingSettings />

        <Spacer size={5} />

        <Header level={1}>
          <FormattedMessage
            id="settings.tab.keyboard.header"
            defaultMessage="Keyboard"
          />
        </Header>
        <KeyboardSettings />

        <Spacer size={5} />

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
                size={16}
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
                size={16}
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
