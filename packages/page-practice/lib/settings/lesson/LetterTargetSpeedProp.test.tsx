import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { FakeSettingsContext, useSettings } from "@keybr/settings";
import { fireEvent, render } from "@testing-library/react";
import { type ReactNode } from "react";
import { equal } from "rich-assert";
import { LetterTargetSpeedProp } from "./LetterTargetSpeedProp.tsx";

test("add and remove letters", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <LetterTargetSpeedProp letters={FakePhoneticModel.letters} />
        <SettingsJson />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  equal(r.queryAllByTitle("Remove letter").length, 0);
  equal(r.getByTestId("json").textContent, "{}");

  fireEvent.click(r.getByText("Add letter"));
  fireEvent.click(r.getByText("Add letter"));

  equal(r.queryAllByTitle("Remove letter").length, 2);
  equal(r.getByTestId("json").textContent, '{"a":175,"b":175}');

  fireEvent.click(r.getAllByTitle("Remove letter")[0]);

  equal(r.queryAllByTitle("Remove letter").length, 1);
  equal(r.getByTestId("json").textContent, '{"b":175}');

  r.unmount();
});

function SettingsJson(): ReactNode {
  const { settings } = useSettings();
  return (
    <pre data-testid="json">
      {JSON.stringify(
        lessonProps.letterTargetSpeed.toJson(
          settings.get(lessonProps.letterTargetSpeed),
        ),
      )}
    </pre>
  );
}
