import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { SettingsScreen } from "./SettingsScreen.tsx";

test("render", async (t) => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <SettingsScreen onSubmit={() => {}} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  fireEvent.click(r.getByText("Text"));
  await r.findByText("Text Settings");

  fireEvent.click(r.getByText("Common words", { selector: "span" }));
  fireEvent.click(r.getByText("Pseudo words", { selector: "span" }));
  fireEvent.click(r.getByText("Book paragraphs", { selector: "span" }));

  t.pass();

  r.unmount();
});
