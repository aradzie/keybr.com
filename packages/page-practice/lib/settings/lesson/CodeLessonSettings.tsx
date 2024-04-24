import { Syntax } from "@keybr/code";
import { type CodeLesson, lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Explainer,
  Field,
  FieldList,
  FieldSet,
  OptionList,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function CodeLessonSettings({
  lesson,
}: {
  readonly lesson: CodeLesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <Explainer>
        <FormattedMessage
          id="lessonType.code.description"
          defaultMessage="Practice punctuation characters that are specific to a programming language syntax."
        />
      </Explainer>
      <FieldSet
        legend={formatMessage({
          id: "settings.lessonOptions.legend",
          defaultMessage: "Lesson Options",
        })}
      >
        <FieldList>
          <Field>
            <FormattedMessage
              id="settings.syntax.label"
              defaultMessage="Syntax:"
            />
          </Field>
          <Field>
            <OptionList
              options={Syntax.ALL.map((item) => ({
                value: item.id,
                name: item.name,
              }))}
              value={settings.get(lessonProps.code.syntax).id}
              onSelect={(id) => {
                updateSettings(
                  settings.set(lessonProps.code.syntax, Syntax.ALL.get(id)),
                );
              }}
            />
          </Field>
        </FieldList>
        <Explainer>
          <FormattedMessage
            id="lessonType.syntax.description"
            defaultMessage="Generate lessons that reseble the specified programming language syntax."
          />
        </Explainer>
      </FieldSet>
    </>
  );
}
