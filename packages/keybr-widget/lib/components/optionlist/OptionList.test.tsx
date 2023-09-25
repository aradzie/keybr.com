import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { Component, type ReactNode } from "react";
import { OptionList } from "./OptionList.tsx";
import { type OptionListOption } from "./OptionList.types.ts";

const options: readonly OptionListOption[] = [
  {
    value: "1",
    name: "One",
  },
  {
    value: "2",
    name: "Two",
  },
];

test.serial("props", (t) => {
  const r = render(
    <OptionList options={options} value="1" title="underTest" />,
  );
  const element = r.getByTitle("underTest");

  t.is(element.textContent, "One►");

  r.rerender(<OptionList options={options} value="2" />);

  t.is(element.textContent, "Two►");

  r.rerender(<OptionList options={options} value="X" />);

  t.is(element.textContent, "-►");

  r.unmount();
});

test.serial("interactions", async (t) => {
  const r = render(
    <OptionList options={options} value="1" title="underTest" />,
  );
  const element = r.getByTitle("underTest");

  t.is(r.queryByRole("menu"), null);

  await userEvent.click(r.getByText("One"));

  t.not(r.queryByRole("menu"), null);

  await userEvent.click(r.getByText("Two"));

  t.is(r.queryByRole("menu"), null);

  fireEvent.keyDown(element, { code: "Space" });

  t.not(r.queryByRole("menu"), null);

  fireEvent.keyDown(element, { code: "Space" });

  t.is(r.queryByRole("menu"), null);

  r.unmount();
});

test.serial("controlled", async (t) => {
  let value: string | undefined;

  const r = render(
    <Controlled options={options} onChange={(v) => (value = v)} />,
  );
  const element = r.getByTitle("underTest");

  await userEvent.click(r.getByText("One"));
  await userEvent.click(r.getByText("Two"));

  t.is(value, "2");

  await userEvent.click(r.getByText("Two"));
  await userEvent.click(r.getByText("One"));

  t.is(value, "1");

  fireEvent.keyDown(element, { code: "ArrowUp" });

  t.is(value, "2");

  fireEvent.keyDown(element, { code: "Space" });
  fireEvent.keyDown(element, { code: "ArrowDown" });
  fireEvent.keyDown(element, { code: "Enter" });

  t.is(value, "1");

  r.unmount();
});

class Controlled extends Component<
  {
    options: readonly OptionListOption[];
    onChange: (value: string) => void;
  },
  {
    value: string;
  }
> {
  override state = {
    value: "1",
  };

  override render(): ReactNode {
    return (
      <OptionList
        options={this.props.options}
        value={this.state.value}
        onSelect={this.handleSelect}
        title="underTest"
      />
    );
  }

  private handleSelect = (value: string): void => {
    this.setState({ value }, () => {
      this.props.onChange(value);
    });
  };
}
