import { Field, FieldList, Icon, IconButton } from "@keybr/widget";
import { mdiMinusCircleOutline, mdiPlusCircleOutline } from "@mdi/js";
import { adjustColors } from "./adjust-colors.ts";
import { useCustomTheme } from "./context.ts";
import { Group } from "./Group.tsx";
import { PreviewPane } from "./PreviewPane.tsx";
import { WidgetsPreview } from "./WidgetsPreview.tsx";

export function GlobalAdjustments() {
  const { theme, setTheme } = useCustomTheme();
  return (
    <Group title="Global Adjustments">
      <FieldList>
        <Field.Filler />
        <Field>
          <IconButton
            icon={<Icon shape={mdiMinusCircleOutline} />}
            onClick={() => {
              setTheme(adjustColors(theme, "saturation", -0.05));
            }}
          />
        </Field>
        <Field>Saturation</Field>
        <Field>
          <IconButton
            icon={<Icon shape={mdiPlusCircleOutline} />}
            onClick={() => {
              setTheme(adjustColors(theme, "saturation", +0.05));
            }}
          />
        </Field>
        <Field.Filler />
      </FieldList>
      <FieldList>
        <Field.Filler />
        <Field>
          <IconButton
            icon={<Icon shape={mdiMinusCircleOutline} />}
            onClick={() => {
              setTheme(adjustColors(theme, "brightness", -0.05));
            }}
          />
        </Field>
        <Field>Brightness</Field>
        <Field>
          <IconButton
            icon={<Icon shape={mdiPlusCircleOutline} />}
            onClick={() => {
              setTheme(adjustColors(theme, "brightness", +0.05));
            }}
          />
        </Field>
        <Field.Filler />
      </FieldList>
      <PreviewPane>
        <WidgetsPreview />
      </PreviewPane>
    </Group>
  );
}
