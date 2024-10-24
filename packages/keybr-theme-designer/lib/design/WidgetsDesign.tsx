import { Field, FieldList } from "@keybr/widget";
import { Group } from "./Group.tsx";
import {
  type Accessor,
  black,
  ColorInput,
  white,
} from "./input/ColorInput.tsx";
import { PreviewPane } from "./PreviewPane.tsx";
import { WidgetsPreview } from "./WidgetsPreview.tsx";

const primary: Accessor = {
  getColor: (theme) => theme.getColor("--primary") ?? black,
  setColor: (theme, color) => {
    return theme
      .set("--primary-d2", color.darken(0.1).toRgb())
      .set("--primary-d1", color.darken(0.05).toRgb())
      .set("--primary", color)
      .set("--primary-l1", color.lighten(0.05).toRgb())
      .set("--primary-l2", color.lighten(0.1).toRgb());
  },
};

const secondary: Accessor = {
  getColor: (theme) => theme.getColor("--secondary") ?? white,
  setColor: (theme, color) => {
    return theme
      .set("--secondary-d1", color.darken(0.05).toRgb())
      .set("--secondary", color)
      .set("--secondary-l1", color.lighten(0.05).toRgb())
      .set("--secondary-l2", color.lighten(0.1).toRgb())
      .set("--secondary-f1", color.lighten(0.05).toRgb())
      .set("--secondary-f2", color.lighten(0.1).toRgb());
  },
};

const accent: Accessor = {
  getColor: (theme) => theme.getColor("--accent") ?? black,
  setColor: (theme, color) => {
    return theme
      .set("--accent-d2", color.darken(0.1).toRgb())
      .set("--accent-d1", color.darken(0.05).toRgb())
      .set("--accent", color)
      .set("--accent-l1", color.lighten(0.05).toRgb())
      .set("--accent-l2", color.lighten(0.1).toRgb());
  },
};

export function WidgetsDesign() {
  return (
    <Group title="Page Colors">
      <FieldList>
        <Field>
          <ColorInput accessor={primary} />
        </Field>
        <Field>Background</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={secondary} />
        </Field>
        <Field>Text</Field>
      </FieldList>
      <FieldList>
        <Field>
          <ColorInput accessor={accent} />
        </Field>
        <Field>Button</Field>
      </FieldList>
      <PreviewPane>
        <WidgetsPreview />
      </PreviewPane>
    </Group>
  );
}
