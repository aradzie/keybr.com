import { test } from "node:test";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { act } from "react";
import { Button } from "../button/index.ts";
import { PortalContainer } from "../portal/index.ts";
import { Popup } from "./Popup.tsx";

test.before(() => {
  const container = document.createElement("div");
  container.id = PortalContainer.id;
  document.body.appendChild(container);
});

test("un-anchored", async () => {
  const r = render(
    <>
      <Popup>text</Popup>
    </>,
  );

  await act(async () => {});

  assert.isNotNull(r.queryByText("text"));

  r.unmount();
});

test("anchored", async () => {
  const r = render(
    <>
      <Button data-id="button" label="button" />
      <Popup anchor="[data-id='button']">text</Popup>
    </>,
  );

  await act(async () => {});

  assert.isNotNull(r.queryByText("text"));

  r.unmount();
});
