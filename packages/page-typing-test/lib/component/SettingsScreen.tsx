import { Screen } from "@keybr/pages-shared";
import { TypingSettings } from "@keybr/textinput-ui";
import { Button, Field, FieldList, Icon, Tab, TabList } from "@keybr/widget";
import { mdiCheckCircle } from "@mdi/js";
import { type ReactNode, useState } from "react";
import { TextGeneratorSettings } from "./settings/TextGeneratorSettings.tsx";

export function SettingsScreen({
  onSubmit,
}: {
  readonly onSubmit: () => void;
}): ReactNode {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Screen>
      <TabList
        selectedIndex={tabIndex}
        onSelect={(tabIndex) => {
          setTabIndex(tabIndex);
        }}
      >
        <Tab label="Text">
          <TextGeneratorSettings />
        </Tab>

        <Tab label="Typing">
          <TypingSettings />
        </Tab>
      </TabList>

      <FieldList>
        <Field.Filler />
        <Field>
          <Button
            icon={<Icon shape={mdiCheckCircle} />}
            label="Done"
            title="Save settings and return to the test."
            onClick={() => {
              onSubmit();
            }}
          />
        </Field>
      </FieldList>
    </Screen>
  );
}
