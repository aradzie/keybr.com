import { render } from "@testing-library/react";
import test from "ava";
import { act } from "react";
import { Button } from "../button/index.ts";
import { PortalContainer } from "../portal/index.ts";
import { Popup } from "./Popup.tsx";

test.before(() => {
  const container = document.createElement("div");
  container.id = PortalContainer.id;
  document.body.appendChild(container);
});

test.serial("un-anchored", async (t) => {
  const r = render(
    <>
      <Popup>text</Popup>
    </>,
  );

  await act(async () => {});

  t.not(r.queryByText("text"), null);

  r.unmount();
});

test.serial("anchored", async (t) => {
  const r = render(
    <>
      <Button data-id="button" label="button" />
      <Popup anchor={"[data-id='button']"}>text</Popup>
    </>,
  );

  await act(async () => {});

  t.not(r.queryByText("text"), null);

  r.unmount();
});
