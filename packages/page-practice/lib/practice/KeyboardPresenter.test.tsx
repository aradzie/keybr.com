import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import { act, render } from "@testing-library/react";
import test from "ava";
import { DeferredKeyboardPresenter } from "./KeyboardPresenter.tsx";

declare function flushAnimationFrames(): Promise<void>;

test.serial("deferred render", async (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const r = render(
    <KeyboardContext.Provider value={keyboard}>
      <DeferredKeyboardPresenter
        focus={false}
        depressedKeys={[]}
        toggledKeys={[]}
        lastLesson={null}
      />
    </KeyboardContext.Provider>,
  );

  r.rerender(
    <KeyboardContext.Provider value={keyboard}>
      <DeferredKeyboardPresenter
        focus={true}
        depressedKeys={["KeyA"]}
        toggledKeys={["CapsLock"]}
        lastLesson={null}
      />
    </KeyboardContext.Provider>,
  );

  await act(async () => {
    await flushAnimationFrames();
  });

  t.pass();

  r.unmount();
});
