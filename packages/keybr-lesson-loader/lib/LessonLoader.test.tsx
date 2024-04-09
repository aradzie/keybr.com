import {
  codePointsFrom,
  type Keyboard,
  KeyboardContext,
} from "@keybr/keyboard";
import { FakePhoneticModel, type PhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { FakeSettingsContext, Settings } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { type ReactNode } from "react";
import { LessonLoader } from "./LessonLoader.tsx";

test.serial("load", async (t) => {
  PhoneticModelLoader.loader = FakePhoneticModel.loader;

  const r = render(
    <FakeSettingsContext initialSettings={new Settings()}>
      <KeyboardContext.Provider
        value={
          {
            getCodePoints() {
              return codePointsFrom("abc");
            },
          } as Keyboard
        }
      >
        <LessonLoader>
          {({ model }) => <TestChild model={model} />}
        </LessonLoader>
      </KeyboardContext.Provider>
    </FakeSettingsContext>,
  );

  t.is((await r.findByTitle("letters")).textContent, "ABC");

  r.unmount();
});

function TestChild({ model }: { readonly model: PhoneticModel }): ReactNode {
  return <span title="letters">{model.letters.map(String).join("")}</span>;
}
