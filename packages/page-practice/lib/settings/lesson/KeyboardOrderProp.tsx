import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { CheckBox, Explainer, Field, FieldList } from "@keybr/widget";
import { type ReactNode } from "react";

export function KeyboardOrderProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <CheckBox
            label="Sort letters in the order of keyboard keys"
            checked={settings.get(lessonProps.guided.keyboardOrder)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.guided.keyboardOrder, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        Sort letters in such a way that the letters from the home row come
        first, then the letters from the top row, and finally all the remaining
        letters. Home row is the row with the CapsLock key. Top row is the row
        with the Tab key. It is easier and faster to type when your fingers do
        not need to move away from the home row. This feature works best with
        optimized layouts, like Dvorak or Colemak. In the Qwerty layout, the
        only vowel on the home row is A, so it severely limits the choice of
        words, and the algorithm will use more pseudo-words than usual.
      </Explainer>
    </>
  );
}
