import { type LessonKeys } from "@keybr/lesson";
import { type ClassName, styleTextTruncate } from "@keybr/widget";
import { FormattedMessage } from "react-intl";
import { Key } from "./Key.tsx";
import { KeyDetails } from "./KeyDetails.tsx";

export const CurrentKey = ({
  id,
  className,
  lessonKeys,
}: {
  id?: string;
  className?: ClassName;
  lessonKeys: LessonKeys;
}) => {
  const focusedKey = lessonKeys.findFocusedKey();
  return (
    <span id={id} className={className}>
      {focusedKey != null ? (
        <>
          <Key lessonKey={focusedKey} /> <KeyDetails lessonKey={focusedKey} />
        </>
      ) : (
        <span className={styleTextTruncate}>
          <FormattedMessage
            id="lesson.allKeysUnlocked.message"
            defaultMessage="All keys are unlocked."
          />
        </span>
      )}
    </span>
  );
};
