import { fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
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

test.serial("props", (t) => {
  const r = render(
    <OptionList options={options} value="1" title="underTest" />,
  );
  const element = r.getByTitle("underTest");

  t.is(element.textContent, "One►");
  r.rerender(<OptionList options={options} value="2" />);
  t.is(element.textContent, "Two►");
  r.rerender(<OptionList options={options} value="X" />);
  t.is(element.textContent, "-►");

  r.unmount();
});

test.serial("interactions", async (t) => {
  const r = render(
    <OptionList options={options} value="1" title="underTest" />,
  );
  const element = r.getByTitle("underTest");

  t.is(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("One"));
  t.not(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("Two"));
  t.is(r.queryByRole("menu"), null);
  fireEvent.keyDown(element, { code: "Space" });
  t.not(r.queryByRole("menu"), null);
  fireEvent.keyDown(element, { code: "Space" });
  t.is(r.queryByRole("menu"), null);

  r.unmount();
});

test.serial("controlled", async (t) => {
  let lastValue = "1";

  function Controlled(): ReactNode {
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

  t.is(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("One"));
  t.not(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("Two"));
  t.is(lastValue, "2");

  t.is(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("Two"));
  t.not(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("One"));
  t.is(lastValue, "1");

  t.is(r.queryByRole("menu"), null);
  fireEvent.keyDown(element, { code: "ArrowUp" });
  t.not(r.queryByRole("menu"), null);
  await userEvent.click(r.getByText("Two"));
  t.is(lastValue, "2");

  fireEvent.keyDown(element, { code: "Space" });
  fireEvent.keyDown(element, { code: "Home" });
  fireEvent.keyDown(element, { code: "Enter" });
  t.is(lastValue, "1");

  fireEvent.keyDown(element, { code: "Space" });
  fireEvent.keyDown(element, { code: "End" });
  fireEvent.keyDown(element, { code: "Enter" });
  t.is(lastValue, "2");

  r.unmount();
});
