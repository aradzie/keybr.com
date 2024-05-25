import {
  Field,
  FieldList,
  Icon,
  IconButton,
  Range,
  styleWidth32,
} from "@keybr/widget";
import { mdiSkipNext, mdiSkipPrevious } from "@mdi/js";
import { type ReactNode } from "react";
import { ParagraphIndex } from "./ParagraphPreview.tsx";

export function ParagraphSelector({
  paragraphs,
  paragraphIndex,
  onChange,
}: {
  readonly paragraphs: readonly string[];
  readonly paragraphIndex: number;
  readonly onChange: (paragraphIndex: number) => void;
}): ReactNode {
  return (
    <FieldList>
      <Field>Paragraph:</Field>
      <Field>
        <ParagraphIndex paragraphIndex={paragraphIndex} />
      </Field>
      <Field>
        <Range
          className={styleWidth32}
          min={0}
          max={paragraphs.length - 1}
          step={1}
          value={paragraphIndex}
          onChange={onChange}
        />
      </Field>
      <Field>
        <IconButton
          icon={<Icon shape={mdiSkipPrevious} />}
          onClick={() => {
            if (paragraphIndex > 0) {
              onChange(paragraphIndex - 1);
            }
          }}
        />
        <IconButton
          icon={<Icon shape={mdiSkipNext} />}
          onClick={() => {
            if (paragraphIndex < paragraphs.length - 1) {
              onChange(paragraphIndex + 1);
            }
          }}
        />
      </Field>
    </FieldList>
  );
}
