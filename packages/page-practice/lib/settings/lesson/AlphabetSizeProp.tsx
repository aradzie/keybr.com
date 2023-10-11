import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { Field, FieldList, Range, styleSizeWide } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function AlphabetSizeProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <FieldList>
      <Field>
        <FormattedMessage
          id="settings.alphabetSizeLabel"
          description="Input field label."
          defaultMessage="Unlock more letters:"
        />
      </Field>
      <Field>
        <Range
          className={styleSizeWide}
          min={1}
          max={100}
          step={1}
          value={Math.round(
            settings.get(lessonProps.guided.alphabetSize) * 100,
          )}
          onChange={(value) => {
            updateSettings(
              settings.set(lessonProps.guided.alphabetSize, value / 100),
            );
          }}
        />
      </Field>
    </FieldList>
  );
}
