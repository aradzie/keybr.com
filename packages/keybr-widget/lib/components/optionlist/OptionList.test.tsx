import { test } from "node:test";
import { fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { equal, isNotNull, isNull } from "rich-assert";
import { OptionList } from "./OptionList.tsx";
import { type OptionListOption } from "./OptionList.types.ts";

const options: readonly OptionListOption[] = [
  {
    value: "1",
    name: "One",
  },
  {
    value: "2",
    name: "Two",
  },
];

test("props", () => {
  const r = render(
    <OptionList options={options} value="1" title="underTest" />,
  );
  const element = r.getByTitle("underTest");

  equal(element.textContent, "One►");
  r.rerender(<OptionList options={options} value="2" />);
  equal(element.textContent, "Two►");
  r.rerender(<OptionList options={options} value="X" />);
  equal(element.textContent, "-►");

  r.unmount();
});

test("interactions", async () => {
  const r = render(
    <OptionList options={options} value="1" title="underTest" />,
  );
  const element = r.getByTitle("underTest");

  isNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("One"));
  isNotNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("Two"));
  isNull(r.queryByRole("menu"));
  fireEvent.keyDown(element, { code: "Space" });
  isNotNull(r.queryByRole("menu"));
  fireEvent.keyDown(element, { code: "Space" });
  isNull(r.queryByRole("menu"));

  r.unmount();
});

test("controlled", async () => {
  let lastValue = "1";

  function Controlled() {
    const [value, setValue] = useState(lastValue);
    return (
      <OptionList
        options={options}
        value={value}
        onSelect={(value) => {
          setValue((lastValue = value));
        }}
        title="underTest"
      />
    );
  }

  const r = render(<Controlled />);
  const element = r.getByTitle("underTest");

  isNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("One"));
  isNotNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("Two"));
  equal(lastValue, "2");

  isNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("Two"));
  isNotNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("One"));
  equal(lastValue, "1");

  isNull(r.queryByRole("menu"));
  fireEvent.keyDown(element, { code: "ArrowUp" });
  isNotNull(r.queryByRole("menu"));
  await userEvent.click(r.getByText("Two"));
  equal(lastValue, "2");

  fireEvent.keyDown(element, { code: "Space" });
  fireEvent.keyDown(element, { code: "Home" });
  fireEvent.keyDown(element, { code: "Enter" });
  equal(lastValue, "1");

  fireEvent.keyDown(element, { code: "Space" });
  fireEvent.keyDown(element, { code: "End" });
  fireEvent.keyDown(element, { code: "Enter" });
  equal(lastValue, "2");

  r.unmount();
});
