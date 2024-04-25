import { mdiClose } from "@mdi/js";
import { type ReactNode } from "react";
import { IconButton } from "../button/index.ts";
import { Icon } from "../icon/index.ts";
import { useToast } from "./context.tsx";

export function CloseButton(): ReactNode {
  const toast = useToast();
  return (
    <IconButton
      icon={<Icon shape={mdiClose} />}
      onClick={() => {
        toast.close();
      }}
    />
  );
}
