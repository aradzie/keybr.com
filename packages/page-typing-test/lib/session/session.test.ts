import { describe, it } from "node:test";
import { FakeRNGStream } from "@keybr/rand";
import { textDisplaySettings, textInputSettings } from "@keybr/textinput";
import { type IInputEvent } from "@keybr/textinput-events";
import { equal, like } from "rich-assert";
import { CommonWordsGenerator } from "../generators/index.ts";
import { Session } from "./session.ts";
import { DurationType } from "./types.ts";

describe("session", () => {
  const words = ["one", "two", "three", "four", "five"];
  const session = new Session(
    {
      duration: {
        type: DurationType.Length,
        value: 10,
      },
      numLines: 3,
      numCols: 3,
      textInput: textInputSettings,
      textDisplay: textDisplaySettings,
    },
    new CommonWordsGenerator({ wordListSize: 1000 }, words, FakeRNGStream(words.length)),
  );

  const events: IInputEvent[] = [
    { type: "input", timeStamp: 100, inputType: "appendChar", codePoint: /* "o" */ 0x006f, timeToType: 100 },
    { type: "input", timeStamp: 200, inputType: "appendChar", codePoint: /* "n" */ 0x006e, timeToType: 100 },
    { type: "input", timeStamp: 300, inputType: "appendChar", codePoint: /* "e" */ 0x0065, timeToType: 100 },
    { type: "input", timeStamp: 400, inputType: "appendChar", codePoint: /* SPACE */ 0x0020, timeToType: 100 },
  ];

  it("should have initial state", () => {
    const { lines } = session.getLines();
    equal(lines.length, 3);
    like(lines, [
      { text: "one ", mark: { mark: 0 } },
      { text: "two ", mark: { mark: 1 } },
      { text: "three ", mark: { mark: 2 } },
    ]);
  });

  it("should update state on input", () => {
    for (const event of events) {
      session.handleInput(event);
    }

    const { lines } = session.getLines();
    equal(lines.length, 3);
    like(lines, [
      { text: "two ", mark: { mark: 1 } },
      { text: "three ", mark: { mark: 2 } },
      { text: "four ", mark: { mark: 3 } },
    ]);
  });
});
