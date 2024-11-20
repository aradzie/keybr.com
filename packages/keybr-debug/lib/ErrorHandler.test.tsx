import { test } from "node:test";
import { act, render } from "@testing-library/react";
import { equal, includes } from "rich-assert";
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

  equal(r.container.textContent, "OK");

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

  includes(r.container.textContent!, "Error: abc");
  includes(r.container.textContent!, "Cause: Error: xyz");
  equal(logged.length, 0); // We canceled the logging in tests.

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

  includes(r.container.textContent!, "RangeError: abc");
  equal(logged.length, 1);

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
