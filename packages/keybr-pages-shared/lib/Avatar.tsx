import { Identicon } from "@keybr/identicon";
import { type ClassName, type MouseProps } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import * as styles from "./Avatar.module.less";
import { type AnyUser } from "./types.ts";

export function Avatar({
  user,
  size = "normal",
  className,
  ...props
}: {
  readonly user: AnyUser | null;
  readonly size?: "normal" | "medium" | "large";
  readonly className?: ClassName;
} & MouseProps): ReactNode {
  const sizeClassName = {
    [styles.size_normal]: size === "normal",
    [styles.size_medium]: size === "medium",
    [styles.size_large]: size === "large",
  };

  if (user == null) {
    return (
      <AnonymousImage
        {...props}
        className={clsx(
          styles.root,
          sizeClassName,
          styles.anonymousImage,
          className,
        )}
      />
    );
  }

  const { name, imageUrl } = user;
  if (imageUrl != null) {
    return (
      <CustomImage
        {...props}
        className={clsx(
          styles.root,
          sizeClassName,
          styles.customImage,
          className,
        )}
        src={imageUrl}
        alt="User image"
      />
    );
  }

  return (
    <Identicon
      {...props}
      className={clsx(styles.root, sizeClassName, className)}
      name={name}
    />
  );
}

function AnonymousImage({
  className,
  ...props
}: {
  readonly className?: ClassName;
} & MouseProps): ReactNode {
  return (
    <svg {...props} className={className} viewBox="0 0 24 24">
      <path d="M12 0c-6.625 0-12 5.375-12 12s5.375 12 12 12 12-5.375 12-12-5.375-12-12-12zM19.96 14.82c-1.090 3.74-4.27 6.455-8.040 6.455-3.775 0-6.96-2.725-8.045-6.475-1.19-0.1-2.125-1.18-2.125-2.51 0-1.27 0.855-2.315 1.965-2.495v-0.005c2.090-1.465 3.805-3.49 4.095-5.050l0.005 0.005v-0.015c1.355 2.625 6.3 5.19 11.825 5.060 0.1-0.015 0.195-0.035 0.295-0.035 1.275 0 2.31 1.135 2.31 2.535 0.005 1.39-1.020 2.52-2.285 2.53z" />
      <path d="M9.5 12.5c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z" />
      <path d="M16.5 12.5c0 0.552-0.448 1-1 1s-1-0.448-1-1c0-0.552 0.448-1 1-1s1 0.448 1 1z" />
      <path d="M14.695 17.105c-0.745 0.575-1.7 0.895-2.695 0.895s-1.95-0.32-2.695-0.895c-0.215-0.17-0.53-0.13-0.7 0.090s-0.13 0.53 0.090 0.7c0.915 0.71 2.090 1.105 3.305 1.105s2.39-0.395 3.305-1.105c0.22-0.17 0.26-0.485 0.090-0.7-0.17-0.22-0.485-0.26-0.7-0.090z" />
    </svg>
  );
}

function CustomImage({
  src,
  alt,
  className,
  ...props
}: {
  readonly src: string;
  readonly alt?: string;
  readonly className?: ClassName;
} & MouseProps): ReactNode {
  return <img {...props} src={src} alt={alt} className={className} />;
}
