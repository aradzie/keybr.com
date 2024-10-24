import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { LessonKeysPreview } from "./LessonKeysPreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

export function LessonKeysDesign() {
  return (
    <Group title="Lesson Key Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--slow-key-color"]} />
        </Field>
        <Field size={6}>Slow key</Field>
        <Field>
          <ColorInput accessor={prop["--fast-key-color"]} />
        </Field>
        <Field size={6}>Fast key</Field>
      </FieldList>
      <PreviewPane>
        <LessonKeysPreview />
      </PreviewPane>
    </Group>
  );
}
