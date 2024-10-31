import { test } from "node:test";
import { type WordList } from "@keybr/content";
import { FakeRNGStream } from "@keybr/rand";
import { textDisplaySettings, textInputSettings } from "@keybr/textinput";
import { assert } from "chai";
import { CommonWordsGenerator } from "../generators/index.ts";
import { Session } from "./session.ts";
import { DurationType } from "./types.ts";

test("lines", () => {
  const wordList: WordList = ["one", "two", "three", "four", "five"];
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
    new CommonWordsGenerator(
      { wordListSize: 1000 },
      wordList,
      FakeRNGStream(wordList.length),
    ),
  );

  {
    const lines = session.getLines();
    assert.strictEqual(lines.length, 3);

    assert.deepStrictEqual(lines[0].mark, { mark: 0 });
    assert.strictEqual(lines[0].text, "one ");

    assert.deepStrictEqual(lines[1].mark, { mark: 1 });
    assert.strictEqual(lines[1].text, "two ");

    assert.deepStrictEqual(lines[2].mark, { mark: 2 });
    assert.strictEqual(lines[2].text, "three ");
  }

  session.handleInput({
    type: "input",
    timeStamp: 100,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(0)!,
    timeToType: 100,
  });
  session.handleInput({
    type: "input",
    timeStamp: 200,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(1)!,
    timeToType: 100,
  });
  session.handleInput({
    type: "input",
    timeStamp: 300,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(2)!,
    timeToType: 100,
  });
  session.handleInput({
    type: "input",
    timeStamp: 400,
    inputType: "appendChar",
    codePoint: "one ".codePointAt(3)!,
    timeToType: 100,
  });

  {
    const lines = session.getLines();
    assert.strictEqual(lines.length, 3);

    assert.deepStrictEqual(lines[0].mark, { mark: 1 });
    assert.strictEqual(lines[0].text, "two ");

    assert.deepStrictEqual(lines[1].mark, { mark: 2 });
    assert.strictEqual(lines[1].text, "three ");

    assert.deepStrictEqual(lines[2].mark, { mark: 3 });
    assert.strictEqual(lines[2].text, "four ");
  }
});
