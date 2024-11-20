import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { isFalse, isTrue } from "rich-assert";
import { CheckBox } from "./CheckBox.tsx";

test("props", () => {
  const r = render(<CheckBox checked={true} />);
  const element = r.getByRole("checkbox") as HTMLInputElement;

  isTrue(element.checked);

  r.rerender(<CheckBox checked={false} />);

  isFalse(element.checked);

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

  isFalse(element.checked);
  isFalse(lastValue);

  await userEvent.click(element);
  isTrue(element.checked);
  isTrue(lastValue);

  await userEvent.click(element);
  isFalse(element.checked);
  isFalse(lastValue);

  r.unmount();
});
