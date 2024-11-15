import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { KeyboardPreview } from "./KeyboardPreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

export function KeyboardDesign() {
  return (
    <Group title="Keyboard Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--pinky-zone-color"]} />
        </Field>
        <Field size={6}>Pinky</Field>
        <Field>
          <ColorInput accessor={prop["--ring-zone-color"]} />
        </Field>
        <Field size={6}>Ring</Field>
        <Field>
          <ColorInput accessor={prop["--middle-zone-color"]} />
        </Field>
        <Field size={6}>Middle</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--left-index-zone-color"]} />
        </Field>
        <Field size={6}>Left index</Field>
        <Field>
          <ColorInput accessor={prop["--right-index-zone-color"]} />
        </Field>
        <Field size={6}>Right index</Field>
        <Field>
          <ColorInput accessor={prop["--thumb-zone-color"]} />
        </Field>
        <Field size={6}>Thumb</Field>
      </FieldList>
      <PreviewPane>
        <KeyboardPreview />
      </PreviewPane>
    </Group>
  );
}
