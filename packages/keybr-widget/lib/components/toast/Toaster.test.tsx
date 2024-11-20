import { test } from "node:test";
import { act, render } from "@testing-library/react";
import { equal } from "rich-assert";
import { toast, Toaster } from "./Toaster.tsx";

test("close on timeout", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const r = render(<Toaster />);
  toast(<div data-toast={1}>Message 1</div>, {
    autoClose: 1000,
    pauseOnHover: false,
    closeOnClick: false,
  });
  toast(<div data-toast={2}>Message 2</div>, {
    autoClose: 1000,
    pauseOnHover: false,
    closeOnClick: false,
  });
  await act(async () => {});

  // Assert.

  equal(r.container.textContent, "Message 2Message 1");

  // Act.

  act(() => {
    ctx.mock.timers.runAll();
  });
  await act(async () => {});

  // Assert.

  equal(document.body.textContent, "");

  // Cleanup.

  r.unmount();
});

test("close on click", async (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const r = render(<Toaster />);
  toast(<div data-toast={1}>Message 1</div>, {
    autoClose: false,
    pauseOnHover: false,
    closeOnClick: true,
  });
  toast(<div data-toast={2}>Message 2</div>, {
    autoClose: false,
    pauseOnHover: false,
    closeOnClick: true,
  });
  await act(async () => {});

  // Assert.

  equal(r.container.textContent, "Message 2Message 1");

  // Act.

  r.container.querySelector<HTMLElement>("[data-toast='1']")!.click();
  await act(async () => {});

  // Assert.

  equal(r.container.textContent, "Message 2");

  // Act.

  r.container.querySelector<HTMLElement>("[data-toast='2']")!.click();
  await act(async () => {});

  // Assert.

  equal(r.container.textContent, "");

  // Cleanup.

  r.unmount();
});
