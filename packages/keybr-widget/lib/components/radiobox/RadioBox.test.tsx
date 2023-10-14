import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
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

function Controlled(): ReactNode {
  const [checked, setChecked] = useState(false);
  return (
    <RadioBox
      checked={checked}
      onChange={(value) => {
        setChecked(value);
      }}
    />
  );
}

function ControlledGroup({
  onChange,
}: {
  readonly onChange: (value?: string) => void;
}): ReactNode {
  const [value, setValue] = useState("1");
  const handleSelect = (value?: string): void => {
    setValue(value || "empty");
    onChange(value);
  };
  return (
    <>
      <RadioBox value="1" checked={value === "1"} onSelect={handleSelect} />
      <RadioBox value="2" checked={value === "2"} onSelect={handleSelect} />
    </>
  );
}
