import { lessonProps } from "@keybr/lesson";
import { usePageData } from "@keybr/pages-shared";
import { useSettings } from "@keybr/settings";
import { useEffect, useRef } from "react";

const MAX_CUSTOM_TEXT_LENGTH = 10_000;

/**
 * Hook to apply custom text from URL query parameter to settings.
 * This reads the 'text' query parameter from the URL and sets it as
 * the custom text content in the lesson settings.
 *
 * The text is only applied once on mount and respects the maximum
 * length restriction of 10,000 characters.
 */
export function useUrlCustomText(): void {
  const pageData = usePageData();
  const { settings, updateSettings } = useSettings();
  const hasApplied = useRef(false);

  useEffect(() => {
    // Only apply if customText is provided in page data and we haven't applied it yet
    const customText = pageData.customText;
    if (customText == null || customText.trim() === "" || hasApplied.current) {
      return;
    }

    // Mark as applied to prevent infinite loop
    hasApplied.current = true;

    // Apply length restriction
    const trimmedText = customText.trim().slice(0, MAX_CUSTOM_TEXT_LENGTH);

    // Update settings with the custom text
    updateSettings(settings.set(lessonProps.customText.content, trimmedText));
  }, [pageData, settings, updateSettings]);
}
