import { type KeyId } from "@keybr/keyboard";
import { Screen } from "@keybr/pages-shared";
import { enumProp } from "@keybr/settings";
import { type LineList } from "@keybr/textinput";
import {
  type KeyEvent,
  ModifierState,
  type TextInputEvent,
} from "@keybr/textinput-events";
import { TextArea } from "@keybr/textinput-ui";
import { PureComponent, type ReactNode } from "react";
import { Prefs } from "../prefs.ts";
import { Announcer } from "./Announcer.tsx";
import { Controls } from "./Controls.tsx";
import { Indicators } from "./Indicators.tsx";
import { DeferredKeyboardPresenter } from "./KeyboardPresenter.tsx";
import * as names from "./names.module.less";
import { type PracticeState } from "./practicestate.ts";
import { PracticeTour } from "./PracticeTour.tsx";
import * as styles from "./Presenter.module.less";

type Props = {
  readonly state: PracticeState;
  readonly lines: LineList;
  readonly depressedKeys: readonly KeyId[];
  readonly onResetLesson: () => void;
  readonly onSkipLesson: () => void;
  readonly onKeyDown: (ev: KeyEvent) => void;
  readonly onKeyUp: (ev: KeyEvent) => void;
  readonly onTextInput: (ev: TextInputEvent) => void;
  readonly onConfigure: () => void;
};

type State = {
  readonly view: View;
  readonly tour: boolean;
  readonly focus: boolean;
};

enum View {
  Normal = 1,
  Compact = 2,
  Bare = 3,
}

function getNextView(view: View): View {
  switch (view) {
    case View.Normal:
      return View.Compact;
    case View.Compact:
      return View.Bare;
    case View.Bare:
      return View.Normal;
  }
}

const propView = enumProp("prefs.practice.view", View, View.Normal);

export class Presenter extends PureComponent<Props, State> {
  override state: State = {
    view: Prefs.get(propView),
    tour: false,
    focus: false,
  };

  override componentDidMount(): void {
    if (this.props.state.showTour) {
      this.setState({
        view: View.Normal,
        tour: true,
      });
    }
  }

  override render(): ReactNode {
    const {
      props: { state, lines, depressedKeys, onConfigure },
      state: { view, tour, focus },
      handleResetLesson,
      handleSkipLesson,
      handleKeyDown,
      handleKeyUp,
      handleTextInput,
      handleFocus,
      handleBlur,
      handleChangeView,
      handleHelp,
      handleTourClose,
    } = this;
    switch (view) {
      case View.Normal:
        return (
          <NormalLayout
            state={state}
            focus={focus}
            depressedKeys={depressedKeys}
            toggledKeys={ModifierState.modifiers}
            controls={
              <Controls
                onChangeView={handleChangeView}
                onResetLesson={handleResetLesson}
                onSkipLesson={handleSkipLesson}
                onHelp={handleHelp}
                onConfigure={onConfigure}
              />
            }
            textInput={
              <TextArea
                settings={state.textDisplaySettings}
                lines={lines}
                size="X0"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onTextInput={handleTextInput}
              />
            }
            tour={tour && <PracticeTour onClose={handleTourClose} />}
          />
        );
      case View.Compact:
        return (
          <CompactLayout
            state={state}
            focus={focus}
            depressedKeys={depressedKeys}
            controls={
              <Controls
                onChangeView={handleChangeView}
                onResetLesson={handleResetLesson}
                onSkipLesson={handleSkipLesson}
                onHelp={handleHelp}
                onConfigure={onConfigure}
              />
            }
            textInput={
              <TextArea
                settings={state.textDisplaySettings}
                lines={lines}
                size="X1"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onTextInput={handleTextInput}
              />
            }
          />
        );
      case View.Bare:
        return (
          <BareLayout
            state={state}
            focus={focus}
            depressedKeys={depressedKeys}
            controls={
              <Controls
                onChangeView={handleChangeView}
                onResetLesson={handleResetLesson}
                onSkipLesson={handleSkipLesson}
                onHelp={handleHelp}
                onConfigure={onConfigure}
              />
            }
            textInput={
              <TextArea
                settings={state.textDisplaySettings}
                lines={lines}
                size="X2"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onTextInput={handleTextInput}
              />
            }
          />
        );
    }
  }

  handleResetLesson = (): void => {
    this.props.onResetLesson();
  };

  handleSkipLesson = (): void => {
    this.props.onSkipLesson();
  };

  handleKeyDown = (ev: KeyEvent): void => {
    if (this.state.focus) {
      this.props.onKeyDown(ev);
    }
  };

  handleKeyUp = (ev: KeyEvent): void => {
    if (this.state.focus) {
      this.props.onKeyUp(ev);
    }
  };

  handleTextInput = (ev: TextInputEvent): void => {
    if (this.state.focus) {
      this.props.onTextInput(ev);
    }
  };

  handleFocus = (): void => {
    this.setState(
      {
        focus: true,
      },
      () => {
        this.props.onResetLesson();
      },
    );
  };

  handleBlur = (): void => {
    this.setState(
      {
        focus: false,
      },
      () => {
        this.props.onResetLesson();
      },
    );
  };

  handleChangeView = (): void => {
    this.setState(
      ({ view }) => {
        const nextView = getNextView(view);
        Prefs.set(propView, nextView);
        return { view: nextView };
      },
      () => {
        this.props.onResetLesson();
      },
    );
  };

  handleHelp = (): void => {
    this.setState(
      {
        view: View.Normal,
        tour: true,
      },
      () => {
        this.props.onResetLesson();
      },
    );
  };

  handleTourClose = (): void => {
    this.setState(
      {
        view: View.Normal,
        tour: false,
      },
      () => {
        this.props.onResetLesson();
      },
    );
  };
}

function NormalLayout({
  state,
  focus,
  depressedKeys,
  toggledKeys,
  controls,
  textInput,
  tour,
}: {
  readonly state: PracticeState;
  readonly focus: boolean;
  readonly depressedKeys: readonly string[];
  readonly toggledKeys: readonly string[];
  readonly controls: ReactNode;
  readonly textInput: ReactNode;
  readonly tour: ReactNode;
}): ReactNode {
  return (
    <Screen>
      <Indicators state={state} />
      {controls}
      <div id={names.textInput} className={styles.textInput_normal}>
        {textInput}
      </div>
      <div id={names.keyboard}>
        <DeferredKeyboardPresenter
          focus={focus}
          depressedKeys={depressedKeys}
          toggledKeys={toggledKeys}
          suffix={state.suffix}
          lastLesson={state.lastLesson}
        />
      </div>
      <Announcer state={state} />
      {tour}
    </Screen>
  );
}

function CompactLayout({
  state,
  controls,
  textInput,
}: {
  readonly state: PracticeState;
  readonly focus: boolean;
  readonly depressedKeys: readonly string[];
  readonly controls: ReactNode;
  readonly textInput: ReactNode;
}): ReactNode {
  return (
    <Screen>
      <Indicators state={state} />
      {controls}
      <div id={names.textInput} className={styles.textInput_compact}>
        {textInput}
      </div>
      <Announcer state={state} />
    </Screen>
  );
}

function BareLayout({
  state,
  controls,
  textInput,
}: {
  readonly state: PracticeState;
  readonly focus: boolean;
  readonly depressedKeys: readonly string[];
  readonly controls: ReactNode;
  readonly textInput: ReactNode;
}): ReactNode {
  return (
    <Screen>
      {controls}
      <div id={names.textInput} className={styles.textInput_bare}>
        {textInput}
      </div>
      <Announcer state={state} />
    </Screen>
  );
}
