import { lessonProps, Target } from "@keybr/lesson";
import { type Letter } from "@keybr/phonetic-model";
import { type NumberMap, useSettings } from "@keybr/settings";
import {
  Button,
  Description,
  Explainer,
  Field,
  FieldList,
  Icon,
  IconButton,
  Kbd,
  OptionList,
} from "@keybr/widget";
import { mdiClose } from "@mdi/js";
import { type ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { TargetSpeedFields } from "./TargetSpeedProp.tsx";

export function LetterTargetSpeedProp({
  letters,
}: {
  readonly letters: readonly Letter[];
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const letterTargetSpeed = settings.get(lessonProps.letterTargetSpeed);
  const customLetters = letters.filter((letter) =>
    letterTargetSpeed.has(Target.letterKey(letter)),
  );
  const otherLetters = letters.filter(
    (letter) => !letterTargetSpeed.has(Target.letterKey(letter)),
  );
  const [selected, setSelected] = useState("");
  const selectedLetter =
    otherLetters.find((letter) => Target.letterKey(letter) === selected) ??
    otherLetters[0];
  const update = (value: NumberMap) => {
    updateSettings(settings.set(lessonProps.letterTargetSpeed, value));
  };
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="t_Target_speed_for_individual_letters:"
            defaultMessage="Target speed for individual letters:"
          />
        </Field>
        {selectedLetter != null && (
          <>
            <Field>
              <OptionList
                size={10}
                options={otherLetters.map((letter) => ({
                  value: Target.letterKey(letter),
                  name: letter.label,
                }))}
                value={Target.letterKey(selectedLetter)}
                onSelect={setSelected}
              />
            </Field>
            <Field>
              <Button
                label={formatMessage({
                  id: "t_Add_letter",
                  defaultMessage: "Add letter",
                })}
                onClick={() => {
                  update(
                    new Map(letterTargetSpeed).set(
                      Target.letterKey(selectedLetter),
                      settings.get(lessonProps.targetSpeed),
                    ),
                  );
                }}
              />
            </Field>
          </>
        )}
      </FieldList>
      {customLetters.map((letter) => {
        const key = Target.letterKey(letter);
        return (
          <FieldList key={key}>
            <Field>
              <Kbd>{letter.label}</Kbd>
            </Field>
            <TargetSpeedFields
              value={letterTargetSpeed.get(key)!}
              onChange={(value) => {
                update(new Map(letterTargetSpeed).set(key, value));
              }}
            />
            <Field>
              <IconButton
                icon={<Icon shape={mdiClose} />}
                title={formatMessage({
                  id: "t_Remove_letter",
                  defaultMessage: "Remove letter",
                })}
                onClick={() => {
                  const value = new Map(letterTargetSpeed);
                  value.delete(key);
                  update(value);
                }}
              />
            </Field>
          </FieldList>
        );
      })}
      <Explainer>
        <Description>
          <FormattedMessage
            id="settings.letterTargetSpeed.description"
            defaultMessage="Set a different target speed for some letters, for example a lower one for the letters which are hard to reach. A letter with its own target speed uses it instead of the target speed above to measure its confidence level, its color, and when it is unlocked in the guided mode. All the other letters use the target speed above."
          />
        </Description>
      </Explainer>
    </>
  );
}
