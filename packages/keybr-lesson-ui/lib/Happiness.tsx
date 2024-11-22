import { Icon } from "@keybr/widget";
import { mdiEmoticonHappy, mdiEmoticonSad } from "@mdi/js";
import * as styles from "./Happiness.module.less";

export function Happiness({ learningRate }: { learningRate: number }) {
  if (learningRate > 0) {
    return (
      <span className={styles.happy}>
        <Happy />
        {learningRate >= +5 && <Happy />}
        {learningRate >= +10 && <Happy />}
      </span>
    );
  }
  if (learningRate < 0) {
    return (
      <span className={styles.sad}>
        <Sad />
        {learningRate <= -5 && <Sad />}
        {learningRate <= -10 && <Sad />}
      </span>
    );
  }
  return null;
}

function Happy() {
  return <Icon className={styles.icon} shape={mdiEmoticonHappy} />;
}

function Sad() {
  return <Icon className={styles.icon} shape={mdiEmoticonSad} />;
}
