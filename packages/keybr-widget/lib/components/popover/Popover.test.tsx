import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { type ReactNode, useState } from "react";
import { Button } from "../button/index.ts";
import { PortalContainer } from "../portal/index.ts";
import { Popover } from "./Popover.tsx";

test.before(() => {
  const container = document.createElement("div");
  container.id = PortalContainer.id;
  document.body.appendChild(container);
});

test("test", async () => {
  function UnderTest(): ReactNode {
    const [open, setOpen] = useState(false);
    return (
      <Popover
        anchor={
          <Button
            label="anchor"
            onClick={() => {
              setOpen(!open);
            }}
          />
        }
        open={open}
      >
        menu
      </Popover>
    );
  }

  const r = render(<UnderTest />);

  assert.isNull(r.queryByText("menu"));
  await userEvent.click(r.getByText("anchor"));
  assert.isNotNull(r.queryByText("menu"));
  await userEvent.click(r.getByText("anchor"));
  assert.isNull(r.queryByText("menu"));

  r.unmount();
});
