import { useIntlDurations } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Field,
  FieldList,
  FieldSet,
  Para,
  Range,
  styleSizeWide,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function DailyGoalSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { formatDuration } = useIntlDurations();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldSet>
      <Para>
        {formatMessage({
          id: "settings.dailyGoalDescription",
          description: "Input field description.",
          defaultMessage:
            "Set the time you want to spend on the exercises daily.",
        })}
      </Para>
      <FieldList>
        <Field>
          {formatMessage({
            id: "settings.dailyGoalLabel",
            description: "Input field label.",
            defaultMessage: "Daily goal:",
          })}
        </Field>
        <Field>
          <Range
            className={styleSizeWide}
            min={0}
            max={24}
            step={1}
            value={Math.round(settings.get(lessonProps.dailyGoal) / 5)}
            title={formatMessage({
              id: "settings.dailyGoalTitle",
              description: "Input field title.",
              defaultMessage:
                "Daily goal to spend on the exercises in minutes.",
            })}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.dailyGoal, value * 5));
            }}
          />
        </Field>
        <Field>
          {settings.get(lessonProps.dailyGoal) === 0 ? (
            "Not set"
          ) : (
            <Value
              value={formatDuration({
                minutes: settings.get(lessonProps.dailyGoal),
              })}
            />
          )}
        </Field>
      </FieldList>
    </FieldSet>
  );
}
