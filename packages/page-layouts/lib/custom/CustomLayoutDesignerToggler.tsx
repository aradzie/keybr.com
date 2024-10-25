import { Button, Field, FieldList, Spacer } from "@keybr/widget";
import { lazy, Suspense, useState } from "react";

const LazyCustomLayoutDesigner = lazy(
  () => import("./LazyCustomLayoutDesigner.tsx"),
);

export function CustomLayoutDesignerToggler() {
  const [visible, setVisible] = useState(false);
  if (visible) {
    return (
      <Suspense>
        <LazyCustomLayoutDesigner />
        <Spacer size={3} />
      </Suspense>
    );
  } else {
    return (
      <>
        <FieldList>
          <Field.Filler />
          <Button
            onClick={() => {
              setVisible(true);
            }}
          >
            Design a custom layout
          </Button>
          <Field.Filler />
        </FieldList>
        <Spacer size={3} />
      </>
    );
  }
}
