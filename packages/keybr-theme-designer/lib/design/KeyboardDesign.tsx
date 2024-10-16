import { Field, FieldList } from "@keybr/widget";
import { Group } from "./Group.tsx";
import { ColorInput, makeAccessor } from "./input/ColorInput.tsx";
import { KeyboardPreview } from "./KeyboardPreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

const pinky = makeAccessor("--pinky-zone-color");
const ring = makeAccessor("--ring-zone-color");
const middle = makeAccessor("--middle-zone-color");
const leftIndex = makeAccessor("--left-index-zone-color");
const rightIndex = makeAccessor("--right-index-zone-color");
const thumb = makeAccessor("--thumb-zone-color");

export function KeyboardDesign() {
  return (
    <Group title="Keyboard Zone Colors">
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
      <PreviewPane>
        <KeyboardPreview />
      </PreviewPane>
    </Group>
  );
}
