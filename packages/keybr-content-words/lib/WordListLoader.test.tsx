import { type WordList } from "@keybr/content";
import { Language } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { WordListLoader } from "./WordListLoader.tsx";

test.serial("load word list", async (t) => {
  let ref = null as WordList | null;

  const r = render(
    <WordListLoader language={Language.EN} fallback="fallback">
      {(result) => {
        ref = result;
        return <div>english</div>;
      }}
    </WordListLoader>,
  );

  await r.findByText("english");
  t.true(ref?.includes("mother"));
  t.false(ref?.includes("madre"));

  r.rerender(
    <WordListLoader language={Language.ES} fallback="fallback">
      {(result) => {
        ref = result;
        return <div>spanish</div>;
      }}
    </WordListLoader>,
  );

  await r.findByText("spanish");
  t.true(ref?.includes("madre"));
  t.false(ref?.includes("mother"));

  r.unmount();
});
