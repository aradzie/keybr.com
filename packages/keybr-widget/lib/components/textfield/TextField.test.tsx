import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { equal } from "rich-assert";
import { TextField } from "./TextField.tsx";

test("props", () => {
  const r = render(<TextField value="abc" />);
  const element = r.getByRole("textbox") as HTMLInputElement;

  equal(element.value, "abc");

  r.rerender(<TextField value="xyz" />);

  equal(element.value, "xyz");

  r.unmount();
});

test("controlled", async () => {
  let lastValue = "abc";

  function Controlled() {
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

  equal(element.value, "abc");
  equal(lastValue, "abc");

  await userEvent.clear(element);

  equal(element.value, "");
  equal(lastValue, "");

  await userEvent.type(element, "xyz");

  equal(element.value, "xyz");
  equal(lastValue, "xyz");

  r.unmount();
});
