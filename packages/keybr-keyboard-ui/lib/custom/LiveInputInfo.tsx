import { type KeyId, type KeyModifier } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { NameValue, Value } from "@keybr/widget";
import { CharacterInfo } from "./CharacterInfo.tsx";
import { ModifierInfo } from "./ModifierInfo.tsx";

export type LiveInputData = {
  readonly key: KeyId;
  readonly codePoint: CodePoint;
  readonly modifier: KeyModifier;
};

export function LiveInputInfo({
  inputData: { key, codePoint, modifier },
}: {
  readonly inputData: LiveInputData;
}) {
  return (
    <>
      <NameValue name="Id" value={key} />
      <NameValue
        name="Character"
        value={
          <Value>
            <CharacterInfo character={codePoint} />
          </Value>
        }
      />
      <NameValue
        name="Modifier"
        value={
          <Value>
            <ModifierInfo modifier={modifier} />
          </Value>
        }
      />
    </>
  );
}
