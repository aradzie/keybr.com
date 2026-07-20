import { Field, FieldList, OptionList } from "@keybr/widget";
import { type ReactNode } from "react";
import { NamedWordList } from "./named.ts";

export function WordListSelector({
  wordList,
  options = [...NamedWordList.ALL],
  onChange,
}: {
  readonly wordList: NamedWordList;
  readonly options?: readonly NamedWordList[];
  readonly onChange: (wordList: NamedWordList) => void;
}): ReactNode {
  return (
    <FieldList>
      <Field>Word list:</Field>
      <Field>
        <OptionList
          size={24}
          options={options.map(({ id, title }) => ({
            value: id,
            name: title,
          }))}
          value={wordList.id}
          onSelect={(value) => {
            onChange(NamedWordList.ALL.get(value));
          }}
        />
      </Field>
    </FieldList>
  );
}
