import { lessonProps, LessonType } from "@keybr/lesson";
import { usePageData } from "@keybr/pages-shared";
import { useSettings } from "@keybr/settings";
import { useEffect, useState } from "react";

const MAX_CUSTOM_TEXT_LENGTH = 10_000;

/**
 * Hook to apply custom text from URL query parameter.
 * This is session-only and does NOT persist to settings.
 *
 * The text is only applied once on mount and respects the maximum
 * length restriction of 10,000 characters.
 *
 * Returns the URL text if provided, null otherwise.
 */
export function useUrlCustomText(): string | null {
  const pageData = usePageData();
  const { settings, updateSettings } = useSettings();
  const [urlText, setUrlText] = useState<string | null>(null);

  useEffect(() => {
    const customText = pageData.customText;
    if (customText == null || customText.trim() === "") {
      return;
    }

    // Trim and apply length restriction
    const trimmedText = customText.trim().slice(0, MAX_CUSTOM_TEXT_LENGTH);
    setUrlText(trimmedText);

    // Only switch lesson type, don't modify customText content in settings
    if (settings.get(lessonProps.type) !== LessonType.CUSTOM) {
      updateSettings(settings.set(lessonProps.type, LessonType.CUSTOM));
    }
  }, [pageData, settings, updateSettings]);

  return urlText;
}
