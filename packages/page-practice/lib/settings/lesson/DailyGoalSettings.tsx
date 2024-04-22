import { useIntlDurations } from "@keybr/intl";
import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Explainer,
  Field,
  FieldList,
  FieldSet,
  Range,
  styleWidth16,
  Value,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function DailyGoalSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { formatDuration } = useIntlDurations();
  const { settings, updateSettings } = useSettings();
  return (
    <FieldSet>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.dailyGoal.label"
            defaultMessage="Daily goal:"
          />
        </Field>
        <Field>
          <Range
            className={styleWidth16}
            min={0}
            max={24}
            step={1}
            value={Math.round(settings.get(lessonProps.dailyGoal) / 5)}
            onChange={(value) => {
              updateSettings(settings.set(lessonProps.dailyGoal, value * 5));
            }}
          />
        </Field>
        <Field>
          {settings.get(lessonProps.dailyGoal) === 0 ? (
            formatMessage({
              id: "settings.dailyGoal.notSet",
              defaultMessage: "Not set",
            })
          ) : (
            <Value
              value={formatDuration({
                minutes: settings.get(lessonProps.dailyGoal),
              })}
            />
          )}
        </Field>
      </FieldList>
      <Explainer>
        <FormattedMessage
          id="settings.dailyGoal.description"
          defaultMessage="Set the time you want to spend on the exercises daily. It is a simple reminder which does not limit you in any way. You can stop practicing whenever you want."
        />
      </Explainer>
    </FieldSet>
  );
}
