import { fake } from "@keybr/test-env-time";
import { act } from "@testing-library/react";
import test from "ava";
import { toast } from "./Toaster.tsx";

test.beforeEach(() => {
  fake.timers.set();
});

test.afterEach(() => {
  fake.timers.reset();
});

test.serial("close on timeout", async (t) => {
  // Arrange.

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

  t.is(document.body.textContent, "Message 1Message 2");

  // Act.

  await fake.timers.run();
  await act(async () => {});

  // Assert.

  t.is(document.body.textContent, "");
});

test.serial("close on click", async (t) => {
  // Arrange.

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

  t.is(document.body.textContent, "Message 1Message 2");

  // Act.

  document.querySelector<HTMLElement>("[data-toast='1']")!.click();
  await act(async () => {});

  // Assert.

  t.is(document.body.textContent, "Message 2");

  // Act.

  document.querySelector<HTMLElement>("[data-toast='2']")!.click();
  await act(async () => {});

  // Assert.

  t.is(document.body.textContent, "");
});
