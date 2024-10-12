import { Field, FieldList, FieldSet } from "@keybr/widget";
import { ColorInput, makeAccessor } from "./ColorInput.tsx";

const pinky = makeAccessor("--pinky-zone-color");
const ring = makeAccessor("--ring-zone-color");
const middle = makeAccessor("--middle-zone-color");
const leftIndex = makeAccessor("--left-index-zone-color");
const rightIndex = makeAccessor("--right-index-zone-color");
const thumb = makeAccessor("--thumb-zone-color");

export function KeyboardZoneColors() {
  return (
    <FieldSet legend="Keyboard Zone Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={pinky} />
        </Field>
        <Field size={6}>Pinky</Field>
        <Field>
          <ColorInput accessor={ring} />
        </Field>
        <Field size={6}>Ring</Field>
        <Field>
          <ColorInput accessor={middle} />
        </Field>
        <Field size={6}>Middle</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={leftIndex} />
        </Field>
        <Field size={6}>Left index</Field>
        <Field>
          <ColorInput accessor={rightIndex} />
        </Field>
        <Field size={6}>Right index</Field>
        <Field>
          <ColorInput accessor={thumb} />
        </Field>
        <Field size={6}>Thumb</Field>
      </FieldList>
    </FieldSet>
  );
}
