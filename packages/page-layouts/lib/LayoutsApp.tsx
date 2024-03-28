import { Layout, loadKeyboard, useFormattedNames } from "@keybr/keyboard";
import { Article, Header } from "@keybr/widget";
import { type ReactNode } from "react";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

export function LayoutsApp(): ReactNode {
  const { formatFullLayoutName } = useFormattedNames();

  const layouts = [
    loadKeyboard(Layout.EN_US),
    loadKeyboard(Layout.EN_DVORAK),
    loadKeyboard(Layout.EN_COLEMAK),
    loadKeyboard(Layout.EN_COLEMAK_DH),
    loadKeyboard(Layout.EN_WORKMAN),
  ];

  return (
    <Article>
      {...layouts.map((keyboard) => (
        <>
          <Header level={2}>{formatFullLayoutName(keyboard.layout)}</Header>
          <KeyFrequencyHeatmap keyboard={keyboard} />
        </>
      ))}
    </Article>
  );
}
