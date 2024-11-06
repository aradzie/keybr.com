import { test } from "node:test";
import { act, render } from "@testing-library/react";
import { assert } from "chai";
import { ErrorHandler } from "./ErrorHandler.tsx";
import { catchError } from "./logger.ts";

// See https://github.com/facebook/react/issues/11098

test.beforeEach(() => {
  window.addEventListener("error", preventDefault);
});

test.afterEach(() => {
  window.removeEventListener("error", preventDefault);
});

test("success", () => {
  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child />
    </ErrorHandler>,
  );

  assert.strictEqual(r.container.textContent, "OK");

  r.unmount();
});

test("mount failure", () => {
  const logged = [];
  const saved = console.error;
  console.error = (...args) => {
    logged.push(args);
  };

  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child fail={new Error("abc", { cause: new Error("xyz") })} />
    </ErrorHandler>,
  );

  assert.include(r.container.textContent, "Error: abc");
  assert.include(r.container.textContent, "Cause: Error: xyz");
  assert.strictEqual(logged.length, 0); // We canceled the logging in tests.

  console.error = saved;
  r.unmount();
});

test("external failure", () => {
  const logged = [];
  const saved = console.error;
  console.error = (...args) => {
    logged.push(args);
  };

  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child />
    </ErrorHandler>,
  );

  act(() => {
    catchError(new RangeError("abc"));
  });

  assert.include(r.container.textContent, "RangeError: abc");
  assert.strictEqual(logged.length, 1);

  console.error = saved;
  r.unmount();
});

function ErrorDisplay({ report }: { report: string }) {
  return <div>{report}</div>;
}

function Child({ fail = null }: { fail?: any }) {
  if (fail != null) {
    throw fail;
  } else {
    return <div>OK</div>;
  }
}

function preventDefault(ev: Event) {
  ev.preventDefault();
}
