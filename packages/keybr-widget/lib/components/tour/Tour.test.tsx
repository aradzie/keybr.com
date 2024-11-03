import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { assert } from "chai";
import { IntlProvider } from "react-intl";
import { PortalContainer } from "../portal/Portal.tsx";
import { Slide } from "./Slide.tsx";
import { Tour } from "./Tour.tsx";

test.before(() => {
  const container = document.createElement("div");
  container.id = PortalContainer.id;
  document.body.appendChild(container);
});

test("empty tour", () => {
  const r = render(
    <IntlProvider locale="en">
      <div>
        <Tour />
      </div>
    </IntlProvider>,
  );

  assert.isNull(r.queryByText("Previous"));
  assert.isNull(r.queryByText("Next"));
  assert.isNotNull(r.queryByText("Close"));

  r.unmount();
});

test("switch slides", async () => {
  const r = render(
    <IntlProvider locale="en">
      <div>
        <div className="anchor-1">anchor 1</div>
        <Tour>
          <Slide className="slide-a">One</Slide>
          <Slide className="slide-b" anchor=".anchor-1" position="block-start">
            Two
          </Slide>
        </Tour>
      </div>
    </IntlProvider>,
  );

  // First slide.

  assert.isNull(r.queryByText("Previous"));
  assert.isNotNull(r.queryByText("Next"));
  assert.isNull(r.queryByText("Close"));
  assert.isNotNull(r.queryByText("One"));
  assert.isNull(r.queryByText("Two"));

  // Click next.

  await userEvent.click(r.getByText("Next"));

  // Second slide.

  assert.isNotNull(r.queryByText("Previous"));
  assert.isNull(r.queryByText("Next"));
  assert.isNotNull(r.queryByText("Close"));
  assert.isNull(r.queryByText("One"));
  assert.isNotNull(r.queryByText("Two"));

  // Click prev.

  await userEvent.click(r.getByText("Previous"));

  // First slide.

  assert.isNull(r.queryByText("Previous"));
  assert.isNotNull(r.queryByText("Next"));
  assert.isNull(r.queryByText("Close"));
  assert.isNotNull(r.queryByText("One"));
  assert.isNull(r.queryByText("Two"));

  r.unmount();
});
