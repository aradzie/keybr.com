import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import test from "ava";
import { IntlProvider } from "react-intl";
import { PortalContainer } from "../portal/Portal.tsx";
import { Slide } from "./Slide.tsx";
import { Tour } from "./Tour.tsx";

test.beforeEach((t) => {
  const container = document.createElement("div");
  container.id = PortalContainer.id;
  document.body.appendChild(container);
});

test.afterEach((t) => {
  document.body.textContent = "";
});

test.serial("empty tour", (t) => {
  const r = render(
    <IntlProvider locale="en">
      <div>
        <Tour />
      </div>
    </IntlProvider>,
  );

  t.is(r.queryByText("Previous"), null);
  t.is(r.queryByText("Next"), null);
  t.not(r.queryByText("Close"), null);

  r.unmount();
});

test.serial("switch slides", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <div>
        <div className="target-1">target 1</div>
        <Tour>
          <Slide className="slide-a">One</Slide>
          <Slide className="slide-b" target=".target-1" position="n">
            Two
          </Slide>
        </Tour>
      </div>
    </IntlProvider>,
  );

  // First slide.

  t.is(r.queryByText("Previous"), null);
  t.not(r.queryByText("Next"), null);
  t.is(r.queryByText("Close"), null);
  t.not(r.queryByText("One"), null);
  t.is(r.queryByText("Two"), null);

  // Click next.

  await userEvent.click(r.getByText("Next"));

  // Second slide.

  t.not(r.queryByText("Previous"), null);
  t.is(r.queryByText("Next"), null);
  t.not(r.queryByText("Close"), null);
  t.is(r.queryByText("One"), null);
  t.not(r.queryByText("Two"), null);

  // Click prev.

  await userEvent.click(r.getByText("Previous"));

  // First slide.

  t.is(r.queryByText("Previous"), null);
  t.not(r.queryByText("Next"), null);
  t.is(r.queryByText("Close"), null);
  t.not(r.queryByText("One"), null);
  t.is(r.queryByText("Two"), null);

  r.unmount();
});
