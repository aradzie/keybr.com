import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel, type PhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { type ReactNode } from "react";
import { LessonLoader } from "./LessonLoader.tsx";

test.serial("load", async (t) => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <FakeSettingsContext initialSettings={new Settings()}>
      <KeyboardContext.Provider value={keyboard}>
        <LessonLoader>
          {({ model }) => <TestChild model={model} />}
        </LessonLoader>
      </KeyboardContext.Provider>
    </FakeSettingsContext>,
  );

  t.is((await r.findByTitle("letters")).textContent, "ABCDEFGHIJ");

  r.unmount();
});

function TestChild({ model }: { readonly model: PhoneticModel }): ReactNode {
  return <span title="letters">{model.letters.map(String).join("")}</span>;
}
