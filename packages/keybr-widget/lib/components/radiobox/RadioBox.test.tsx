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
  let lastValue = "1";

  function Controlled(): ReactNode {
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

  t.is(elements[0].checked, true);
  t.is(elements[1].checked, false);
  t.is(lastValue, "1");

  await userEvent.click(elements[1]);
  t.is(elements[0].checked, false);
  t.is(elements[1].checked, true);
  t.is(lastValue, "2");

  await userEvent.click(r.getAllByRole("radio")[0]);
  t.is(elements[0].checked, true);
  t.is(elements[1].checked, false);
  t.is(lastValue, "1");

  r.unmount();
});
