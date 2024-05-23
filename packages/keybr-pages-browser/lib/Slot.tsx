import { type ReactNode } from "react";

export type SlotProps = {
  /**
   * The child to mount on an element matching the given selector.
   */
  readonly children: ReactNode;
  /**
   * The selector of the element to which to mount the child.
   */
  readonly selector: string;
};

/**
 * Slot is a virtual container that specifies where on the page its single
 * child should be rendered.
 *
 * It is a placeholder component that is only used for its props and must not
 * be rendered.
 */
export function Slot(props: SlotProps): ReactNode {
  throw new Error();
}
