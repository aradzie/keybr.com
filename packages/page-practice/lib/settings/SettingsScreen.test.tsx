import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import { isNotNull } from "rich-assert";
import { SettingsScreen } from "./SettingsScreen.tsx";

const faker = new ResultFaker();

test("render", async () => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <FakeResultContext initialResults={faker.nextResultList(100)}>
          <SettingsScreen />
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  isNotNull(await r.findByText("Lessons"));
  isNotNull(await r.findByText("Typing"));
  isNotNull(await r.findByText("Keyboard"));
  isNotNull(await r.findByText("Miscellaneous"));

  fireEvent.click(r.getByText("Lessons"));

  isNotNull(r.queryByText("Lesson Options"));
  isNotNull(r.queryByText("Lesson Preview"));

  fireEvent.click(r.getByText("Typing"));

  isNotNull(r.queryByText("Typing Options"));

  fireEvent.click(r.getByText("Keyboard"));

  isNotNull(r.queryByText("Options"));
  isNotNull(r.queryByText("Preview"));

  fireEvent.click(r.getByText("Miscellaneous"));

  isNotNull(r.queryByText("Interface Options"));

  r.unmount();
});
