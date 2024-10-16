import {
  Button,
  CheckBox,
  Field,
  FieldList,
  OptionList,
  RadioBox,
  Range,
  TextField,
} from "@keybr/widget";

export function WidgetsPreview() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        sagittis vestibulum commodo. Integer et scelerisque massa. Quisque
        facilisis ante ac sodales facilisis.
      </p>
      <FieldList>
        <Field>
          <Button label="Button" />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <CheckBox label="One" checked={true} />
        </Field>
        <Field>
          <CheckBox label="Two" />
        </Field>
        <Field>
          <RadioBox label="One" checked={true} />
        </Field>
        <Field>
          <RadioBox label="Two" />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <Range min={0} max={9} step={1} value={0} />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <OptionList
            options={[
              { value: "a", name: "One" },
              { value: "b", name: "Two" },
              { value: "c", name: "Three" },
            ]}
            value="a"
          />
        </Field>
      </FieldList>
      <FieldList>
        <Field>
          <TextField value="Example" />
        </Field>
      </FieldList>
    </>
  );
}
