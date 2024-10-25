import { KeyCharacters, type KeyId } from "@keybr/keyboard";
import { LayoutBuilder } from "@keybr/keyboard-io";
import { Tab, TabList } from "@keybr/widget";
import { useState } from "react";
import { KeyLayer } from "../KeyLayer.tsx";
import { VirtualKeyboard } from "../VirtualKeyboard.tsx";
import { useCustomLayout } from "./context.tsx";
import { KeyDetails } from "./KeyDetails.tsx";
import { LayoutJson } from "./LayoutJson.tsx";
import { LayoutTable } from "./LayoutTable.tsx";

export function LayoutView({
  keyId,
  setKeyId,
}: {
  readonly keyId: KeyId;
  readonly setKeyId: (keyId: KeyId) => void;
}) {
  const { keyboard, layout } = useCustomLayout();
  const [index, setIndex] = useState(0);
  return (
    <TabList selectedIndex={index} onSelect={setIndex}>
      <Tab label="Keyboard">
        <VirtualKeyboard keyboard={keyboard}>
          <KeyLayer
            depressedKeys={[keyId]}
            onKeyClick={(key) => {
              if (LayoutBuilder.isKey(key)) {
                setKeyId(key);
              }
            }}
          />
        </VirtualKeyboard>
        <KeyDetails
          characters={layout.get(keyId) ?? new KeyCharacters(keyId, 0, 0, 0, 0)}
        />
      </Tab>
      <Tab label="Table">
        <LayoutTable />
      </Tab>
      <Tab label="JSON">
        <LayoutJson />
      </Tab>
    </TabList>
  );
}
