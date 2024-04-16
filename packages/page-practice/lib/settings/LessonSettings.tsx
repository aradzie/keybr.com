import {
  type CodeLesson,
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
import { CodeLessonSettings } from "./lesson/CodeLessonSettings.tsx";
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
      {(lesson) => (
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
                defaultMessage: "Guided lessons",
              })}
            >
              <GuidedLessonSettings lesson={lesson as GuidedLesson} />
            </Tab>

            <Tab
              label={formatMessage({
                id: "lessonType.wordlist.name",
                defaultMessage: "Common words",
              })}
            >
              <WordListLessonSettings lesson={lesson as WordListLesson} />
            </Tab>

            <Tab
              label={formatMessage({
                id: "lessonType.customText.name",
                defaultMessage: "Custom text",
              })}
            >
              <CustomTextLessonSettings lesson={lesson as CustomTextLesson} />
            </Tab>

            <Tab
              label={formatMessage({
                id: "lessonType.numbers.name",
                defaultMessage: "Numbers",
              })}
            >
              <NumbersLessonSettings lesson={lesson as NumbersLesson} />
            </Tab>

            <Tab
              label={formatMessage({
                id: "lessonType.code.name",
                defaultMessage: "Source Code",
              })}
            >
              <CodeLessonSettings lesson={lesson as CodeLesson} />
            </Tab>
          </TabList>

          <LessonPreview lesson={lesson} />

          <DailyGoalSettings />
        </>
      )}
    </LessonLoader>
  );
}
