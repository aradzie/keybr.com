import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { useState } from "react";
import { CheckBox } from "./CheckBox.tsx";

test("props", () => {
  const r = render(<CheckBox checked={true} />);
  const element = r.getByRole("checkbox") as HTMLInputElement;

  assert.isTrue(element.checked);

  r.rerender(<CheckBox checked={false} />);

  assert.isFalse(element.checked);

  r.unmount();
});

test("controlled", async () => {
  let lastValue = false;

  function Controlled() {
    const [checked, setChecked] = useState(lastValue);
    return (
      <CheckBox
        checked={checked}
        onChange={(value) => {
          setChecked((lastValue = value));
        }}
      />
    );
  }

  const r = render(<Controlled />);
  const element = r.getByRole("checkbox") as HTMLInputElement;

  assert.isFalse(element.checked);
  assert.isFalse(lastValue);

  await userEvent.click(element);
  assert.isTrue(element.checked);
  assert.isTrue(lastValue);

  await userEvent.click(element);
  assert.isFalse(element.checked);
  assert.isFalse(lastValue);

  r.unmount();
});
