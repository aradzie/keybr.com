import { test } from "node:test";
import { act, render } from "@testing-library/react";
import { equal, includes } from "rich-assert";
import { ErrorHandler } from "./ErrorHandler.tsx";
import { catchError } from "./logger.ts";

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
  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child fail={new Error("abc", { cause: new Error("xyz") })} />
    </ErrorHandler>,
  );

  includes(r.container.textContent!, "Error: abc");
  includes(r.container.textContent!, "Cause: Error: xyz");

  r.unmount();
});

test("external failure", () => {
  const r = render(
    <ErrorHandler display={ErrorDisplay}>
      <Child />
    </ErrorHandler>,
  );

  act(() => {
    catchError(new RangeError("abc"));
  });

  includes(r.container.textContent!, "RangeError: abc");

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
