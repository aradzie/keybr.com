import { Screen } from "@keybr/pages-shared";
import { TypingSettings } from "@keybr/textinput-ui";
import {
  Button,
  ExplainerBoundary,
  Field,
  FieldList,
  Icon,
  Tab,
  TabList,
  useView,
} from "@keybr/widget";
import { mdiCheckCircle } from "@mdi/js";
import { useState } from "react";
import { views } from "../views.tsx";
import { TextGeneratorSettings } from "./settings/TextGeneratorSettings.tsx";

export function SettingsScreen() {
  const { setView } = useView(views);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Screen>
      <ExplainerBoundary defaultVisible={false}>
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
              onClick={() => {
                setView("test");
              }}
            />
          </Field>
        </FieldList>
      </ExplainerBoundary>
    </Screen>
  );
}
