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
          <Description>
            <FormattedMessage
              id="lessonType.syntax.description"
              defaultMessage="Generate lessons that resemble the specified programming language syntax."
            />
          </Description>
        </Explainer>

        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.codeCaptialLetters.label",
                defaultMessage: "Add capital letters",
              })}
              checked={settings.get(lessonProps.code.includeCapitalization)}
              onChange={(value) => {
                updateSettings(
                  settings.set(lessonProps.code.includeCapitalization, value),
                );
              }}
            />
          </Field>
        </FieldList>
        <Explainer>
          <Description>
            <FormattedMessage
              id="settings.codeCaptialLetters.description"
              defaultMessage="Add capitalized class names, function names, and constants as appropriate to the selected programming language. Use this option to practice typing the capital letters. We recommend to increase this value only if you have all punctuation characters above the target speed."
            />
          </Description>
        </Explainer>

        <FieldList>
          <Field>
            <CheckBox
              label={formatMessage({
                id: "settings.codeNumbers.label",
                defaultMessage: "Add numbers",
              })}
              checked={settings.get(lessonProps.code.includeNumbers)}
              onChange={(value) => {
                updateSettings(
                  settings.set(lessonProps.code.includeNumbers, value),
                );
              }}
            />
          </Field>
        </FieldList>
        <Explainer>
          <Description>
            <FormattedMessage
              id="settings.codeNumbers.description"
              defaultMessage="Add numbers as appropriate to the selected programming language. We recommend to increase this value only if you have all punctuation characters above the target speed."
            />
          </Description>
        </Explainer>
      </FieldSet>
    </>
  );
}
