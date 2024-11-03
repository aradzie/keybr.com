import { test } from "node:test";
import { fireEvent, render } from "@testing-library/react";
import { assert } from "chai";
import { useState } from "react";
import { Range } from "./Range.tsx";

test("props", () => {
  const r = render(<Range min={1} max={100} step={5} value={50} />);
  const element = r.getByRole("slider") as HTMLInputElement;

  assert.strictEqual(element.min, "1");
  assert.strictEqual(element.max, "100");
  assert.strictEqual(element.step, "5");
  assert.strictEqual(element.value, "50");

  r.rerender(<Range min={1} max={100} step={5} value={1000} />);

  assert.strictEqual(element.value, "100");

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

  assert.strictEqual(element.value, "1");
  assert.strictEqual(lastValue, 1);

  fireEvent.change(element, { target: { value: "10" } });

  assert.strictEqual(element.value, "10");
  assert.strictEqual(lastValue, 10);

  fireEvent.change(element, { target: { value: "100" } });

  assert.strictEqual(element.value, "100");
  assert.strictEqual(lastValue, 100);

  r.unmount();
});
