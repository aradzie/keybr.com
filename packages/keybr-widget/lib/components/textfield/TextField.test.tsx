import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { useState } from "react";
import { TextField } from "./TextField.tsx";

test("props", () => {
  const r = render(<TextField value="abc" />);
  const element = r.getByRole("textbox") as HTMLInputElement;

  assert.strictEqual(element.value, "abc");

  r.rerender(<TextField value="xyz" />);

  assert.strictEqual(element.value, "xyz");

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

  assert.strictEqual(element.value, "abc");
  assert.strictEqual(lastValue, "abc");

  await userEvent.clear(element);

  assert.strictEqual(element.value, "");
  assert.strictEqual(lastValue, "");

  await userEvent.type(element, "xyz");

  assert.strictEqual(element.value, "xyz");
  assert.strictEqual(lastValue, "xyz");

  r.unmount();
});
