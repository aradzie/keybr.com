import { type ClassName } from "@keybr/widget";
import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { type PhoneticModel } from "./phoneticmodel.ts";

export function Alphabet({
  as: Component = "strong",
  className,
  id,
  title,
  model: { language, letters },
}: {
  readonly as?: ElementType<HTMLAttributes<HTMLElement>>;
  readonly className?: ClassName;
  readonly id?: string;
  readonly title?: string;
  readonly model: PhoneticModel;
}): ReactNode {
  return (
    <Component
      id={id}
      className={className}
      title={title}
      dir={language.direction}
    >
      {letters.map(({ label }) => label).join("")}
    </Component>
  );
}
