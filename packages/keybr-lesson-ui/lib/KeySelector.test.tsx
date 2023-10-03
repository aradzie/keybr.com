import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel, type Letter } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { Component, type ReactNode } from "react";
import TestRenderer from "react-test-renderer";
import { KeySelector } from "./KeySelector.tsx";

const { letters } = FakePhoneticModel;
const keyStatsMap = newKeyStatsMap(letters, []);

test.serial("render", (t) => {
  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySelector keyStatsMap={keyStatsMap} current={letters[0]} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

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

  t.is(current?.value, "b");

  await userEvent.click(r.getByText("B"));
  await userEvent.click(r.getByText("A"));

  t.is(current?.value, "a");

  fireEvent.keyDown(element, { code: "ArrowLeft" });

  t.is(current?.value, "j");

  fireEvent.keyDown(element, { code: "ArrowUp" });

  t.is(current?.value, "i");

  fireEvent.keyDown(element, { code: "ArrowRight" });

  t.is(current?.value, "j");

  fireEvent.keyDown(element, { code: "ArrowDown" });

  t.is(current?.value, "a");

  r.unmount();
});

class Controlled extends Component<
  {
    keyStatsMap: KeyStatsMap;
    onChange: (value: Letter) => void;
  },
  {
    value: Letter;
  }
> {
  override state = {
    value: this.props.keyStatsMap.letters[0],
  };

  override render(): ReactNode {
    return (
      <KeySelector
        keyStatsMap={this.props.keyStatsMap}
        current={this.state.value}
        title="underTest"
        onSelect={this.handleSelect}
      />
    );
  }

  private handleSelect = (value: Letter): void => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };
}
