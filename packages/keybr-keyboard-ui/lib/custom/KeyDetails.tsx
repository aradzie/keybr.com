import { type KeyCharacters, KeyModifier } from "@keybr/keyboard";
import { Field, FieldList, Name, Value } from "@keybr/widget";
import { CharacterInfo } from "./CharacterInfo.tsx";
import { ModifierInfo } from "./ModifierInfo.tsx";

export function KeyDetails({
  characters: { id, a, b, c, d },
}: {
  readonly characters: KeyCharacters;
}) {
  return (
    <>
      <FieldList>
        <Field size={6}>Id</Field>
        <Field>
          <Value>{id}</Value>
        </Field>
      </FieldList>
      <FieldList>
        <Field size={6}>
          <Name>
            <ModifierInfo modifier={KeyModifier.None} />
          </Name>
        </Field>
        <Field size={10}>
          <Value>
            <CharacterInfo character={a} />
          </Value>
        </Field>
        <Field size={6}>
          <Name>
            <ModifierInfo modifier={KeyModifier.Shift} />
          </Name>
        </Field>
        <Field size={10}>
          <Value>
            <CharacterInfo character={b} />
          </Value>
        </Field>
      </FieldList>
      <FieldList>
        <Field size={6}>
          <Name>
            <ModifierInfo modifier={KeyModifier.Alt} />
          </Name>
        </Field>
        <Field size={10}>
          <Value>
            <CharacterInfo character={c} />
          </Value>
        </Field>
        <Field size={6}>
          <Name>
            <ModifierInfo modifier={KeyModifier.ShiftAlt} />
          </Name>
        </Field>
        <Field size={10}>
          <Value>
            <CharacterInfo character={d} />
          </Value>
        </Field>
      </FieldList>
    </>
  );
}
