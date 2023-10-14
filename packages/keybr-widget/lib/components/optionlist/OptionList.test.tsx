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
  let value: string | undefined;

  const r = render(
    <Controlled options={options} onChange={(v) => (value = v)} />,
  );
  const element = r.getByTitle("underTest");

  await userEvent.click(r.getByText("One"));
  await userEvent.click(r.getByText("Two"));

  t.is(value, "2");

  await userEvent.click(r.getByText("Two"));
  await userEvent.click(r.getByText("One"));

  t.is(value, "1");

  fireEvent.keyDown(element, { code: "ArrowUp" });

  t.is(value, "2");

  fireEvent.keyDown(element, { code: "Space" });
  fireEvent.keyDown(element, { code: "ArrowDown" });
  fireEvent.keyDown(element, { code: "Enter" });

  t.is(value, "1");

  r.unmount();
});

function Controlled({
  options,
  onChange,
}: {
  readonly options: readonly OptionListOption[];
  readonly onChange: (value: string) => void;
}): ReactNode {
  const [value, setValue] = useState("1");
  return (
    <OptionList
      options={options}
      value={value}
      onSelect={(value) => {
        setValue(value);
        onChange(value);
      }}
      title="underTest"
    />
  );
}
