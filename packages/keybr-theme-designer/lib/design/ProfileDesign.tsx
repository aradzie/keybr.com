import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { PreviewPane } from "./PreviewPane.tsx";
import { ProfilePreview } from "./ProfilePreview.tsx";

export function ProfileDesign() {
  return (
    <Group title="Profile Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--effort-color"]} />
        </Field>
        <Field size={6}>Effort</Field>
      </FieldList>
      <PreviewPane>
        <ProfilePreview />
      </PreviewPane>
    </Group>
  );
}
