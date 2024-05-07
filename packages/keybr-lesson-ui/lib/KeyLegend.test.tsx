import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { KeyLegend } from "./KeyLegend.tsx";

test.serial("render not included", (t) => {
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

  t.not(r.container.querySelector(".lessonKey_excluded"), null);

  r.unmount();
});

test.serial("render included", (t) => {
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

  t.not(r.container.querySelector(".lessonKey_included"), null);

  r.unmount();
});
