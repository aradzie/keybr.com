import { type ReactNode } from "react";
import * as styles from "./styles.ts";

export const slot1 = "keybr_728x90_970x90_ATF";
export const slot2 = "keybr_160x600_Left";

export type AdDetails = {
  readonly id: string;
  readonly width: number;
  readonly height: number;
};

export const inventory: Record<string, AdDetails> = {
  BANNER_970X90_1: { id: slot1, width: 970, height: 90 },
  BANNER_160X600_1: { id: slot2, width: 160, height: 600 },
};

export function SetupAds({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  if (process.env.NODE_ENV === "development") {
    return null;
  }
  const html =
    `var freestar=freestar||{};` +
    `freestar.hitTime=Date.now();` +
    `freestar.queue=freestar.queue||[];` +
    `freestar.config=freestar.config||{};` +
    `freestar.config.enabled_slots=["${slot1}","${slot2}"];`;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: html }} />
      {children}
    </>
  );
}

export function AdBanner({
  name,
}: {
  readonly name: "BANNER_160X600_1" | "BANNER_970X90_1";
}): ReactNode {
  const { id, width, height } = inventory[name];
  if (process.env.NODE_ENV === "development") {
    return (
      <div
        style={{
          position: "relative",
          width: `${width}px`,
          height: `${height}px`,
          contain: "strict",
          background: "#999",
        }}
      />
    );
  }
  const html = `freestar.queue.push(function(){googletag.display("${id}");});`;
  return (
    <div
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        contain: "strict",
      }}
    >
      <div className={styles.placeholder} />
      <div id={id}>
        <script dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
