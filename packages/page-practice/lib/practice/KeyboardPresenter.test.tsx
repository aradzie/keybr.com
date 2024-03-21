import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import { FakeSettingsContext } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import test from "ava";
import { DeferredKeyboardPresenter } from "./KeyboardPresenter.tsx";

declare function flushAnimationFrames(): Promise<void>;

test.serial("deferred render", async (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <FakeSettingsContext>
      <KeyboardContext.Provider value={keyboard}>
        <DeferredKeyboardPresenter
          focus={false}
          depressedKeys={[]}
          toggledKeys={[]}
          suffix={[]}
          lastLesson={null}
        />
      </KeyboardContext.Provider>
    </FakeSettingsContext>,
  );

  r.rerender(
    <FakeSettingsContext>
      <KeyboardContext.Provider value={keyboard}>
        <DeferredKeyboardPresenter
          focus={true}
          depressedKeys={["KeyA"]}
          toggledKeys={["CapsLock"]}
          suffix={[0x0061, 0x0062, 0x0063]}
          lastLesson={null}
        />
      </KeyboardContext.Provider>
    </FakeSettingsContext>,
  );

  await act(async () => {
    await flushAnimationFrames();
  });

  t.pass();

  r.unmount();
});
