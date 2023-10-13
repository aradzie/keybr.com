import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { type ReactNode, useState } from "react";
import { Range } from "./Range.tsx";

test.serial("props", (t) => {
  const r = render(<Range min={1} max={100} step={5} value={50} />);
  const element = r.getByRole("slider") as HTMLInputElement;

  t.is(element.min, "1");
  t.is(element.max, "100");
  t.is(element.step, "5");
  t.is(element.value, "50");

  r.rerender(<Range min={1} max={100} step={5} value={1000} />);

  t.is(element.value, "100");

  r.unmount();
});

test.serial("controlled", (t) => {
  const r = render(<Controlled />);
  const element = r.getByRole("slider") as HTMLInputElement;

  t.is(element.value, "1");

  fireEvent.change(element, { target: { value: "100" } });

  t.is(element.value, "100");

  r.unmount();
});

function Controlled(): ReactNode {
  const [value, setValue] = useState(1);
  return (
    <Range
      min={1}
      max={100}
      step={1}
      value={value}
      onChange={(value) => {
        setValue(value);
      }}
    />
  );
}
