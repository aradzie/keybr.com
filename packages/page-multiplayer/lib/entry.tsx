import { Connector } from "@keybr/multiplayer-ui";
import { init, Slot } from "@keybr/pages-browser";
import { usePageData } from "@keybr/pages-shared";
import { type ReactNode } from "react";

init(
  <Slot selector="main">
    <Main />
  </Slot>,
);

function Main(): ReactNode {
  const { publicUser } = usePageData();
  return <Connector user={publicUser} />;
}
