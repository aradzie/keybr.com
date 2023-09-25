import { bundleStyles, init } from "@keybr/pages-browser";
import * as styles from "./HighScoresTable.module.less";

// This file is actually not included into pages.
// It exists only to force inclusion of styles into bundle.

init(null);

bundleStyles(styles);
