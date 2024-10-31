import { Screen } from "@keybr/pages-shared";
import { type LineList, makeStats, type Stats } from "@keybr/textinput";
import { TextArea } from "@keybr/textinput-ui";
import { type Focusable, Spacer } from "@keybr/widget";
import { memo, useRef, useState } from "react";
import { type TextGenerator } from "../generators/index.ts";
import { Session } from "../session/index.ts";
import { type CompositeSettings } from "../settings.ts";
import { LineTemplate } from "./LineTemplate.tsx";
import { Toolbar } from "./Toolbar.tsx";

export const TestScreen = memo(function TestScreen({
  settings,
  generator,
  onComplete,
  onConfigure,
}: {
  readonly settings: CompositeSettings;
  readonly generator: TextGenerator;
  readonly onComplete: (stats: Stats) => void;
  readonly onConfigure: () => void;
}) {
  const focusRef = useRef<Focusable>(null);
  const [mark, setMark] = useState(() => generator.mark());
  const [session, setSession] = useState(() => nextTest(settings, generator));
  const [lines, setLines] = useState<LineList>(() => ({ text: "", lines: [] }));
  return (
    <Screen>
      <Toolbar
        onConfigure={onConfigure}
        onChange={() => {
          focusRef.current?.focus();
        }}
      />
      <Spacer size={10} />
      <TextArea
        focusRef={focusRef}
        settings={settings.textDisplay}
        lines={lines}
        wrap={false}
        onFocus={() => {
          generator.reset(mark);
          const session = nextTest(settings, generator);
          setSession(session);
          setLines({ text: "", lines: session.getLines() });
        }}
        onInput={(event) => {
          const [feedback, progress, completed] = session.handleInput(event);
          setLines({ text: "", lines: session.getLines() });
          if (completed) {
            setMark(generator.mark());
            onComplete(makeStats(session.getSteps()));
          }
        }}
        lineTemplate={LineTemplate}
      />
    </Screen>
  );
});

function nextTest(settings: CompositeSettings, generator: TextGenerator) {
  return new Session({ ...settings, numLines: 7, numCols: 55 }, generator);
}
