import { test } from "node:test";
import { type WordList } from "@keybr/content";
import { Language } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import { doesNotInclude, includes } from "rich-assert";
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
  includes(res, "mother");
  doesNotInclude(res, "madre");

  r.rerender(
    <WordListLoader language={Language.ES} fallback="fallback">
      {(result) => {
        res = result;
        return <div>spanish</div>;
      }}
    </WordListLoader>,
  );

  await r.findByText("spanish");
  includes(res, "madre");
  doesNotInclude(res, "mother");

  r.unmount();
});
