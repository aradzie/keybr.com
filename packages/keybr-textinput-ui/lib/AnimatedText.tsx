import {
  type Char,
  type TextDisplaySettings,
  TextInput,
} from "@keybr/textinput";
import { type ReactNode, useEffect, useState } from "react";
import { StaticText, type TextAreaSize } from "./TextArea.tsx";

export function AnimatedText({
  settings,
  text,
  wrap,
  size,
}: {
  readonly settings: TextDisplaySettings;
  readonly text: string;
  readonly wrap?: boolean;
  readonly size?: TextAreaSize;
}): ReactNode {
  const chars = useAnimatedTextState(text);
  return (
    <StaticText
      settings={settings}
      chars={chars}
      cursor={true}
      wrap={wrap}
      size={size}
    />
  );
}

function useAnimatedTextState(text: string): readonly Char[] {
  const [{ textInput, chars }, setState] = useState(() => newState(text));
  if (textInput.text !== text) {
    setState(newState(text));
  }
  useEffect(() => {
    const id = setInterval(() => {
      const { codePoints } = textInput;
      const steps = textInput.getSteps();
      if (codePoints.length === steps.length) {
        textInput.reset();
      } else {
        textInput.step(codePoints[steps.length], 0);
      }
      const chars = textInput.getChars();
      setState({ textInput, chars });
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, [textInput]);
  return chars;
}

function newState(text: string) {
  const textInput = new TextInput(text, {
    stopOnError: false,
    forgiveErrors: false,
  });
  const chars = textInput.getChars();
  return { textInput, chars };
}
