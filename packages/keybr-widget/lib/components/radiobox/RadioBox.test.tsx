import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { useState } from "react";
import { RadioBox } from "./RadioBox.tsx";

test("props", () => {
  const r = render(<RadioBox checked={true} />);
  const element = r.getByRole("radio") as HTMLInputElement;

  assert.isTrue(element.checked);

  r.rerender(<RadioBox checked={false} />);

  assert.isFalse(element.checked);

  r.unmount();
});

test("controlled", async () => {
  let lastValue = "1";

  function Controlled() {
    const [value, setValue] = useState(lastValue);
    return (
      <>
        <RadioBox
          value="1"
          checked={value === "1"}
          onSelect={(value) => {
            setValue((lastValue = value || ""));
          }}
        />
        <RadioBox
          value="2"
          checked={value === "2"}
          onSelect={(value) => {
            setValue((lastValue = value || ""));
          }}
        />
      </>
    );
  }

  const r = render(<Controlled />);
  const elements = r.getAllByRole("radio") as HTMLInputElement[];

  assert.isTrue(elements[0].checked);
  assert.isFalse(elements[1].checked);
  assert.strictEqual(lastValue, "1");

  await userEvent.click(elements[1]);
  assert.isFalse(elements[0].checked);
  assert.isTrue(elements[1].checked);
  assert.strictEqual(lastValue, "2");

  await userEvent.click(r.getAllByRole("radio")[0]);
  assert.isTrue(elements[0].checked);
  assert.isFalse(elements[1].checked);
  assert.strictEqual(lastValue, "1");

  r.unmount();
});
