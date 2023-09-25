import { useTheme } from "@keybr/lnf";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode } from "react";
import { ThemeProvider } from "./provider.tsx";

test.beforeEach(() => {
  document.documentElement.dataset["theme"] = "dark";
  document.documentElement.dataset["text"] = "huge";

  document.cookie =
    "prefs=%7B%22themeName%22%3A%22dark%22%2C%22textSize%22%3A%22huge%22%7D";
});

test.afterEach(() => {
  document.documentElement.dataset["theme"] = "";
  document.documentElement.dataset["text"] = "";
});

test.serial("mount and switch styles", async (t) => {
  // Act.

  const r = render(
    <ThemeProvider>
      <Switcher />
    </ThemeProvider>,
  );

  // Assert.

  t.false(document.fullscreenEnabled);
  t.is(document.fullscreenElement, null);

  t.is(document.documentElement.dataset["theme"], "dark");
  t.is(document.documentElement.dataset["text"], "huge");

  // Act.

  await userEvent.click(r.getByText("light theme"));

  // Assert.

  t.is(
    document.cookie,
    "prefs=%7B%22themeName%22%3A%22light%22%2C%22textSize%22%3A%22huge%22%7D",
  );
  t.is(document.documentElement.dataset["theme"], "light");
  t.is(document.documentElement.dataset["text"], "huge");

  // Act.

  await userEvent.click(r.getByText("normal text size"));

  // Assert.

  t.is(
    document.cookie,
    "prefs=%7B%22themeName%22%3A%22light%22%2C%22textSize%22%3A%22normal%22%7D",
  );
  t.is(document.documentElement.dataset["theme"], "light");
  t.is(document.documentElement.dataset["text"], "normal");

  // Cleanup.

  r.unmount();
});

test.serial("ignore invalid cookie value", (t) => {
  // Arrange.

  document.cookie = "prefs=%%%garbage%%%";

  // Act.

  const r = render(
    <ThemeProvider>
      <Switcher />
    </ThemeProvider>,
  );

  // Assert.

  t.is(document.cookie, "prefs=%%%garbage%%%");

  // Cleanup.

  r.unmount();
});

function Switcher(): ReactNode {
  const ctl = useTheme();
  return (
    <div>
      <button
        onClick={() => {
          ctl.switchTheme("light");
        }}
      >
        light theme
      </button>
      <button
        onClick={() => {
          ctl.switchTheme("dark");
        }}
      >
        dark theme
      </button>
      <button
        onClick={() => {
          ctl.switchTextSize("normal");
        }}
      >
        normal text size
      </button>
      <button
        onClick={() => {
          ctl.switchTextSize("large");
        }}
      >
        large text size
      </button>
      <button
        onClick={() => {
          ctl.switchTextSize("huge");
        }}
      >
        huge text size
      </button>
    </div>
  );
}
