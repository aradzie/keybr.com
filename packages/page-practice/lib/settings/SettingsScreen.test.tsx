import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeResultContext, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { SettingsScreen } from "./SettingsScreen.tsx";

const faker = new ResultFaker();

test.serial("render", async (t) => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <FakeResultContext initialResults={faker.nextResultList(100)}>
          <SettingsScreen onSubmit={() => {}} />
        </FakeResultContext>
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.not(await r.findByText("Lessons"), null);
  t.not(await r.findByText("Typing"), null);
  t.not(await r.findByText("Keyboard"), null);
  t.not(await r.findByText("Miscellaneous"), null);

  fireEvent.click(r.getByText("Lessons"));

  t.not(r.queryByText("Lesson Options"), null);
  t.not(r.queryByText("Lesson Preview"), null);

  fireEvent.click(r.getByText("Typing"));

  t.not(r.queryByText("Typing Options"), null);

  fireEvent.click(r.getByText("Keyboard"));

  t.not(r.queryByText("Options"), null);
  t.not(r.queryByText("Preview"), null);

  fireEvent.click(r.getByText("Miscellaneous"));

  t.not(r.queryByText("Interface Options"), null);

  r.unmount();
});
