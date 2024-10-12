import { Field, FieldList, FieldSet } from "@keybr/widget";
import { ColorInput, makeAccessor } from "./ColorInput.tsx";

const slowKey = makeAccessor("--slow-key-color");
const fastKey = makeAccessor("--fast-key-color");

export function KeySpeedColors() {
  return (
    <FieldSet legend="Key Speed Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={slowKey} />
        </Field>
        <Field size={6}>Slow key</Field>
        <Field>
          <ColorInput accessor={fastKey} />
        </Field>
        <Field size={6}>Fast key</Field>
      </FieldList>
    </FieldSet>
  );
}
