import {
  type Lesson,
  type LessonKey,
  type LessonKeys,
  lockAllKeys,
  lockKey,
  parseManualLocks,
  unlockKey,
} from "@keybr/lesson";
import { lessonProps } from "@keybr/lesson";
import { KeySetRow } from "@keybr/lesson-ui";
import { makeKeyStatsMap, useResults } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Button, Field, FieldList, FieldSet, Kbd } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "./KeyLockControls.module.less";

export function KeyLockControls({
  lesson,
}: {
  readonly lesson: Lesson;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const { results } = useResults();

  // Get current lesson keys
  const lessonKeys = lesson.update(
    makeKeyStatsMap(lesson.letters, lesson.filter(results)),
  );

  const handleKeyClick = (key: LessonKey) => {
    // Toggle lock/unlock state with direct click (no modifier needed)
    const manualLocks = parseManualLocks(
      settings.get(lessonProps.guided.manualLocks),
    );
    if (manualLocks.has(key.letter.codePoint)) {
      // Unlock the key
      updateSettings(unlockKey(settings, key.letter.codePoint));
    } else {
      // Lock the key (unless it's one of the first 6 minimum keys)
      const minSize = 6;
      const minCodePoint =
        lessonKeys.letters[Math.min(minSize, lessonKeys.letters.length) - 1]
          ?.codePoint ?? 0;
      if (key.letter.codePoint > minCodePoint) {
        updateSettings(lockKey(settings, key.letter.codePoint));
      }
    }
  };

  const handleLockAll = () => {
    // Recreate initial state: only first 6 keys unlocked, rest locked
    // This matches the "new setup" behavior while keeping history
    updateSettings(
      settings.set(lessonProps.guided.manualLocks, lockAllKeys(lesson.letters)),
    );
  };

  const handleUnlockAll = () => {
    // Clear all manual locks - restore automatic progression
    updateSettings(settings.set(lessonProps.guided.manualLocks, ""));
  };

  const manualLocks = parseManualLocks(
    settings.get(lessonProps.guided.manualLocks),
  );
  const minSize = 6;
  const minCodePoint =
    lessonKeys.letters[Math.min(minSize, lessonKeys.letters.length) - 1]
      ?.codePoint ?? 0;
  const hasLocks = manualLocks.size > 0;
  const allLocked =
    manualLocks.size === Math.max(0, lessonKeys.letters.length - minSize);

  return (
    <FieldSet
      legend={formatMessage({
        id: "t_Manual_key_controls",
        defaultMessage: "Manual Key Controls",
      })}
    >
      <FieldList>
        <Field>
          <Button onClick={handleLockAll} disabled={allLocked}>
            {formatMessage({
              id: "t_Lock_all_keys",
              defaultMessage: "Lock All Keys (Reset to Initial)",
            })}
          </Button>
        </Field>
        <Field>
          <Button onClick={handleUnlockAll} disabled={!hasLocks}>
            {formatMessage({
              id: "t_Unlock_all_keys",
              defaultMessage: "Unlock All Keys (Auto Progression)",
            })}
          </Button>
        </Field>
      </FieldList>
      <div className={styles.hint}>
        <FormattedMessage
          id="t_Key_lock_hint"
          defaultMessage="Click any key to lock/unlock it. First 6 keys cannot be locked."
        />
      </div>
      <KeySetRow
        lessonKeys={lessonKeys}
        onKeyClick={handleKeyClick}
        manualLocks={manualLocks}
        names={{ keySet: "key-lock-controls" }}
      />
      <div className={styles.hint}>
        <Kbd>
          <FormattedMessage
            id="t_Key_lock_legend"
            defaultMessage="🔒 = Locked key"
          />
        </Kbd>
      </div>
    </FieldSet>
  );
}
