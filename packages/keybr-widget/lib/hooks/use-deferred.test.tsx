import { test } from "node:test";
import { act, render } from "@testing-library/react";
import { memo } from "react";
import { equal } from "rich-assert";
import { withDeferred } from "./use-deferred.tsx";

declare function flushAnimationFrames(): Promise<void>;

test("render", async () => {
  let renderCount = 0;

  function TestChild({ a, b }: { a: string; b: string }) {
    renderCount += 1;
    return (
      <div>
        <span title="1">{a}</span>
        <span title="2">{b}</span>
      </div>
    );
  }

  const DeferredTestChild = withDeferred(memo(TestChild));

  const r = render(<DeferredTestChild a="a1" b="b1" />);

  await act(async () => {
    await flushAnimationFrames();
  });

  equal(renderCount, 1);
  equal(r.getByTitle("1").textContent, "a1");
  equal(r.getByTitle("2").textContent, "b1");

  r.rerender(<DeferredTestChild a="a2" b="b2" />);

  equal(renderCount, 1);
  equal(r.getByTitle("1").textContent, "a1");
  equal(r.getByTitle("2").textContent, "b1");

  await act(async () => {
    await flushAnimationFrames();
  });

  equal(renderCount, 2);
  equal(r.getByTitle("1").textContent, "a2");
  equal(r.getByTitle("2").textContent, "b2");
});
