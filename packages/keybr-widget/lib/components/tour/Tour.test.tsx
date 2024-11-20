import { test } from "node:test";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { IntlProvider } from "react-intl";
import { isNotNull, isNull } from "rich-assert";
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

  isNull(r.queryByText("Previous"));
  isNull(r.queryByText("Next"));
  isNotNull(r.queryByText("Close"));

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

  isNull(r.queryByText("Previous"));
  isNotNull(r.queryByText("Next"));
  isNull(r.queryByText("Close"));
  isNotNull(r.queryByText("One"));
  isNull(r.queryByText("Two"));

  // Click next.

  await userEvent.click(r.getByText("Next"));

  // Second slide.

  isNotNull(r.queryByText("Previous"));
  isNull(r.queryByText("Next"));
  isNotNull(r.queryByText("Close"));
  isNull(r.queryByText("One"));
  isNotNull(r.queryByText("Two"));

  // Click prev.

  await userEvent.click(r.getByText("Previous"));

  // First slide.

  isNull(r.queryByText("Previous"));
  isNotNull(r.queryByText("Next"));
  isNull(r.queryByText("Close"));
  isNotNull(r.queryByText("One"));
  isNull(r.queryByText("Two"));

  r.unmount();
});
