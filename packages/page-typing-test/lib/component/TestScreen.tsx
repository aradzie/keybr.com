import { Screen } from "@keybr/pages-shared";
import { type LineList, newStats, type Stats } from "@keybr/textinput";
import { type TextInputEvent } from "@keybr/textinput-events";
import { type Focusable, TextArea } from "@keybr/textinput-ui";
import { Component, createRef, type ReactNode } from "react";
import { type Mark, type TextGenerator } from "../generator/index.ts";
import { Session, type SessionSettings } from "../session/index.ts";
import { type CompositeSettings } from "../settings.ts";
import { LineTemplate } from "./LineTemplate.tsx";
import { Toolbar } from "./Toolbar.tsx";

type Props = {
  readonly settings: CompositeSettings;
  readonly textGenerator: TextGenerator;
  readonly onComplete: (stats: Stats) => void;
  readonly onHelp: () => void;
  readonly onConfigure: () => void;
};

type State = {
  /** Previous settings for change detection. */
  readonly settings: CompositeSettings;
  /** A mark within the stream of words from the text generator. */
  readonly mark: Mark;
  /** A mutable fixed part of state. */
  readonly session: Session;
  /** An immutable changing part of state. */
  readonly lines: LineList;
};

export class TestScreen extends Component<Props, State> {
  readonly focusRef = createRef<Focusable>();

  override state: State = nextTest(this.props, this.props.textGenerator.mark());

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State,
  ): Partial<State> | null {
    // An uncontrolled component which needs to be updated accordingly.
    if (nextProps.settings !== prevState.settings) {
      if (nextProps.settings.textSource === prevState.settings.textSource) {
        // The generator must stay the same, can reuse the previous mark.
        return nextTest(nextProps, prevState.mark);
      } else {
        // The generator must be changed, make a new mark.
        return nextTest(nextProps, nextProps.textGenerator.mark());
      }
    } else {
      return null;
    }
  }

  handleFocus = (): void => {
    this.setState(nextTest(this.props, this.state.mark));
  };

  handleBlur = (): void => {
    this.setState(nextTest(this.props, this.state.mark));
  };

  handleTextInput = (event: TextInputEvent): void => {
    const { session } = this.state;
    const [feedback, progress, completed] = session.handleTextInput(event);
    const lines = [...session.getLines()]; // Make a copy to force render.
    this.setState({
      lines: { text: "", lines },
    });
    if (completed) {
      this.props.onComplete(newStats(session.getSteps()));
    }
  };

  override render(): ReactNode {
    return (
      <Screen>
        <Toolbar
          onHelp={this.props.onHelp}
          onConfigure={this.props.onConfigure}
        />
        <TextArea
          focusRef={this.focusRef}
          settings={this.props.settings.textDisplay}
          lines={this.state.lines}
          wrap={false}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onTextInput={this.handleTextInput}
          lineTemplate={LineTemplate}
        />
      </Screen>
    );
  }
}

function nextTest(props: Props, mark: Mark): State {
  const { settings, textGenerator } = props;
  textGenerator.reset(mark);
  const session = new Session(getSessionSettings(props), textGenerator);
  const lines = [...session.getLines()]; // Make a copy to force render.
  return {
    settings,
    mark,
    session,
    lines: { text: "", lines },
  };
}

const numLines = 7;
const numCols = 55;

function getSessionSettings(props: Props): SessionSettings {
  const {
    settings: { duration, textInput, textDisplay },
  } = props;
  return {
    duration,
    textInput,
    textDisplay,
    numLines,
    numCols,
  };
}
