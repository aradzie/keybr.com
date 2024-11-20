import { test } from "node:test";
import { useTheme } from "@keybr/themes";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { equal } from "rich-assert";
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

test("mount and switch styles", async () => {
  // Act.

  const r = render(
    <ThemeProvider>
      <Switcher />
    </ThemeProvider>,
  );

  // Assert.

  equal(document.documentElement.dataset["color"], "dark");
  equal(document.documentElement.dataset["font"], "spectral");

  // Act.

  await userEvent.click(r.getByText("light"));

  // Assert.

  equal(
    document.cookie,
    "prefs=%7B%22color%22%3A%22light%22%2C%22font%22%3A%22spectral%22%7D",
  );
  equal(document.documentElement.dataset["color"], "light");
  equal(document.documentElement.dataset["font"], "spectral");

  // Act.

  await userEvent.click(r.getByText("open-sans"));

  // Assert.

  equal(
    document.cookie,
    "prefs=%7B%22color%22%3A%22light%22%2C%22font%22%3A%22open-sans%22%7D",
  );
  equal(document.documentElement.dataset["color"], "light");
  equal(document.documentElement.dataset["font"], "open-sans");

  // Cleanup.

  r.unmount();
});

test("ignore invalid cookie value", () => {
  // Arrange.

  document.cookie = "prefs=%%%garbage%%%";

  // Act.

  const r = render(
    <ThemeProvider>
      <Switcher />
    </ThemeProvider>,
  );

  // Assert.

  equal(document.cookie, "prefs=%%%garbage%%%");

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
          switchFont("open-sans");
        }}
      >
        open-sans
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
