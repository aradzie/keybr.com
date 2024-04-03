import { KeyboardContext, Layout, loadKeyboard, Ngram2 } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { TransitionsLayer } from "./TransitionsLayer.tsx";

test("empty", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const ngram = new Ngram2([/* a */ 0x0061, /* b */ 0x0062, /* c */ 0x0063]);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer ngram={ngram} />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("equal counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const ngram = new Ngram2([/* a */ 0x0061, /* b */ 0x0062, /* c */ 0x0063]);
  ngram.set(/* a */ 0x0061, /* b */ 0x0062, 1);
  ngram.set(/* b */ 0x0062, /* c */ 0x0063, 1);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer ngram={ngram} />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("different counts", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const ngram = new Ngram2([/* a */ 0x0061, /* b */ 0x0062, /* c */ 0x0063]);
  ngram.set(/* a */ 0x0061, /* b */ 0x0062, 1);
  ngram.set(/* b */ 0x0062, /* c */ 0x0063, 2);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer ngram={ngram} />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});

test("self arrow", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const ngram = new Ngram2([/* a */ 0x0061, /* b */ 0x0062, /* c */ 0x0063]);
  ngram.set(/* a */ 0x0061, /* a */ 0x0061, 1);

  const renderer = TestRenderer.create(
    <KeyboardContext.Provider value={keyboard}>
      <TransitionsLayer ngram={ngram} />
    </KeyboardContext.Provider>,
  );

  t.snapshot(renderer.toJSON());
});
