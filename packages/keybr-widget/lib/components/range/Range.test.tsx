import { test } from "node:test";
import { fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { equal } from "rich-assert";
import { Range } from "./Range.tsx";

test("props", () => {
  const r = render(<Range min={1} max={100} step={5} value={50} />);
  const element = r.getByRole("slider") as HTMLInputElement;

  equal(element.min, "1");
  equal(element.max, "100");
  equal(element.step, "5");
  equal(element.value, "50");

  r.rerender(<Range min={1} max={100} step={5} value={1000} />);

  equal(element.value, "100");

  r.unmount();
});

test("controlled", () => {
  let lastValue = 1;

  function Controlled() {
    const [value, setValue] = useState(lastValue);
    return (
      <Range
        min={1}
        max={100}
        step={1}
        value={value}
        onChange={(value) => {
          setValue((lastValue = value));
        }}
      />
    );
  }

  const r = render(<Controlled />);
  const element = r.getByRole("slider") as HTMLInputElement;

  equal(element.value, "1");
  equal(lastValue, 1);

  fireEvent.change(element, { target: { value: "10" } });

  equal(element.value, "10");
  equal(lastValue, 10);

  fireEvent.change(element, { target: { value: "100" } });

  equal(element.value, "100");
  equal(lastValue, 100);

  r.unmount();
});
