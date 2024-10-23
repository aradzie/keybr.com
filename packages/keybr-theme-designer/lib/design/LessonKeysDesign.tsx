import { Field, FieldList } from "@keybr/widget";
import { Group } from "./Group.tsx";
import { ColorInput, makeAccessor } from "./input/ColorInput.tsx";
import { LessonKeysPreview } from "./LessonKeysPreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

const prop = {
  ["slow"]: makeAccessor("--slow-key-color"),
  ["fast"]: makeAccessor("--fast-key-color"),
} as const;

export function LessonKeysDesign() {
  return (
    <Group title="Lesson Key Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["slow"]} />
        </Field>
        <Field size={6}>Slow key</Field>
        <Field>
          <ColorInput accessor={prop["fast"]} />
        </Field>
        <Field size={6}>Fast key</Field>
      </FieldList>
      <PreviewPane>
        <LessonKeysPreview />
      </PreviewPane>
    </Group>
  );
}
