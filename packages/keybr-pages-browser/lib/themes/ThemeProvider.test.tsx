import { useTheme } from "@keybr/themes";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { ThemeProvider } from "./ThemeProvider.tsx";

test.beforeEach(() => {
  window.matchMedia = (query) => {
    return new (class extends EventTarget {
      matches = false;
      media = query;
    })() as MediaQueryList;
  };
});

test.beforeEach(() => {
  document.documentElement.dataset["color"] = "dark";
  document.documentElement.dataset["font"] = "spectral";

  document.cookie =
    "prefs=%7B%22color%22%3A%22dark%22%2C%22font%22%3A%22spectral%22%7D";
});

test.afterEach(() => {
  document.documentElement.dataset["color"] = "";
  document.documentElement.dataset["font"] = "";
});

test.serial("mount and switch styles", async (t) => {
  // Act.

  const r = render(
    <ThemeProvider>
      <Switcher />
    </ThemeProvider>,
  );

  // Assert.

  t.is(document.documentElement.dataset["color"], "dark");
  t.is(document.documentElement.dataset["font"], "spectral");

  // Act.

  await userEvent.click(r.getByText("light"));

  // Assert.

  t.is(
    document.cookie,
    "prefs=%7B%22color%22%3A%22light%22%2C%22font%22%3A%22spectral%22%7D",
  );
  t.is(document.documentElement.dataset["color"], "light");
  t.is(document.documentElement.dataset["font"], "spectral");

  // Act.

  await userEvent.click(r.getByText("opensans"));

  // Assert.

  t.is(
    document.cookie,
    "prefs=%7B%22color%22%3A%22light%22%2C%22font%22%3A%22opensans%22%7D",
  );
  t.is(document.documentElement.dataset["color"], "light");
  t.is(document.documentElement.dataset["font"], "opensans");

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

function Switcher() {
  const { switchColor, switchFont } = useTheme();
  return (
    <div>
      <button
        onClick={() => {
          switchColor("light");
        }}
      >
        light
      </button>
      <button
        onClick={() => {
          switchColor("dark");
        }}
      >
        dark
      </button>
      <button
        onClick={() => {
          switchFont("opensans");
        }}
      >
        opensans
      </button>
      <button
        onClick={() => {
          switchFont("spectral");
        }}
      >
        spectral
      </button>
    </div>
  );
}
