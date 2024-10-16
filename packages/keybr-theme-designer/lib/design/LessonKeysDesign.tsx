import { Field, FieldList } from "@keybr/widget";
import { Group } from "./Group.tsx";
import { ColorInput, makeAccessor } from "./input/ColorInput.tsx";
import { LessonKeysPreview } from "./LessonKeysPreview.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

const slowKey = makeAccessor("--slow-key-color");
const fastKey = makeAccessor("--fast-key-color");

export function LessonKeysDesign() {
  return (
    <Group title="Lesson Key Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={slowKey} />
        </Field>
        <Field size={6}>Slow key</Field>
        <Field>
          <ColorInput accessor={fastKey} />
        </Field>
        <Field size={6}>Fast key</Field>
      </FieldList>
      <PreviewPane>
        <LessonKeysPreview />
      </PreviewPane>
    </Group>
  );
}
