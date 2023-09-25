import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { Component, type ReactNode } from "react";
import { RadioBox } from "./RadioBox.tsx";

test.serial("props", (t) => {
  const r = render(<RadioBox checked={true} />);
  const element = r.getByRole("radio") as HTMLInputElement;

  t.is(element.checked, true);

  r.rerender(<RadioBox checked={false} />);

  t.is(element.checked, false);

  r.unmount();
});

test.serial("controlled", async (t) => {
  const r = render(<Controlled />);
  const element = r.getByRole("radio") as HTMLInputElement;

  t.is(element.checked, false);

  await userEvent.click(element);

  t.is(element.checked, true);

  r.unmount();
});

test.serial("controlled group", async (t) => {
  let value: string | undefined;

  const r = render(<ControlledGroup onChange={(v) => (value = v)} />);

  t.is(value, undefined);

  await userEvent.click(r.getAllByRole("radio")[1]);

  t.is(value, "2");

  await userEvent.click(r.getAllByRole("radio")[0]);

  t.is(value, "1");

  r.unmount();
});

class Controlled extends Component<unknown, { checked: boolean }> {
  override state = {
    checked: false,
  };

  override render(): ReactNode {
    return (
      <RadioBox checked={this.state.checked} onChange={this.handleChange} />
    );
  }

  private handleChange = (checked: boolean): void => {
    this.setState({ checked });
  };
}

class ControlledGroup extends Component<
  { onChange: (value?: string) => void },
  { value: string }
> {
  override state = {
    value: "1",
  };

  override render(): ReactNode {
    return (
      <>
        <RadioBox
          value="1"
          checked={this.state.value === "1"}
          onSelect={this.handleSelect}
        />
        <RadioBox
          value="2"
          checked={this.state.value === "2"}
          onSelect={this.handleSelect}
        />
      </>
    );
  }

  private handleSelect = (value?: string): void => {
    this.setState({ value: value || "empty" }, () => {
      this.props.onChange(value);
    });
  };
}
