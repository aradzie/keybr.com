import { KeyboardProvider } from "@keybr/keyboard";
import { FakeSettingsContext } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import test from "ava";
import { DeferredKeyboardPresenter } from "./KeyboardPresenter.tsx";

declare function flushAnimationFrames(): Promise<void>;

test.serial("deferred render", async (t) => {
  const r = render(
    <FakeSettingsContext>
      <KeyboardProvider>
        <DeferredKeyboardPresenter
          focus={false}
          depressedKeys={[]}
          toggledKeys={[]}
          suffix={[]}
          lastLesson={null}
        />
      </KeyboardProvider>
    </FakeSettingsContext>,
  );

  r.rerender(
    <FakeSettingsContext>
      <KeyboardProvider>
        <DeferredKeyboardPresenter
          focus={true}
          depressedKeys={["KeyA"]}
          toggledKeys={["CapsLock"]}
          suffix={[0x0061, 0x0062, 0x0063]}
          lastLesson={null}
        />
      </KeyboardProvider>
    </FakeSettingsContext>,
  );

  await act(async () => {
    await flushAnimationFrames();
  });

  t.pass();

  r.unmount();
});
