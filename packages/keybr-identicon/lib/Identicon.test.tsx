import test from "ava";
import TestRenderer from "react-test-renderer";
import { Identicon } from "./Identicon.tsx";

test("render", (t) => {
  const renderer = TestRenderer.create(<Identicon name="hello" />);

  t.snapshot(renderer.toJSON());
});
