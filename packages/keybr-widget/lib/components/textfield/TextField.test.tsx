import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
import { TextField } from "./TextField.tsx";

test.serial("props", (t) => {
  const r = render(<TextField value="abc" />);
  const element = r.getByRole("textbox") as HTMLInputElement;

  t.is(element.value, "abc");

  r.rerender(<TextField value="xyz" />);

  t.is(element.value, "xyz");

  r.unmount();
});

test.serial("controlled", async (t) => {
  let lastValue = "abc";

  function Controlled(): ReactNode {
    const [value, setValue] = useState(lastValue);
    return (
      <TextField
        value={value}
        onChange={(value) => {
          setValue((lastValue = value));
        }}
      />
    );
  }

  const r = render(<Controlled />);
  const element = r.getByRole("textbox") as HTMLInputElement;

  t.is(element.value, "abc");
  t.is(lastValue, "abc");

  await userEvent.clear(element);

  t.is(element.value, "");
  t.is(lastValue, "");

  await userEvent.type(element, "xyz");

  t.is(element.value, "xyz");
  t.is(lastValue, "xyz");

  r.unmount();
});
