import {
  type CustomTextLesson,
  type GuidedLesson,
  type Lesson,
  type NumbersLesson,
  type WordListLesson,
} from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { LessonType, useSettings } from "@keybr/settings";
import { RadioBox } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { CustomTextLessonSettings } from "./lesson/CustomTextLessonSettings.tsx";
import { DailyGoalSettings } from "./lesson/DailyGoalSettings.tsx";
import { GuidedLessonSettings } from "./lesson/GuidedLessonSettings.tsx";
import { LessonPreview } from "./lesson/LessonPreview.tsx";
import { NumbersLessonSettings } from "./lesson/NumbersLessonSettings.tsx";
import { WordListLessonSettings } from "./lesson/WordListLessonSettings.tsx";
import * as styles from "./LessonSettings.module.less";

export function LessonSettings(): ReactNode {
  return <LessonLoader>{(lesson) => <Content lesson={lesson} />}</LessonLoader>;
}

function Content({ lesson }: { readonly lesson: Lesson }): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  const { lessonType } = settings;

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
            checked={lessonType === LessonType.GUIDED}
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
            checked={lessonType === LessonType.WORDLIST}
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
            checked={lessonType === LessonType.CUSTOM}
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
            checked={lessonType === LessonType.NUMBERS}
            name="lesson-type"
            label={formatMessage({
              id: "lessonType.numbers.name",
              description: "Widget label.",
              defaultMessage: "Numbers",
            })}
          />
        </div>
      </div>

      <LessonSettingsSelector lessonType={lessonType} lesson={lesson} />
      <DailyGoalSettings />
      <LessonPreview lesson={lesson} />
    </>
  );
}

function LessonSettingsSelector({
  lessonType,
  lesson,
}: {
  readonly lessonType: LessonType;
  readonly lesson: Lesson;
}): ReactNode {
  switch (lessonType) {
    case LessonType.GUIDED:
      return <GuidedLessonSettings lesson={lesson as GuidedLesson} />;
    case LessonType.WORDLIST:
      return <WordListLessonSettings lesson={lesson as WordListLesson} />;
    case LessonType.CUSTOM:
      return <CustomTextLessonSettings lesson={lesson as CustomTextLesson} />;
    case LessonType.NUMBERS:
      return <NumbersLessonSettings lesson={lesson as NumbersLesson} />;
    default:
      throw new Error();
  }
}
