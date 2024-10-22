import { Syntax } from "@keybr/code";
import { type CodeLesson, lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  CheckBox,
  Description,
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
  const syntax = settings.get(lessonProps.code.syntax);
  const flags = settings.get(lessonProps.code.flags);
  return (
    <>
      <Explainer>
        <Description>
          <FormattedMessage
            id="lessonType.code.description"
            defaultMessage="Practice punctuation characters that are specific to a programming language syntax."
          />
        </Description>
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
              value={syntax.id}
              onSelect={(id) => {
                updateSettings(
                  settings.set(lessonProps.code.syntax, Syntax.ALL.get(id)),
                );
              }}
            />
          </Field>
          {[...syntax.flags].map((flag) => {
            return (
              <Field key={flag}>
                <CheckBox
                  label={flag}
                  checked={flags.includes(flag)}
                  onChange={(checked) => {
                    const set = new Set(flags);
                    if (checked) {
                      set.add(flag);
                    } else {
                      set.delete(flag);
                    }
                    updateSettings(
                      settings.set(lessonProps.code.flags, [...set]),
                    );
                  }}
                />
              </Field>
            );
          })}
        </FieldList>
        <Explainer>
          <Description>
            <FormattedMessage
              id="lessonType.syntax.description"
              defaultMessage="Generate lessons that resemble the specified programming language syntax."
            />
          </Description>
        </Explainer>
      </FieldSet>
    </>
  );
}
