import test from "ava";
import TestRenderer from "react-test-renderer";
import { Identicon } from "./Identicon.tsx";

test("render", (t) => {
  const testRenderer = TestRenderer.create(<Identicon name="hello" />);

  t.snapshot(testRenderer.toJSON());
});
