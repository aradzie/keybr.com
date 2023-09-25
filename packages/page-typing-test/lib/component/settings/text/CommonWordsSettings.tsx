import {
  type WordList,
  WordListLoader,
  wordListStats,
} from "@keybr/content-words";
import { languageName, useIntlNumbers } from "@keybr/intl";
import { Language } from "@keybr/layout";
import {
  Field,
  FieldList,
  FieldSet,
  NameValue,
  OptionList,
  Para,
  styleSizeFull,
  TextField,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { type CommonWordsSource } from "../../../generator/index.ts";
import { type SettingsEditorProps } from "../types.ts";

export function CommonWordsSettings({
  settings,
  patchSettings,
}: SettingsEditorProps): ReactNode {
  const { textSource } = settings as { readonly textSource: CommonWordsSource };
  return (
    <WordListLoader language={textSource.language}>
      {(wordList) => (
        <Tab
          settings={settings}
          patchSettings={patchSettings}
          wordList={wordList}
        />
      )}
    </WordListLoader>
  );
}

function Tab({
  settings,
  patchSettings,
  wordList,
}: SettingsEditorProps & {
  readonly wordList: WordList;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { textSource } = settings as { readonly textSource: CommonWordsSource };
  const { wordCount, avgWordLength } = wordListStats(wordList);
  return (
    <FieldSet legend="Common words">
      <Para>Type the common words.</Para>

      <FieldList>
        <Field>
          {formatMessage({
            id: "settings.selectLanguageLabel",
            description: "Dropdown label.",
            defaultMessage: "Language:",
          })}
        </Field>

        <Field>
          <OptionList
            options={Language.ALL.map((item) => ({
              value: item.id,
              name: formatMessage(languageName(item.id)),
            }))}
            title={formatMessage({
              id: "settings.selectLanguageTitle",
              description: "Dropdown title.",
              defaultMessage: "Select your spoken language.",
            })}
            value={textSource.language.id}
            onSelect={(id) => {
              patchSettings({
                ...settings,
                textSource: {
                  ...textSource,
                  language: Language.ALL.find((item) => item.id === id)!,
                },
              });
            }}
          />
        </Field>
      </FieldList>

      <Para>
        <TextField
          className={styleSizeFull}
          type="textarea"
          value={[...wordList].sort().join(", ")}
          disabled={true}
        />
      </Para>
      <Para>
        <NameValue name="Unique words" value={formatNumber(wordCount)} />
      </Para>
      <Para>
        <NameValue
          name="Average word length"
          value={formatNumber(avgWordLength, 2)}
        />
      </Para>
    </FieldSet>
  );
}
