import { lessonProps, LessonType } from "@keybr/lesson";
import { usePageData } from "@keybr/pages-shared";
import { useSettings } from "@keybr/settings";
import { useEffect, useRef, useState } from "react";

const MAX_CUSTOM_TEXT_LENGTH = 10_000;

/**
 * Hook to apply custom text from URL query parameter.
 * This is session-only and does NOT persist to settings.
 *
 * The text is only applied once on mount and respects the maximum
 * length restriction of 10,000 characters.
 *
 * Returns the URL text if provided and not yet applied, null otherwise.
 * Once applied to settings, returns null to allow normal editing.
 */
export function useUrlCustomText(): string | null {
  const pageData = usePageData();
  const { settings, updateSettings } = useSettings();
  const [urlText, setUrlText] = useState<string | null>(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const customText = pageData.customText;
    if (customText == null || customText.trim() === "") {
      return;
    }

    // Trim and apply length restriction
    const trimmedText = customText.trim().slice(0, MAX_CUSTOM_TEXT_LENGTH);

    // Check if text contains uppercase letters
    const hasUppercase = /[A-Z]/.test(trimmedText);

    // Prepare settings updates - start with content
    let updatedSettings = settings.set(
      lessonProps.customText.content,
      trimmedText,
    );

    // Only disable lowercase if text has uppercase letters
    if (hasUppercase) {
      updatedSettings = updatedSettings.set(
        lessonProps.customText.lowercase,
        false,
      );
    }

    // Switch lesson type to CUSTOM
    if (settings.get(lessonProps.type) !== LessonType.CUSTOM) {
      updatedSettings = updatedSettings.set(
        lessonProps.type,
        LessonType.CUSTOM,
      );
    }

    // Save all settings at once
    updateSettings(updatedSettings);

    // Remove ?text= from URL
    const url = new URL(window.location.href);
    url.searchParams.delete("text");
    window.history.replaceState({}, "", url.pathname + url.search);

    // Set the text in state for the initial render
    setUrlText(trimmedText);

    // Clear it immediately after so subsequent renders get null
    // This allows the user to edit and switch modes normally
    setTimeout(() => setUrlText(null), 0);
  }, [pageData, settings, updateSettings]);

  return urlText;
}
