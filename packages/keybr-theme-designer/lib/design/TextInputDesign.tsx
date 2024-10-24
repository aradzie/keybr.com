import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { PreviewPane } from "./PreviewPane.tsx";
import { TextInputPreview } from "./TextInputPreview.tsx";

export function TextInputDesign() {
  return (
    <Group title="Text Input Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--textinput__color"]} />
        </Field>
        <Field size={6}>Text</Field>
        <Field>
          <ColorInput accessor={prop["--textinput--special__color"]} />
        </Field>
        <Field size={6}>Whitespace</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--textinput--hit__color"]} />
        </Field>
        <Field size={6}>Good Input</Field>
        <Field>
          <ColorInput accessor={prop["--textinput--miss__color"]} />
        </Field>
        <Field size={6}>Bad Input</Field>
      </FieldList>
      <PreviewPane>
        <TextInputPreview />
      </PreviewPane>
    </Group>
  );
}
