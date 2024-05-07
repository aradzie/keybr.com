import { render } from "@testing-library/react";
import test from "ava";
import { Identicon } from "./Identicon.tsx";

test("render", (t) => {
  const r = render(<Identicon name="User Name" />);

  t.not(r.queryByText("UN"), null);

  r.unmount();
});
