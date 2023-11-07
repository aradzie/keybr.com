import { FakeIntlProvider } from "@keybr/intl";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyLegend } from "./KeyLegend.tsx";

test("render not included", (t) => {
  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <KeyLegend
        className="custom"
        isIncluded={false}
        confidence={null}
        isFocused={false}
        isForced={false}
      />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render included", (t) => {
  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <KeyLegend
        className="custom"
        isIncluded={true}
        confidence={0.8}
        isFocused={true}
        isForced={true}
      />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
