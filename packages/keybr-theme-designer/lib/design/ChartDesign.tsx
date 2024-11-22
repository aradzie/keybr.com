import { Field, FieldList } from "@keybr/widget";
import { prop } from "./accessors.ts";
import { ChartPreview } from "./ChartPreview.tsx";
import { Group } from "./Group.tsx";
import { ColorInput } from "./input/ColorInput.tsx";
import { PreviewPane } from "./PreviewPane.tsx";

export function ChartDesign() {
  return (
    <Group title="Chart Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--Chart-speed__color"]} />
        </Field>
        <Field size={6}>Speed</Field>
        <Field>
          <ColorInput accessor={prop["--Chart-accuracy__color"]} />
        </Field>
        <Field size={6}>Accuracy</Field>
        <Field>
          <ColorInput accessor={prop["--Chart-complexity__color"]} />
        </Field>
        <Field size={6}>Complexity</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--Chart-threshold__color"]} />
        </Field>
        <Field size={6}>Threshold</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={prop["--Chart-hist-h__color"]} />
        </Field>
        <Field size={6}>Color 1</Field>
        <Field>
          <ColorInput accessor={prop["--Chart-hist-m__color"]} />
        </Field>
        <Field size={6}>Color 2</Field>
        <Field>
          <ColorInput accessor={prop["--Chart-hist-r__color"]} />
        </Field>
        <Field size={6}>Color 3</Field>
      </FieldList>
      <PreviewPane>
        <ChartPreview />
      </PreviewPane>
    </Group>
  );
}
