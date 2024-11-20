import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { isNotNull, isNull } from "rich-assert";
import { useView, ViewSwitch } from "./ViewSwitch.tsx";

const views = {
  one: One,
  two: Two,
  invalid: Invalid,
} as const;

test("switch", async () => {
  const r = render(<ViewSwitch views={views} />);

  isNotNull(r.queryByText("One"));
  isNull(r.queryByText("Two"));

  await userEvent.click(r.getByText("Switch"));

  isNotNull(r.queryByText("Two"));
  isNotNull(r.queryByText("Due"));
  isNull(r.queryByText("One"));
  isNull(r.queryByText("Uno"));

  await userEvent.click(r.getByText("Switch"));

  isNotNull(r.queryByText("One"));
  isNotNull(r.queryByText("Uno"));
  isNull(r.queryByText("Two"));
  isNull(r.queryByText("Due"));

  r.unmount();
});

function One({ name }: { name?: string } = {}) {
  const { setView } = useView(views);
  return (
    <div>
      <p>One</p>
      <p>{name}</p>
      <button
        onClick={() => {
          setView("two", { name: "Due" });
        }}
      >
        Switch
      </button>
    </div>
  );
}

function Two({ name }: { name?: string } = {}) {
  const { setView } = useView(views);
  return (
    <div>
      <p>Two</p>
      <p>{name}</p>
      <button
        onClick={() => {
          setView("one", { name: "Uno" });
        }}
      >
        Switch
      </button>
    </div>
  );
}

function Invalid() {
  const { setView } = useView(views);
  return (
    <div>
      <button
        onClick={() => {
          // @ts-expect-error Invalid view name.
          setView("omg");
        }}
      >
        Switch
      </button>
    </div>
  );
}
