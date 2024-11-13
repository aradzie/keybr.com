import { TextField } from "@keybr/widget";
import { useCustomLayout } from "./context.tsx";

export function LayoutJson() {
  const { layout } = useCustomLayout();
  return (
    <TextField
      size="full"
      type="textarea"
      value={JSON.stringify(layout.toJSON(), null, 2)}
      readOnly={true}
    />
  );
}
