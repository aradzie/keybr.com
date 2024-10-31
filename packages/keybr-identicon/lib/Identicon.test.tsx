import { test } from "node:test";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { Identicon } from "./Identicon.tsx";

test("render", () => {
  const r = render(<Identicon name="User Name" />);

  assert.isNotNull(r.queryByText("UN"));

  r.unmount();
});
