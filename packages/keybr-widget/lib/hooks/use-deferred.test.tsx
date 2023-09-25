import { act, render } from "@testing-library/react";
import test from "ava";
import { memo, type ReactNode } from "react";
import { withDeferred } from "./use-deferred.tsx";

declare function flushAnimationFrames(): Promise<void>;

test("render", async (t) => {
  let renderCount = 0;

  function TestChild({ a, b }: { a: string; b: string }): ReactNode {
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

  t.is(renderCount, 1);
  t.is(r.getByTitle("1").textContent, "a1");
  t.is(r.getByTitle("2").textContent, "b1");

  r.rerender(<DeferredTestChild a="a2" b="b2" />);

  t.is(renderCount, 1);
  t.is(r.getByTitle("1").textContent, "a1");
  t.is(r.getByTitle("2").textContent, "b1");

  await act(async () => {
    await flushAnimationFrames();
  });

  t.is(renderCount, 2);
  t.is(r.getByTitle("1").textContent, "a2");
  t.is(r.getByTitle("2").textContent, "b2");
});
