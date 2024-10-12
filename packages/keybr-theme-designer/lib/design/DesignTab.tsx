import { Box } from "@keybr/widget";
import { BackgroundImage } from "./BackgroundImage.tsx";
import { Controls } from "./Controls.tsx";
import * as styles from "./DesignTab.module.less";
import { KeyboardZoneColors } from "./KeyboardZoneColors.tsx";
import { KeySpeedColors } from "./KeySpeedColors.tsx";
import { PageColors } from "./PageColors.tsx";

export function DesignTab() {
  return (
    <Box className={styles.root} direction="column">
      <div className={styles.scroll}>
        <PageColors />
        <BackgroundImage />
        <KeySpeedColors />
        <KeyboardZoneColors />
      </div>
      <Controls />
    </Box>
  );
}
