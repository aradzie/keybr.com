import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import { assert } from "chai";
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

  assert.isNotNull(await r.findByText("Lessons"));
  assert.isNotNull(await r.findByText("Typing"));
  assert.isNotNull(await r.findByText("Keyboard"));
  assert.isNotNull(await r.findByText("Miscellaneous"));

  fireEvent.click(r.getByText("Lessons"));

  assert.isNotNull(r.queryByText("Lesson Options"));
  assert.isNotNull(r.queryByText("Lesson Preview"));

  fireEvent.click(r.getByText("Typing"));

  assert.isNotNull(r.queryByText("Typing Options"));

  fireEvent.click(r.getByText("Keyboard"));

  assert.isNotNull(r.queryByText("Options"));
  assert.isNotNull(r.queryByText("Preview"));

  fireEvent.click(r.getByText("Miscellaneous"));

  assert.isNotNull(r.queryByText("Interface Options"));

  r.unmount();
});
