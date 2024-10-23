import { Field, FieldList } from "@keybr/widget";
import { Group } from "./Group.tsx";
import { ColorInput, makeAccessor } from "./input/ColorInput.tsx";
import { PreviewPane } from "./PreviewPane.tsx";
import { SyntaxPreview } from "./SyntaxPreview.tsx";

const prop = {
  ["keyword"]: makeAccessor("--syntax-keyword"),
  ["number"]: makeAccessor("--syntax-number"),
  ["string"]: makeAccessor("--syntax-string"),
  ["comment"]: makeAccessor("--syntax-comment"),
} as const;

export function SyntaxDesign() {
  return (
    <Group title="Syntax Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["keyword"]} />
        </Field>
        <Field size={6}>Keywords</Field>
        <Field>
          <ColorInput accessor={prop["number"]} />
        </Field>
        <Field size={6}>Numbers</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["string"]} />
        </Field>
        <Field size={6}>Strings</Field>
        <Field>
          <ColorInput accessor={prop["comment"]} />
        </Field>
        <Field size={6}>Comments</Field>
      </FieldList>
      <PreviewPane>
        <SyntaxPreview />
      </PreviewPane>
    </Group>
  );
}
