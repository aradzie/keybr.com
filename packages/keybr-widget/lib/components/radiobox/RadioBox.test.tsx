import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { equal, isFalse, isTrue } from "rich-assert";
import { RadioBox } from "./RadioBox.tsx";

test("props", () => {
  const r = render(<RadioBox checked={true} />);
  const element = r.getByRole("radio") as HTMLInputElement;

  isTrue(element.checked);

  r.rerender(<RadioBox checked={false} />);

  isFalse(element.checked);

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

  isTrue(elements[0].checked);
  isFalse(elements[1].checked);
  equal(lastValue, "1");

  await userEvent.click(elements[1]);
  isFalse(elements[0].checked);
  isTrue(elements[1].checked);
  equal(lastValue, "2");

  await userEvent.click(r.getAllByRole("radio")[0]);
  isTrue(elements[0].checked);
  isFalse(elements[1].checked);
  equal(lastValue, "1");

  r.unmount();
});
