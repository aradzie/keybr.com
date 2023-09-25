import { type Stats } from "@keybr/textinput";
import { Component, createRef, type ReactNode } from "react";
import { Report } from "./component/Report.tsx";
import {
  type CompositeSettings,
  defaultSettings,
} from "./component/settings/index.ts";
import { SettingsScreen } from "./component/SettingsScreen.tsx";
import { TestScreen } from "./component/TestScreen.tsx";
import { TextGeneratorLoader } from "./generator/index.ts";

type Props = {
  /* Empty. */
};

type State = {
  readonly settings: CompositeSettings;
  readonly view: "test" | "report" | "settings";
  readonly stats: Stats | null;
};

export class TypingTestApp extends Component<Props, State> {
  private readonly testScreen = createRef<TestScreen>();

  override state: State = {
    settings: { ...defaultSettings },
    view: "test",
    stats: null,
  };

  override render(): ReactNode {
    const { settings, view, stats } = this.state;
    switch (view) {
      case "test":
        return (
          <TextGeneratorLoader textSource={settings.textSource}>
            {(textGenerator) => (
              <TestScreen
                ref={this.testScreen}
                settings={settings}
                textGenerator={textGenerator}
                onChangeSettings={(settings) => {
                  this.setState(
                    {
                      settings,
                    },
                    () => {
                      this.testScreen.current?.focus();
                    },
                  );
                }}
                onComplete={(stats) => {
                  this.setState({
                    view: "report",
                    stats,
                  });
                }}
                onHelp={() => {}}
                onConfigure={() => {
                  this.setState({
                    view: "settings",
                  });
                }}
              />
            )}
          </TextGeneratorLoader>
        );
      case "report":
        return (
          <Report
            stats={stats!}
            onNext={() => {
              this.setState({ view: "test" });
            }}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            defaultSettings={settings}
            onSubmit={(settings) => {
              this.setState({
                settings,
                view: "test",
              });
            }}
          />
        );
    }
  }
}
