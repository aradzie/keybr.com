import { test } from "node:test";
import { CaretShapeStyle, TapeModeStyle } from "@keybr/textinput";
import { equal } from "rich-assert";
import { computeCaretLeft, computeTapeScroll } from "./tape.ts";

test("computeCaretLeft", () => {
  equal(computeCaretLeft(CaretShapeStyle.Block, "ltr", 100, 20), 100);
  equal(computeCaretLeft(CaretShapeStyle.Box, "ltr", 100, 20), 98);
  equal(computeCaretLeft(CaretShapeStyle.Line, "ltr", 100, 20), 98);
  equal(computeCaretLeft(CaretShapeStyle.Line, "rtl", 100, 20), 120);
  equal(computeCaretLeft(CaretShapeStyle.Underline, "ltr", 100, 20), 100);
});

test("computeTapeScroll, letter mode follows the character", () => {
  const params = {
    tapeModeStyle: TapeModeStyle.Letter,
    wordX: 300,
    wordWidth: 100,
    containerWidth: 1000,
  } as const;
  // Character center is left of the container center.
  equal(computeTapeScroll({ ...params, charX: 390, charWidth: 20 }), -100);
  // Character center is right of the container center.
  equal(computeTapeScroll({ ...params, charX: 600, charWidth: 20 }), 110);
});

test("computeTapeScroll, word mode centers the word", () => {
  const params = {
    tapeModeStyle: TapeModeStyle.Word,
    charX: 720,
    charWidth: 20,
    wordX: 700,
    wordWidth: 100,
    containerWidth: 1000,
  } as const;
  equal(computeTapeScroll(params), 250);
});

test("computeTapeScroll, off mode never scrolls", () => {
  const params = {
    tapeModeStyle: TapeModeStyle.Off,
    charX: 1000,
    charWidth: 20,
    wordX: 1000,
    wordWidth: 100,
    containerWidth: 1000,
  } as const;
  equal(computeTapeScroll(params), 0);
});
