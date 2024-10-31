import { test } from "node:test";
import { type WordList } from "@keybr/content";
import { Language } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { WordListLoader } from "./WordListLoader.tsx";

test("load word list", async () => {
  let res = [] as WordList;

  const r = render(
    <WordListLoader language={Language.EN} fallback="fallback">
      {(result) => {
        res = result;
        return <div>english</div>;
      }}
    </WordListLoader>,
  );

  await r.findByText("english");
  assert.include(res, "mother");
  assert.notInclude(res, "madre");

  r.rerender(
    <WordListLoader language={Language.ES} fallback="fallback">
      {(result) => {
        res = result;
        return <div>spanish</div>;
      }}
    </WordListLoader>,
  );

  await r.findByText("spanish");
  assert.include(res, "madre");
  assert.notInclude(res, "mother");

  r.unmount();
});
