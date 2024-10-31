import { test } from "node:test";
import { flattenStyledText } from "@keybr/textinput";
import { assert } from "chai";
import { Output } from "./output.ts";

test("append", () => {
  const output = new Output(100);
  assert.strictEqual(flattenStyledText(output.text), "");

  output.append("1");
  assert.strictEqual(flattenStyledText(output.text), "1");

  output.separate(",");
  assert.strictEqual(flattenStyledText(output.text), "1");

  output.append("2");
  assert.strictEqual(flattenStyledText(output.text), "1,2");

  output.append("3");
  assert.strictEqual(flattenStyledText(output.text), "1,23");

  output.separate("");
  output.append("4");
  assert.strictEqual(flattenStyledText(output.text), "1,234");

  output.separate(";");
  output.append("");
  assert.strictEqual(flattenStyledText(output.text), "1,234");

  output.append("5");
  assert.strictEqual(flattenStyledText(output.text), "1,234;5");
});

test("separate", () => {
  const output = new Output(100);
  assert.strictEqual(flattenStyledText(output.text), "");

  output.append(" ");
  assert.strictEqual(flattenStyledText(output.text), "");

  output.append("1");
  assert.strictEqual(flattenStyledText(output.text), "1");

  output.append(" ");
  assert.strictEqual(flattenStyledText(output.text), "1");

  output.append("2");
  assert.strictEqual(flattenStyledText(output.text), "1 2");
});

test("limits", () => {
  const output = new Output(3);
  assert.strictEqual(output.length, 0);
  assert.strictEqual(output.remaining, 3);
  assert.strictEqual(flattenStyledText(output.text), "");

  output.append("1");
  assert.strictEqual(output.length, 1);
  assert.strictEqual(output.remaining, 2);
  assert.strictEqual(flattenStyledText(output.text), "1");

  assert.throws(() => {
    output.append("234");
  }, Output.Stop);
  assert.strictEqual(output.length, 1);
  assert.strictEqual(output.remaining, 2);
  assert.strictEqual(flattenStyledText(output.text), "1");

  assert.throws(() => {
    output.separate(",,,");
  }, Output.Stop);
  assert.strictEqual(output.length, 1);
  assert.strictEqual(output.remaining, 2);
  assert.strictEqual(flattenStyledText(output.text), "1");

  output.separate(",");
  assert.strictEqual(output.length, 2);
  assert.strictEqual(output.remaining, 1);
  assert.strictEqual(flattenStyledText(output.text), "1");

  assert.throws(() => {
    output.append("23");
  }, Output.Stop);
  assert.strictEqual(output.length, 2);
  assert.strictEqual(output.remaining, 1);
  assert.strictEqual(flattenStyledText(output.text), "1");

  output.append("2");
  assert.strictEqual(output.length, 3);
  assert.strictEqual(output.remaining, 0);
  assert.strictEqual(flattenStyledText(output.text), "1,2");

  output.clear();
  assert.strictEqual(output.length, 0);
  assert.strictEqual(output.remaining, 3);
  assert.strictEqual(flattenStyledText(output.text), "");
});
