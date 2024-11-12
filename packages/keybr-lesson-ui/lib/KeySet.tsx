import { type LessonKey, type LessonKeys } from "@keybr/lesson";
import { type ClassName } from "@keybr/widget";
import { type ReactNode, useRef } from "react";
import { Key } from "./Key.tsx";

export const KeySet = ({
  id,
  className,
  lessonKeys,
  onKeyHoverIn,
  onKeyHoverOut,
  onKeyClick,
}: {
  readonly id?: string;
  readonly className?: ClassName;
  readonly lessonKeys: LessonKeys;
  readonly onKeyHoverIn?: (key: LessonKey, elem: Element) => void;
  readonly onKeyHoverOut?: (key: LessonKey, elem: Element) => void;
  readonly onKeyClick?: (key: LessonKey, elem: Element) => void;
}): ReactNode => {
  const ref = useRef<HTMLElement>(null);
  return (
    <span
      ref={ref}
      id={id}
      className={className}
      onMouseOver={(event) => {
        relayEvent(ref.current!, event, onKeyHoverIn);
      }}
      onMouseOut={(event) => {
        relayEvent(ref.current!, event, onKeyHoverOut);
      }}
      onClick={(event) => {
        relayEvent(ref.current!, event, onKeyClick);
      }}
    >
      {[...lessonKeys].map((lessonKey) => (
        <Key key={lessonKey.letter.codePoint} lessonKey={lessonKey} />
      ))}
    </span>
  );
};

function relayEvent(
  root: Element,
  { target }: { readonly target: any },
  handler?: (key: LessonKey, elem: Element) => void,
) {
  while (
    handler != null &&
    target instanceof Element &&
    root.contains(target)
  ) {
    const key = Key.attached(target);
    if (key) {
      handler(key, target);
      return;
    }
    target = target.parentElement;
  }
}
