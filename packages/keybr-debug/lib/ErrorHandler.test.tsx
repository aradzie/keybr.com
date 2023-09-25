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
    <ErrorHandler details={DetailsMessage}>
      <Child fail={false} />
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
    <ErrorHandler details={DetailsMessage}>
      <Child fail={true} />
    </ErrorHandler>,
  );

  t.is(r.container.textContent, "Error: OMG\nBecause: TypeError: Cause");
  t.is(logged.length, 0); // We cancelled logging in tests.

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
    <ErrorHandler details={DetailsMessage}>
      <Child fail={false} />
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

function DetailsMessage({ report }: { readonly report: string }) {
  return <div>{report}</div>;
}

function Child({ fail }: { readonly fail: boolean }) {
  if (fail) {
    throw new Error("OMG", { cause: new TypeError("Cause") });
  } else {
    return <div>OK</div>;
  }
}

function preventDefault(ev: Event): void {
  ev.preventDefault();
}
