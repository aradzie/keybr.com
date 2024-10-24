import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { PreviewPane } from "./PreviewPane.tsx";
import { SyntaxPreview } from "./SyntaxPreview.tsx";

export function SyntaxDesign() {
  return (
    <Group title="Syntax Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--syntax-keyword"]} />
        </Field>
        <Field size={6}>Keywords</Field>
        <Field>
          <ColorInput accessor={prop["--syntax-number"]} />
        </Field>
        <Field size={6}>Numbers</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--syntax-string"]} />
        </Field>
        <Field size={6}>Strings</Field>
        <Field>
          <ColorInput accessor={prop["--syntax-comment"]} />
        </Field>
        <Field size={6}>Comments</Field>
      </FieldList>
      <PreviewPane>
        <SyntaxPreview />
      </PreviewPane>
    </Group>
  );
}
