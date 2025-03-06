import { useState, useEffect } from "react";
import { Para } from "@keybr/widget";
import { FormattedMessage } from "react-intl";
import * as styles from "./Countdown.module.less";

export function Countdown({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <div className={styles.root}>
      <Para align="center">
        <FormattedMessage
          id="countdown.message"
          defaultMessage="Starting in {count}"
          values={{ count }}
        />
      </Para>
    </div>
  );
}
