import { fake } from "@keybr/test-env-time";
import { act, render } from "@testing-library/react";
import test from "ava";
import { toast, Toaster } from "./Toaster.tsx";

test.beforeEach(() => {
  fake.timers.set();
});

test.afterEach(() => {
  fake.timers.reset();
});

test.serial("close on timeout", async (t) => {
  // Arrange.

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

  t.is(r.container.textContent, "Message 2Message 1");

  // Act.

  await fake.timers.run();
  await act(async () => {});

  // Assert.

  t.is(document.body.textContent, "");

  // Cleanup.

  r.unmount();
});

test.serial("close on click", async (t) => {
  // Arrange.

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

  t.is(r.container.textContent, "Message 2Message 1");

  // Act.

  r.container.querySelector<HTMLElement>("[data-toast='1']")!.click();
  await act(async () => {});

  // Assert.

  t.is(r.container.textContent, "Message 2");

  // Act.

  r.container.querySelector<HTMLElement>("[data-toast='2']")!.click();
  await act(async () => {});

  // Assert.

  t.is(r.container.textContent, "");

  // Cleanup.

  r.unmount();
});
