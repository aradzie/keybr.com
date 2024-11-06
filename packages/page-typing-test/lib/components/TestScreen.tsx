import { Screen } from "@keybr/pages-shared";
import { type LineList, makeStats } from "@keybr/textinput";
import { TextArea } from "@keybr/textinput-ui";
import { type Focusable, Spacer, useView } from "@keybr/widget";
import { useEffect, useRef, useState } from "react";
import {
  type TextGenerator,
  TextGeneratorLoader,
} from "../generators/index.ts";
import { Session, type TestResult } from "../session/index.ts";
import { type CompositeSettings, useCompositeSettings } from "../settings.ts";
import { views } from "../views.tsx";
import { LineTemplate } from "./LineTemplate.tsx";
import * as styles from "./TestScreen.module.less";
import { Toolbar } from "./Toolbar.tsx";

export function TestScreen() {
  return (
    <TextGeneratorLoader>
      {(generator) => (
        <Controller generator={generator} mark={generator.mark()} />
      )}
    </TextGeneratorLoader>
  );
}

function Controller({
  generator,
  mark,
}: {
  readonly generator: TextGenerator;
  readonly mark: unknown;
}) {
  const { setView } = useView(views);
  const settings = useCompositeSettings();
  const focusRef = useRef<Focusable>(null);
  const [session, setSession] = useState<Session>(() =>
    nextTest(settings, generator),
  );
  const [lines, setLines] = useState<LineList>(Session.emptyLines);
  useEffect(() => {
    generator.reset(mark);
    const session = nextTest(settings, generator);
    setSession(session);
    setLines(session.getLines());
  }, [settings, generator, mark]);
  return (
    <Screen>
      <Toolbar
        onConfigure={() => {
          setView("settings");
        }}
        onChange={() => {
          focusRef.current?.focus();
        }}
      />
      <Spacer size={10} />
      <div className={styles.text}>
        <TextArea
          focusRef={focusRef}
          settings={settings.textDisplay}
          lines={lines}
          wrap={false}
          onFocus={() => {
            generator.reset(mark);
            const session = nextTest(settings, generator);
            setSession(session);
            setLines(session.getLines());
          }}
          onKeyDown={session.handleKeyDown}
          onKeyUp={session.handleKeyUp}
          onInput={(event) => {
            const { completed } = session.handleInput(event);
            setLines(session.getLines());
            if (completed) {
              setView("report", { result: makeResult(session) });
            }
          }}
          lineTemplate={LineTemplate}
        />
      </div>
    </Screen>
  );
}

function nextTest(settings: CompositeSettings, generator: TextGenerator) {
  return new Session({ ...settings, numLines: 7, numCols: 55 }, generator);
}

function makeResult(session: Session): TestResult {
  const steps = session.getSteps();
  const events = session.getEvents();
  return {
    stats: makeStats(steps),
    steps,
    events,
  };
}
