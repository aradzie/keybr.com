import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel, type Letter } from "@keybr/phonetic-model";
import { type KeyStatsMap, makeKeyStatsMap } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
import { KeySelector } from "./KeySelector.tsx";

const { letters } = FakePhoneticModel;
const keyStatsMap = makeKeyStatsMap(letters, []);

test.serial("props", (t) => {
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

  t.is(element.textContent, "ABCDEFGHIJ");

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

  t.is(element.textContent, "ABCDEFGHIJ");

  r.unmount();
});

test.serial("controlled", async (t) => {
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

  t.is(current?.label, "B");

  await userEvent.click(r.getByText("B"));
  await userEvent.click(r.getByText("A"));

  t.is(current?.label, "A");

  fireEvent.keyDown(element, { code: "ArrowLeft" });

  t.is(current?.label, "J");

  fireEvent.keyDown(element, { code: "ArrowUp" });

  t.is(current?.label, "I");

  fireEvent.keyDown(element, { code: "ArrowRight" });

  t.is(current?.label, "J");

  fireEvent.keyDown(element, { code: "ArrowDown" });

  t.is(current?.label, "A");

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
