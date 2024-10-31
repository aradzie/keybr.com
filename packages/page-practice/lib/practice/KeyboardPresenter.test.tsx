import { test } from "node:test";
import { KeyboardProvider } from "@keybr/keyboard";
import { FakeSettingsContext } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import { DeferredKeyboardPresenter } from "./KeyboardPresenter.tsx";

declare function flushAnimationFrames(): Promise<void>;

test("deferred render", async () => {
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

  r.unmount();
});
