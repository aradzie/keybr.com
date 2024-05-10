import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { type ReactNode, useState } from "react";
import { Button } from "../button/index.ts";
import { PortalContainer } from "../portal/index.ts";
import { Popover } from "./Popover.tsx";

test.before(() => {
  const container = document.createElement("div");
  container.id = PortalContainer.id;
  document.body.appendChild(container);
});

test.serial("test", async (t) => {
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

  t.is(r.queryByText("menu"), null);
  await userEvent.click(r.getByText("anchor"));
  t.not(r.queryByText("menu"), null);
  await userEvent.click(r.getByText("anchor"));
  t.is(r.queryByText("menu"), null);

  r.unmount();
});
