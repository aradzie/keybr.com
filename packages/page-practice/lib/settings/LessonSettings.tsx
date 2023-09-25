import { LessonType, useSettings } from "@keybr/settings";
import { RadioBox } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { CustomTextLessonSettings } from "./lesson/CustomTextLessonSettings.tsx";
import { DailyGoalSettings } from "./lesson/DailyGoalSettings.tsx";
import { GuidedLessonSettings } from "./lesson/GuidedLessonSettings.tsx";
import { NumbersLessonSettings } from "./lesson/NumbersLessonSettings.tsx";
import { WordListLessonSettings } from "./lesson/WordListLessonSettings.tsx";
import * as styles from "./LessonSettings.module.less";

export function LessonSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();

  return (
    <>
      <div className={styles.lessonTypeSwitch}>
        <div className={styles.lessonTypeSwitchItem}>
          <RadioBox
            onSelect={() =>
              updateSettings(
                settings.patch({
                  lessonType: LessonType.GUIDED,
                }),
              )
            }
            checked={settings.lessonType === LessonType.GUIDED}
            name="lesson-type"
            label={formatMessage({
              id: "lessonType.guided.name",
              description: "Widget label.",
              defaultMessage: "Guided lessons",
            })}
          />
        </div>

        <div className={styles.lessonTypeSwitchItem}>
          <RadioBox
            onSelect={() =>
              updateSettings(
                settings.patch({
                  lessonType: LessonType.WORDLIST,
                }),
              )
            }
            checked={settings.lessonType === LessonType.WORDLIST}
            name="lesson-type"
            label={formatMessage({
              id: "lessonType.wordlist.name",
              description: "Widget label.",
              defaultMessage: "Common words",
            })}
          />
        </div>

        <div className={styles.lessonTypeSwitchItem}>
          <RadioBox
            onSelect={() =>
              updateSettings(
                settings.patch({
                  lessonType: LessonType.CUSTOM,
                }),
              )
            }
            checked={settings.lessonType === LessonType.CUSTOM}
            name="lesson-type"
            label={formatMessage({
              id: "lessonType.customText.name",
              description: "Widget label.",
              defaultMessage: "Custom text",
            })}
          />
        </div>

        <div className={styles.lessonTypeSwitchItem}>
          <RadioBox
            onSelect={() =>
              updateSettings(
                settings.patch({
                  lessonType: LessonType.NUMBERS,
                }),
              )
            }
            checked={settings.lessonType === LessonType.NUMBERS}
            name="lesson-type"
            label={formatMessage({
              id: "lessonType.numbers.name",
              description: "Widget label.",
              defaultMessage: "Numbers",
            })}
          />
        </div>
      </div>

      {(() => {
        switch (settings.lessonType) {
          case LessonType.GUIDED:
            return <GuidedLessonSettings />;
          case LessonType.WORDLIST:
            return <WordListLessonSettings />;
          case LessonType.CUSTOM:
            return <CustomTextLessonSettings />;
          case LessonType.NUMBERS:
            return <NumbersLessonSettings />;
          default:
            throw new Error();
        }
      })()}

      <DailyGoalSettings />
    </>
  );
}
