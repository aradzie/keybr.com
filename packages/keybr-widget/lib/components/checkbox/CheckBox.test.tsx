import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
import { CheckBox } from "./CheckBox.tsx";

test.serial("props", (t) => {
  const r = render(<CheckBox checked={true} />);
  const element = r.getByRole("checkbox") as HTMLInputElement;

  t.is(element.checked, true);

  r.rerender(<CheckBox checked={false} />);

  t.is(element.checked, false);

  r.unmount();
});

test.serial("controlled", async (t) => {
  const r = render(<Controlled />);
  const element = r.getByRole("checkbox") as HTMLInputElement;

  t.is(element.checked, false);

  await userEvent.click(element);

  t.is(element.checked, true);

  r.unmount();
});

function Controlled(): ReactNode {
  const [checked, setChecked] = useState(false);
  return (
    <CheckBox
      checked={checked}
      onChange={(value) => {
        setChecked(value);
      }}
    />
  );
}
