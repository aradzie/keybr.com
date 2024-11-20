import { test } from "node:test";
import { render } from "@testing-library/react";
import { isNotNull } from "rich-assert";
import { Identicon } from "./Identicon.tsx";

test("render", () => {
  const r = render(<Identicon name="User Name" />);

  isNotNull(r.queryByText("UN"));

  r.unmount();
});
