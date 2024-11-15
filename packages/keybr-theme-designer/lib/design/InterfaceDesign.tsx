import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { InterfacePreview } from "./InterfacePreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

export function InterfaceDesign() {
  return (
    <Group title="Interface Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--Name-color"]} />
        </Field>
        <Field size={6}>Name</Field>
        <Field>
          <ColorInput accessor={prop["--Value-color"]} />
        </Field>
        <Field size={6}>Value</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--Value--more__color"]} />
        </Field>
        <Field size={6}>Increased value</Field>
        <Field>
          <ColorInput accessor={prop["--Value--less__color"]} />
        </Field>
        <Field size={6}>Decreased value</Field>
      </FieldList>
      <PreviewPane>
        <InterfacePreview />
      </PreviewPane>
    </Group>
  );
}
