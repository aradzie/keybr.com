import { FakeIntlProvider } from "@keybr/intl";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { TypingSettings } from "./TypingSettings.tsx";

test("render", (t) => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <TypingSettings />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  fireEvent.click(r.getByText("Stop cursor on error"));
  fireEvent.click(r.getByText("Forgive errors"));

  fireEvent.click(r.getByText("No whitespace"));
  fireEvent.click(r.getByText("Bar whitespace"));
  fireEvent.click(r.getByText("Bullet whitespace"));

  fireEvent.click(r.getByText("Block cursor"));
  fireEvent.click(r.getByText("Box cursor"));
  fireEvent.click(r.getByText("Line cursor"));
  fireEvent.click(r.getByText("Underline cursor"));

  fireEvent.click(r.getByText("Jumping cursor"));
  fireEvent.click(r.getByText("Smooth cursor"));

  t.pass();

  r.unmount();
});
