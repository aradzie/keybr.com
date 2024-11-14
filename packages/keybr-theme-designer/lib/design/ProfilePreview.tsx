import { EffortLegend, useEffort } from "@keybr/lesson-ui";
import { Box } from "@keybr/widget";

export function ProfilePreview() {
  const effort = useEffort();
  return (
    <Box alignItems="center" justifyContent="center">
      <div>
        <EffortLegend effort={effort} />
      </div>
    </Box>
  );
}
