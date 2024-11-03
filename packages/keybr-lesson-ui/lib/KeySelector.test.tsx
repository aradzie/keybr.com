import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel, type Letter } from "@keybr/phonetic-model";
import { type KeyStatsMap, makeKeyStatsMap } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { type ReactNode, useState } from "react";
import { KeySelector } from "./KeySelector.tsx";

const { letters } = FakePhoneticModel;
const keyStatsMap = makeKeyStatsMap(letters, []);

test("props", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySelector
          keyStatsMap={keyStatsMap}
          current={letters[0]}
          title="underTest"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  const element = r.getByTitle("underTest");

  assert.strictEqual(element.textContent, "ABCDEFGHIJ");

  r.rerender(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySelector
          keyStatsMap={keyStatsMap}
          current={letters[1]}
          title="underTest"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  assert.strictEqual(element.textContent, "ABCDEFGHIJ");

  r.unmount();
});

test("controlled", async () => {
  let current: Letter | undefined;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Controlled
          keyStatsMap={keyStatsMap}
          onChange={(letter) => {
            current = letter;
          }}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  const element = r.getByTitle("underTest");

  await userEvent.click(r.getByText("A"));
  await userEvent.click(r.getByText("B"));

  assert.strictEqual(current?.label, "B");

  await userEvent.click(r.getByText("B"));
  await userEvent.click(r.getByText("A"));

  assert.strictEqual(current?.label, "A");

  fireEvent.keyDown(element, { code: "ArrowLeft" });

  assert.strictEqual(current?.label, "J");

  fireEvent.keyDown(element, { code: "ArrowUp" });

  assert.strictEqual(current?.label, "I");

  fireEvent.keyDown(element, { code: "ArrowRight" });

  assert.strictEqual(current?.label, "J");

  fireEvent.keyDown(element, { code: "ArrowDown" });

  assert.strictEqual(current?.label, "A");

  r.unmount();
});

function Controlled({
  keyStatsMap,
  onChange,
}: {
  keyStatsMap: KeyStatsMap;
  onChange: (value: Letter) => void;
}): ReactNode {
  const [value, setValue] = useState(keyStatsMap.letters[0]);
  return (
    <KeySelector
      keyStatsMap={keyStatsMap}
      current={value}
      onSelect={(value) => {
        setValue(value);
        onChange(value);
      }}
      title="underTest"
    />
  );
}
