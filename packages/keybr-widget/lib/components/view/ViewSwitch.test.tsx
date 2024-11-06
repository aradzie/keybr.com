import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { useView, ViewSwitch } from "./ViewSwitch.tsx";

const views = {
  one: One,
  two: Two,
  invalid: Invalid,
} as const;

test("switch", async () => {
  const r = render(<ViewSwitch views={views} />);

  assert.isNotNull(r.queryByText("One"));
  assert.isNull(r.queryByText("Two"));

  await userEvent.click(r.getByText("Switch"));

  assert.isNotNull(r.queryByText("Two"));
  assert.isNotNull(r.queryByText("Due"));
  assert.isNull(r.queryByText("One"));
  assert.isNull(r.queryByText("Uno"));

  await userEvent.click(r.getByText("Switch"));

  assert.isNotNull(r.queryByText("One"));
  assert.isNotNull(r.queryByText("Uno"));
  assert.isNull(r.queryByText("Two"));
  assert.isNull(r.queryByText("Due"));

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
