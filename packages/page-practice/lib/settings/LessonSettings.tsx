import {
  type CustomTextLesson,
  type GuidedLesson,
  lessonProps,
  LessonType,
  type NumbersLesson,
  type WordListLesson,
} from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { useSettings } from "@keybr/settings";
import { Tab, TabList } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { CustomTextLessonSettings } from "./lesson/CustomTextLessonSettings.tsx";
import { DailyGoalSettings } from "./lesson/DailyGoalSettings.tsx";
import { GuidedLessonSettings } from "./lesson/GuidedLessonSettings.tsx";
import { LessonPreview } from "./lesson/LessonPreview.tsx";
import { NumbersLessonSettings } from "./lesson/NumbersLessonSettings.tsx";
import { WordListLessonSettings } from "./lesson/WordListLessonSettings.tsx";

export function LessonSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { settings, updateSettings } = useSettings();
  return (
    <LessonLoader>
      {(lesson) => {
        return (
          <>
            <TabList
              selectedIndex={LessonType.ALL.indexOf(
                settings.get(lessonProps.type),
              )}
              onSelect={(index) => {
                updateSettings(
                  settings.set(lessonProps.type, LessonType.ALL.at(index)),
                );
              }}
            >
              <Tab
                label={formatMessage({
                  id: "lessonType.guided.name",
                  description: "Widget label.",
                  defaultMessage: "Guided lessons",
                })}
              >
                <GuidedLessonSettings lesson={lesson as GuidedLesson} />
              </Tab>

              <Tab
                label={formatMessage({
                  id: "lessonType.wordlist.name",
                  description: "Widget label.",
                  defaultMessage: "Common words",
                })}
              >
                <WordListLessonSettings lesson={lesson as WordListLesson} />
              </Tab>

              <Tab
                label={formatMessage({
                  id: "lessonType.customText.name",
                  description: "Widget label.",
                  defaultMessage: "Custom text",
                })}
              >
                <CustomTextLessonSettings lesson={lesson as CustomTextLesson} />
              </Tab>

              <Tab
                label={formatMessage({
                  id: "lessonType.numbers.name",
                  description: "Widget label.",
                  defaultMessage: "Numbers",
                })}
              >
                <NumbersLessonSettings lesson={lesson as NumbersLesson} />
              </Tab>
            </TabList>

            <LessonPreview lesson={lesson} />

            <DailyGoalSettings />
          </>
        );
      }}
    </LessonLoader>
  );
}
