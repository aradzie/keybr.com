import { CodeFlavor, type CodeLesson, lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { Field, FieldList, FieldSet, OptionList } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function CodeLessonSettings({
  lesson,
}: {
  readonly lesson: CodeLesson;
}): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldSet>
        <FieldList>
          <Field>
            <FormattedMessage
              id="settings.languageFlavor.label"
              defaultMessage="Language Flavor:"
            />
          </Field>
          <Field>
            <OptionList
              options={CodeFlavor.ALL.map((item) => ({
                value: item.id,
                name: item.name,
              }))}
              value={settings.get(lessonProps.code.flavor).id}
              onSelect={(id) => {
                updateSettings(
                  settings.set(lessonProps.code.flavor, CodeFlavor.ALL.get(id)),
                );
              }}
            />
          </Field>
        </FieldList>
      </FieldSet>
    </>
  );
}
