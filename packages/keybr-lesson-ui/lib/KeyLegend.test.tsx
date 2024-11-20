import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import { isNotNull } from "rich-assert";
import { KeyLegend } from "./KeyLegend.tsx";

test("render not included", () => {
  const r = render(
    <FakeIntlProvider>
      <KeyLegend
        isIncluded={false}
        confidence={null}
        isFocused={false}
        isForced={false}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.container.querySelector(".lessonKey_excluded"));

  r.unmount();
});

test("render included", () => {
  const r = render(
    <FakeIntlProvider>
      <KeyLegend
        isIncluded={true}
        confidence={0.8}
        isFocused={true}
        isForced={true}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.container.querySelector(".lessonKey_included"));

  r.unmount();
});
