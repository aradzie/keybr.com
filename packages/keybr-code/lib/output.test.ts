import { test } from "node:test";
import { flattenStyledText } from "@keybr/textinput";
import { equal, throws } from "rich-assert";
import { Output } from "./output.ts";

test("append", () => {
  const output = new Output(100);
  equal(flattenStyledText(output.text), "");

  output.append("1");
  equal(flattenStyledText(output.text), "1");

  output.separate(",");
  equal(flattenStyledText(output.text), "1");

  output.append("2");
  equal(flattenStyledText(output.text), "1,2");

  output.append("3");
  equal(flattenStyledText(output.text), "1,23");

  output.separate("");
  output.append("4");
  equal(flattenStyledText(output.text), "1,234");

  output.separate(";");
  output.append("");
  equal(flattenStyledText(output.text), "1,234");

  output.append("5");
  equal(flattenStyledText(output.text), "1,234;5");
});

test("separate", () => {
  const output = new Output(100);
  equal(flattenStyledText(output.text), "");

  output.append(" ");
  equal(flattenStyledText(output.text), "");

  output.append("1");
  equal(flattenStyledText(output.text), "1");

  output.append(" ");
  equal(flattenStyledText(output.text), "1");

  output.append("2");
  equal(flattenStyledText(output.text), "1 2");
});

test("limits", () => {
  const output = new Output(3);
  equal(output.length, 0);
  equal(output.remaining, 3);
  equal(flattenStyledText(output.text), "");

  output.append("1");
  equal(output.length, 1);
  equal(output.remaining, 2);
  equal(flattenStyledText(output.text), "1");

  throws(() => {
    output.append("234");
  }, Output.Stop);
  equal(output.length, 1);
  equal(output.remaining, 2);
  equal(flattenStyledText(output.text), "1");

  throws(() => {
    output.separate(",,,");
  }, Output.Stop);
  equal(output.length, 1);
  equal(output.remaining, 2);
  equal(flattenStyledText(output.text), "1");

  output.separate(",");
  equal(output.length, 2);
  equal(output.remaining, 1);
  equal(flattenStyledText(output.text), "1");

  throws(() => {
    output.append("23");
  }, Output.Stop);
  equal(output.length, 2);
  equal(output.remaining, 1);
  equal(flattenStyledText(output.text), "1");

  output.append("2");
  equal(output.length, 3);
  equal(output.remaining, 0);
  equal(flattenStyledText(output.text), "1,2");

  output.clear();
  equal(output.length, 0);
  equal(output.remaining, 3);
  equal(flattenStyledText(output.text), "");
});
