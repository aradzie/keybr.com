import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { KeyboardProvider } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import { TypingTestPage } from "./TypingTestPage.tsx";

test("render", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyboardProvider>
          <TypingTestPage />
        </KeyboardProvider>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  fireEvent.click(await r.findByTitle("Settings", { exact: false }));
  fireEvent.click(await r.findByTitle("Save settings", { exact: false }));

  r.unmount();
});
