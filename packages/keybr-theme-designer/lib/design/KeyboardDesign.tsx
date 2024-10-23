import { Field, FieldList } from "@keybr/widget";
import { Group } from "./Group.tsx";
import { ColorInput, makeAccessor } from "./input/ColorInput.tsx";
import { KeyboardPreview } from "./KeyboardPreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

const prop = {
  ["pinky"]: makeAccessor("--pinky-zone-color"),
  ["ring"]: makeAccessor("--ring-zone-color"),
  ["middle"]: makeAccessor("--middle-zone-color"),
  ["leftIndex"]: makeAccessor("--left-index-zone-color"),
  ["rightIndex"]: makeAccessor("--right-index-zone-color"),
  ["thumb"]: makeAccessor("--thumb-zone-color"),
} as const;

export function KeyboardDesign() {
  return (
    <Group title="Keyboard Zone Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["pinky"]} />
        </Field>
        <Field size={6}>Pinky</Field>
        <Field>
          <ColorInput accessor={prop["ring"]} />
        </Field>
        <Field size={6}>Ring</Field>
        <Field>
          <ColorInput accessor={prop["middle"]} />
        </Field>
        <Field size={6}>Middle</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["leftIndex"]} />
        </Field>
        <Field size={6}>Left index</Field>
        <Field>
          <ColorInput accessor={prop["rightIndex"]} />
        </Field>
        <Field size={6}>Right index</Field>
        <Field>
          <ColorInput accessor={prop["thumb"]} />
        </Field>
        <Field size={6}>Thumb</Field>
      </FieldList>
      <PreviewPane>
        <KeyboardPreview />
      </PreviewPane>
    </Group>
  );
}
