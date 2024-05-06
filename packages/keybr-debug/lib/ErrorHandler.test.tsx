import { act, render } from "@testing-library/react";
import test from "ava";
import { ErrorHandler } from "./ErrorHandler.tsx";
import { catchError } from "./logger.ts";

// See https://github.com/facebook/react/issues/11098

test.beforeEach(() => {
  window.addEventListener("error", preventDefault);
});

test.afterEach(() => {
  window.removeEventListener("error", preventDefault);
});

test.serial("success", (t) => {
  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child />
    </ErrorHandler>,
  );

  t.is(r.container.textContent, "OK");

  r.unmount();
});

test.serial("mount failure", (t) => {
  const logged: any[] = [];
  const saved = console.error;
  console.error = (...args: any[]): void => {
    logged.push(args);
  };

  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child fail={new Error("abc", { cause: new Error("xyz") })} />
    </ErrorHandler>,
  );

  t.is(r.container.textContent, "Error: abc\n\nCause: Error: xyz");
  t.is(logged.length, 0); // We canceled the logging in tests.

  console.error = saved;
  r.unmount();
});

test.serial("external failure", (t) => {
  const logged: any[] = [];
  const saved = console.error;
  console.error = (...args: any[]): void => {
    logged.push(args);
  };

  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child />
    </ErrorHandler>,
  );

  act(() => {
    catchError(new RangeError("FAIL"));
  });

  t.is(r.container.textContent, "RangeError: FAIL");
  t.is(logged.length, 1);

  console.error = saved;
  r.unmount();
});

function ErrorDisplay({ report }: { readonly report: string }) {
  return <div>{report}</div>;
}

function Child({ fail = null }: { readonly fail?: any }) {
  if (fail != null) {
    throw fail;
  } else {
    return <div>OK</div>;
  }
}

function preventDefault(ev: Event): void {
  ev.preventDefault();
}
